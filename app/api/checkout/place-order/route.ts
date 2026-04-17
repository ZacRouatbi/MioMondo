import { NextRequest, NextResponse } from "next/server";
import { secureRequest } from "@/lib/core/gateway";
import { CheckoutFormSchema } from "@/lib/validation-schemas";
import { getTunisiaShippingSettings } from "@/lib/wc-settings"; // Import helper
import { getCustomerIdFromToken } from "@/lib/auth-utils";
const WC_URL = process.env.WC_URL!;
const WC_KEY = process.env.WC_KEY!;
const WC_SECRET = process.env.WC_SECRET!;
const wcAuth = `Basic ${Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString("base64")}`;

export async function POST(req: NextRequest) {
  try {
    const gateway = await secureRequest(req as any, "checkout");
    if (!gateway.ok) return NextResponse.json({ message: "Trop de tentatives." }, { status: 429 });

    const body = await req.json();
    const parsed = CheckoutFormSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ message: "Données invalides" }, { status: 400 });

    const data = parsed.data;
    
    // 1. Fetch live shipping rules from WooCommerce Settings
    const shippingSettings = await getTunisiaShippingSettings();
    const customerId = await getCustomerIdFromToken(req);
    // 2. Fetch products to calculate subtotal
    const productIds = data.items.map((i) => i.id).join(",");
    const productsRes = await fetch(`${WC_URL}/wp-json/wc/v3/products?include=${productIds}`, {
      headers: { Authorization: wcAuth }
    });
    const productsData = await productsRes.json();

    let serverSubtotal = 0;
    const lineItems = data.items.map((item) => {
      const product = productsData.find((p: any) => p.id === item.id);
      serverSubtotal += parseFloat(product.price) * item.quantity;
      return {
        product_id: item.id,
        quantity: item.quantity,
        ...(item.variationId ? { variation_id: item.variationId } : {}),
      };
    });

    // 3. Dynamic Shipping Logic
    const isSurPlace = data.payment_method === "pay_sur_place";
    const isFreeShipping = serverSubtotal >= shippingSettings.threshold;

    // We build the shipping line using the data we JUST fetched from the settings API
    const shippingLine = {
      method_id: isSurPlace ? "local_pickup" : (isFreeShipping ? "free_shipping" : "flat_rate"),
      method_title: isSurPlace ? "Retrait en magasin" : (isFreeShipping ? "Livraison Gratuite" : "Livraison Standard"),
      total: isSurPlace ? "0.00" : (isFreeShipping ? "0.00" : shippingSettings.rate.toString()),
    };

    const orderPayload: any = {
      payment_method: data.payment_method,
      payment_method_title: data.payment_method === "cod" ? "Paiement à la livraison" : 
                            data.payment_method === "clictopay" ? "Carte Bancaire" : "Paiement sur place",
                            ...(customerId ? { customer_id: customerId } : {}),
      billing: { ...data, country: "TN" },
      shipping: { ...data, country: "TN" },
      line_items: lineItems,
      shipping_lines: [shippingLine],
      customer_note: data.notes || "",
    };

    if (data.coupon) orderPayload.coupon_lines = [{ code: data.coupon }];

    // 4. Create Order
    const orderRes = await fetch(`${WC_URL}/wp-json/wc/v3/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: wcAuth },
      body: JSON.stringify(orderPayload),
    });

    const order = await orderRes.json();

    // 5. Handle responses
    if (data.payment_method === "clictopay") {
      const siteUrl = WC_URL.replace(/\/$/, "");
      return NextResponse.json({ order_id: order.id, redirect_url: `${siteUrl}/checkout/order-pay/${order.id}/?pay_for_order=true&key=${order.order_key}` });
    }

    return NextResponse.json({ order_id: order.id });

  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}