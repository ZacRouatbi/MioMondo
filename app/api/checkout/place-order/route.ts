import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { secureRequest } from "@/lib/core/gateway";
import { CheckoutFormSchema } from "@/lib/validation-schemas";

const WC_URL = process.env.WC_URL!;
const WC_KEY = process.env.WC_KEY!;
const WC_SECRET = process.env.WC_SECRET!;

const wcAuth = `Basic ${Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString("base64")}`;

export async function POST(req: NextRequest) {
  try {
    const gateway = await secureRequest(req as any, "checkout");
    if (!gateway.ok) {
      return NextResponse.json({ message: "Trop de tentatives. Veuillez patienter." }, { status: 429 });
    }

    const body = await req.json();
    const parsed = CheckoutFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: "Données invalides", errors: parsed.error.flatten() }, { status: 400 });
    }

    const data = parsed.data;
    const token = (await cookies()).get("mio_auth_token")?.value;
    const incomingItems = data.items;

    // 1. ✅ Fetch real prices (Security check)
    const lineItems = await Promise.all(
      incomingItems.map(async (item) => {
        const productRes = await fetch(`${WC_URL}/wp-json/wc/v3/products/${item.id}`, { headers: { Authorization: wcAuth } });
        if (!productRes.ok) throw new Error(`Produit introuvable: ${item.id}`);
        
        return {
          product_id: item.id,
          quantity: item.quantity,
          ...(item.variationId ? { variation_id: item.variationId } : {}),
        };
      })
    );

    // 2. 🚚 Fetch Dynamic Shipping from WooCommerce
    // We fetch shipping zones to find the right cost
    const zonesRes = await fetch(`${WC_URL}/wp-json/wc/v3/shipping/zones`, { headers: { Authorization: wcAuth } });
    const zones = await zonesRes.json();
    
    // For simplicity, we fetch methods from the first active zone (usually 'Tunisie' in your case)
    // Or you can map 'data.state' to a specific zone ID if you have different prices per city
    const methodsRes = await fetch(`${WC_URL}/wp-json/wc/v3/shipping/zones/${zones[0]?.id || 0}/methods`, { headers: { Authorization: wcAuth } });
    const methods = await methodsRes.json();
    const activeMethod = methods.find((m: any) => m.enabled) || { method_id: "flat_rate", settings: { cost: { value: "7" } } };

    const shippingLine = {
      method_id: activeMethod.method_id,
      method_title: activeMethod.title || "Livraison standard",
      total: activeMethod.settings.cost?.value || "7.00", 
    };

    const paymentTitles: Record<string, string> = {
      cod: "Paiement à la livraison",
      clictopay: "Carte Bancaire (ClicToPay)",
      pay_sur_place: "Paiement sur place",
    };

    const billing = {
      ...data,
      address_2: data.address_2 || "",
      postcode: data.postcode || "",
      country: "TN",
    };

    const orderPayload: any = {
      payment_method: data.payment_method,
      payment_method_title: paymentTitles[data.payment_method] || data.payment_method,
      set_paid: false,
      billing,
      shipping: billing,
      line_items: lineItems,
      shipping_lines: [shippingLine],
      customer_note: data.notes || "",
    };

    if (data.coupon) orderPayload.coupon_lines = [{ code: data.coupon }];
    if (gateway.identity?.userId) orderPayload.customer_id = Number(gateway.identity.userId);

    // 3. 📝 Create Order
    const orderRes = await fetch(`${WC_URL}/wp-json/wc/v3/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: wcAuth },
      body: JSON.stringify(orderPayload),
    });

    if (!orderRes.ok) {
      const err = await orderRes.json();
      return NextResponse.json({ message: err.message || "Erreur WooCommerce" }, { status: 500 });
    }

    const order = await orderRes.json();

    // 4. 🔗 Handle ClicToPay Redirect (Plugin Mode)
    if (data.payment_method === "clictopay") {
      // The plugin generates a 'payment_url' automatically for the order.
      // We send the user to the WooCommerce "Pay for Order" page which triggers the bank gateway.
      if (order.payment_url) {
        return NextResponse.json({ 
          order_id: order.id, 
          redirect_url: order.payment_url 
        });
      }
    }

    // 5. Special response for Shop Pickup
    if (data.payment_method === "pay_sur_place") {
      return NextResponse.json({
        order_id: order.id,
        requires_action: "visit_store",
        expiry_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      });
    }

    return NextResponse.json({ order_id: order.id });

  } catch (err: any) {
    console.error("[checkout/place-order]", err);
    return NextResponse.json({ message: err.message || "Erreur serveur" }, { status: 500 });
  }
}