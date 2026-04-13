import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { secureRequest } from "@/lib/core/gateway";
import { CheckoutFormSchema } from "@/lib/validation-schemas";

const WC_URL = process.env.WC_URL!;
const WC_KEY = process.env.WC_KEY!;
const WC_SECRET = process.env.WC_SECRET!;

const wcAuth = `Basic ${Buffer.from(
  `${WC_KEY}:${WC_SECRET}`
).toString("base64")}`;

export async function POST(req: NextRequest) {
  try {
    const gateway = await secureRequest(req as any, "checkout");

    if (!gateway.ok) {
      return NextResponse.json(
        { message: "Too many checkout attempts" },
        { status: 429 }
      );
    }

    const body = await req.json();

    const parsed = CheckoutFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Invalid checkout data",
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const {
      email,
      first_name,
      last_name,
      phone,
      address_1,
      address_2,
      city,
      state,
      postcode,
      payment_method,
      notes,
      coupon,
    } = parsed.data;
    const token = (await cookies()).get("mio_auth_token")?.value;
    const allCookies = req.headers.get("cookie") || "";

    const cartRes = await fetch(`${WC_URL}/wp-json/wc/store/v1/cart`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        Cookie: allCookies,
      },
    });

    if (!cartRes.ok) {
      return NextResponse.json(
        { message: "Failed to load cart" },
        { status: 500 }
      );
    }

    const cart = await cartRes.json();

    if (!cart.items?.length) {
      return NextResponse.json(
        { message: "Cart is empty" },
        { status: 400 }
      );
    }
    const billing = {
      first_name,
      last_name,
      email,
      phone,
      address_1,
      address_2: address_2 || "",
      city,
      state,
      postcode: postcode || "",
      country: "TN",
    };

    const lineItems = cart.items.map((item: any) => {
      const isVariable =
        item.type === "variable" ||
        (item.variation && item.variation.length > 0);

      return {
        product_id: isVariable ? item.parent_id || item.id : item.id,
        quantity: item.quantity.value,
        ...(isVariable ? { variation_id: item.id } : {}),
      };
    });

    const shippingTotal = (
      parseFloat(cart.totals?.total_shipping ?? "1500") / 100
    ).toFixed(2);

    const orderPayload: any = {
      payment_method,
      payment_method_title:
        payment_method === "cod"
          ? "Paiement à la livraison"
          : "Konnect",
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
    const customerId = gateway.identity?.userId;

    if (customerId) {
      orderPayload.customer_id = Number(customerId);
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

      return NextResponse.json(
        {
          message: err.message || "Error creating order",
        },
        { status: 500 }
      );
    }

    const order = await orderRes.json();
    if (payment_method === "konnect") {
      const konnectRes = await fetch(
        `${WC_URL}/wp-json/mio/v1/konnect/init`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            order_id: order.id,
          }),
        }
      );

      if (konnectRes.ok) {
        const konnect = await konnectRes.json();

        return NextResponse.json({
          order_id: order.id,
          redirect_url: konnect.payUrl,
        });
      }
    }

    return NextResponse.json({
      order_id: order.id,
    });
  } catch (err: any) {
    console.error("[checkout/place-order]", err);

    return NextResponse.json(
      { message: err.message || "Server error" },
      { status: 500 }
    );
  }
}