import { NextRequest, NextResponse } from "next/server";
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
      return NextResponse.json(
        { message: "Trop de tentatives. Veuillez patienter." }, 
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = CheckoutFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Données invalides", errors: parsed.error.flatten() }, 
        { status: 400 }
      );
    }

    const data = parsed.data;
    const incomingItems = data.items;

    if (!incomingItems || incomingItems.length === 0) {
      return NextResponse.json({ message: "Le panier est vide" }, { status: 400 });
    }

    const productIds = incomingItems.map((i) => i.id).join(",");
    const productsRes = await fetch(
      `${WC_URL}/wp-json/wc/v3/products?include=${productIds}&per_page=100`, 
      { headers: { Authorization: wcAuth } }
    );
    
    if (!productsRes.ok) throw new Error("Erreur lors de la récupération des produits");
    const productsData = await productsRes.json();

    let serverSubtotal = 0;
    const lineItems = incomingItems.map((item) => {
      const product = productsData.find((p: any) => p.id === item.id);
      
      if (!product) throw new Error(`Produit introuvable: ${item.id}`);
      if (product.stock_status === "outofstock") {
        throw new Error(`${product.name} est actuellement en rupture de stock.`);
      }

      serverSubtotal += parseFloat(product.price) * item.quantity;

      return {
        product_id: item.id,
        quantity: item.quantity,
        ...(item.variationId ? { variation_id: item.variationId } : {}),
      };
    });

    // --- SHIPPING LOGIC ---
    // Force 0 DT if the user chooses to pay/pickup on site
    const isSurPlace = data.payment_method === "pay_sur_place";
    const SHIPPING_THRESHOLD = 300;
    const FLAT_RATE_COST = "7.00";
    const isFreeShipping = serverSubtotal >= SHIPPING_THRESHOLD;

    const shippingLine = {
      method_id: isSurPlace ? "local_pickup" : (isFreeShipping ? "free_shipping" : "flat_rate"),
      method_title: isSurPlace ? "Retrait en magasin" : (isFreeShipping ? "Livraison Gratuite" : "Livraison Standard"),
      total: isSurPlace ? "0.00" : (isFreeShipping ? "0.00" : FLAT_RATE_COST),
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
      status: "pending", // Always start as pending for payment verification
      billing,
      shipping: billing,
      line_items: lineItems,
      shipping_lines: [shippingLine],
      customer_note: data.notes || "",
    };

    if (data.coupon) orderPayload.coupon_lines = [{ code: data.coupon }];
    if (gateway.identity?.userId) orderPayload.customer_id = Number(gateway.identity.userId);

    const orderRes = await fetch(`${WC_URL}/wp-json/wc/v3/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: wcAuth },
      body: JSON.stringify(orderPayload),
    });

    if (!orderRes.ok) {
      const err = await orderRes.json();
      return NextResponse.json(
        { message: err.message || "Erreur lors de la création de la commande" }, 
        { status: 500 }
      );
    }

    const order = await orderRes.json();
    const siteUrl = WC_URL.replace(/\/$/, ""); 
    const manualPaymentUrl = `${siteUrl}/checkout/order-pay/${order.id}/?pay_for_order=true&key=${order.order_key}`;

    console.log("✅ Order Created ID:", order.id);
    console.log("💳 Method:", order.payment_method);

    // 7. Handle Payment Redirects / Actions
    if (data.payment_method === "clictopay") {
      return NextResponse.json({ 
        order_id: order.id, 
        redirect_url: manualPaymentUrl 
      });
    }

    if (data.payment_method === "pay_sur_place") {
      return NextResponse.json({
        order_id: order.id,
        requires_action: "visit_store",
        expiry_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      });
    }

    return NextResponse.json({ order_id: order.id });

  } catch (err: any) {
    console.error("[checkout/place-order] Error:", err.message);
    return NextResponse.json(
      { message: err.message || "Erreur serveur interne" }, 
      { status: 500 }
    );
  }
}