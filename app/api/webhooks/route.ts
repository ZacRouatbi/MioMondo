import { NextResponse } from 'next/server';
import { sendOrderCompletedEmail } from '@/lib/email/orderEmail';
import crypto from 'crypto';

const WEBHOOK_SECRET = process.env.WC_WEBHOOK_SECRET;

export async function POST(req: Request) {
  try {
    if (!WEBHOOK_SECRET) {
      console.error("CRITICAL: WC_WEBHOOK_SECRET is missing in .env");
      return NextResponse.json({ message: 'Configuration error' }, { status: 500 });
    }

    const signature = req.headers.get('x-wc-webhook-signature');
    if (!signature) {
      return NextResponse.json({ message: 'Missing signature' }, { status: 401 });
    }

    const rawBody = await req.text();
    const expectedSignature = crypto
      .createHmac('sha256', WEBHOOK_SECRET)
      .update(rawBody)
      .digest('base64');

    if (signature !== expectedSignature) {
      console.warn("Security Alert: Invalid webhook signature received.");
      return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
    }

    const data = JSON.parse(rawBody);

    if (data.status === 'completed') {
      const formattedItems = data.line_items.map((item: any) => ({
        name: item.name,
        quantity: item.quantity,
        subtotal: item.subtotal,
      }));
      await sendOrderCompletedEmail({
        to: data.billing.email,
        firstName: data.billing.first_name,
        orderId: data.id.toString(),
        items: formattedItems,
        total: data.total,
        shippingTotal: data.shipping_total,
        paymentMethod: data.payment_method_title,
        billingAddress: {
          first_name: data.billing.first_name,
          last_name: data.billing.last_name,
          address_1: data.billing.address_1,
          city: data.billing.city,
          postcode: data.billing.postcode,
          phone: data.billing.phone,
        },
        shippingAddress: {
          first_name: data.shipping.first_name,
          last_name: data.shipping.last_name,
          address_1: data.shipping.address_1,
          city: data.shipping.city,
          postcode: data.shipping.postcode,
        },
      });

      return NextResponse.json({ message: 'Order completion email sent.' }, { status: 200 });
    }

    return NextResponse.json({ message: 'Status ignored' }, { status: 200 });

  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}