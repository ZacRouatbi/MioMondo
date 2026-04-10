import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const WC_URL = process.env.WC_URL!;
const WC_KEY = process.env.WC_KEY!;
const WC_SECRET = process.env.WC_SECRET!;

const wcAuth = `Basic ${Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString("base64")}`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const cookieStore = await cookies();
    const token = cookieStore.get("mio_auth_token")?.value;
    const allCookies = req.headers.get("cookie") || "";

    const {
      email, first_name, last_name, phone,
      address_1, address_2, city, state, postcode,
      payment_method, notes, coupon,
    } = body;

    // 1. Fetch current cart from WooCommerce (passing cookies manually for session)
    const cartRes = await fetch(`${WC_URL}/wp-json/wc/store/v1/cart`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "Cookie": allCookies,
      },
    });

    if (!cartRes.ok) throw new Error("Impossible de lire le panier");
    const cart = await cartRes.json();

    if (!cart.items?.length) {
      return NextResponse.json({ message: "Votre panier est vide" }, { status: 400 });
    }

    const billing = {
      first_name, last_name, email, phone,
      address_1, address_2: address_2 || "",
      city, state, postcode: postcode || "",
      country: "TN",
    };

    const lineItems = cart.items.map((item: any) => {
        const isVariable = item.type === "variable" || (item.variation && item.variation.length > 0);
        return {
            product_id: isVariable ? (item.parent_id || item.id) : item.id,
            quantity: item.quantity.value,
            ...(isVariable ? { variation_id: item.id } : {}),
        };
    });

    const rawShipping = cart.totals?.total_shipping ?? "1500";
    const shippingTotal = (parseFloat(rawShipping) / 100).toFixed(2);

    const orderPayload: any = {
      payment_method,
      payment_method_title: payment_method === "cod" ? "Paiement à la livraison" : "Konnect",
      set_paid: false,
      billing,
      shipping: billing,
      line_items: lineItems,
      shipping_lines: [
        {
          method_id: "flat_rate",
          method_title: "Livraison standard",
          total: shippingTotal,
        },
      ],
      customer_note: notes || "",
    };

    if (coupon) {
      orderPayload.coupon_lines = [{ code: coupon }];
    }

    // Associate order with logged-in customer if token exists
    if (token) {
      const meRes = await fetch(`${WC_URL}/wp-json/wp/v2/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (meRes.ok) {
        const me = await meRes.json();
        orderPayload.customer_id = me.id;
      }
    }

    const orderRes = await fetch(`${WC_URL}/wp-json/wc/v3/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: wcAuth,
      },
      body: JSON.stringify(orderPayload),
    });

    if (!orderRes.ok) {
      const err = await orderRes.json();
      throw new Error(err.message || "Erreur lors de la création de la commande");
    }

    const order = await orderRes.json();

    if (payment_method === "konnect") {
      const konnectRes = await fetch(`${WC_URL}/wp-json/mio/v1/konnect/init`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ order_id: order.id }),
      });

      if (konnectRes.ok) {
        const konnect = await konnectRes.json();
        return NextResponse.json({
          order_id: order.id,
          redirect_url: konnect.payUrl,
        });
      }
    }

    return NextResponse.json({ order_id: order.id });

  } catch (err: any) {
    console.error("[checkout/place-order]", err);
    return NextResponse.json(
      { message: err.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}

export async function POST_COUPON(req: NextRequest) {
  try {
    const { code } = await req.json();
    if (!code) return NextResponse.json({ message: "Code manquant" }, { status: 400 });

    const res = await fetch(
      `${WC_URL}/wp-json/wc/v3/coupons?code=${encodeURIComponent(code)}`,
      { headers: { Authorization: wcAuth } }
    );

    const data = await res.json();
    if (!data?.length) {
      return NextResponse.json({ message: "Code promo invalide" }, { status: 404 });
    }

    const coupon = data[0];
    return NextResponse.json({
      code: coupon.code,
      discount_type: coupon.discount_type,
      amount: coupon.amount,
    });
  } catch (err) {
    return NextResponse.json({ message: "Erreur validation coupon" }, { status: 500 });
  }
}

export { POST_COUPON as POST_COUPON_ALIAS };