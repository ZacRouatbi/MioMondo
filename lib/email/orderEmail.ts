import nodemailer from "nodemailer";

const SITE_NAME = process.env.SITE_NAME ?? "MioMondoHome";
const SITE_URL = process.env.SITE_URL ?? "https://miomondohome.com";
const SITE_LOGO_URL = `${process.env.BACKEND_URL}/wp-content/uploads/2026/04/emailBanner.png`;

interface OrderItem {
  name: string;
  quantity: number;
  subtotal: string;
}

interface Address {
  first_name: string;
  last_name: string;
  address_1: string;
  city: string;
  postcode: string;
  phone?: string;
}

interface OrderEmailOptions {
  to: string;
  firstName: string;
  orderId: string;
  items: OrderItem[];
  total: string;
  shippingTotal: string;
  paymentMethod: string;
  billingAddress: Address;
  shippingAddress: Address;
}

function buildOrderCompletedHtml(
  firstName: string, 
  orderId: string, 
  items: OrderItem[], 
  total: string, 
  shipping: string, 
  paymentMethod: string,
  billing: Address,
  shippingAddr: Address
): string {
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 16px 0; border-bottom: 1px solid #eee; font-size: 14px; color: #1a1a2e;">
        <span style="font-weight: bold; display: block;">${item.name}</span>
        <span style="color: #1a1a2e99; font-size: 12px;">Quantité: ${item.quantity}</span>
      </td>
      <td align="right" style="padding: 16px 0; border-bottom: 1px solid #eee; font-size: 14px; color: #1a1a2e; font-weight: bold;">
        ${item.subtotal} DT
      </td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background-color:#f8f6f2;font-family:Georgia, serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8f6f2;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;background:#ffffff;border:1px solid #e0dbd4; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          
          <tr>
            <td style="padding:0;">
              <img src="${SITE_LOGO_URL}" alt="${SITE_NAME}" width="620" style="display:block;width:100%;max-width:620px;border:0;" />
            </td>
          </tr>

          <tr>
            <td style="padding:40px 48px;">
              <h2 style="margin:0 0 16px; font-size:22px; color:#1a1a2e; font-weight: normal; text-align:center;">Votre commande est prête</h2>
              <p style="margin:0 0 32px; font-size:15px; color:#1a1a2e; line-height:1.7; text-align:center;">
                Bonjour <strong>${firstName}</strong>,<br>
                Bonne nouvelle ! Votre commande <strong>#${orderId}</strong> est terminée et prête à rejoindre votre intérieur.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px; background:#fcfaf7; border:1px solid #e0dbd4; border-radius:4px;">
                <tr>
                  <td width="50%" style="padding:20px; vertical-align:top; border-right:1px solid #e0dbd4;">
                    <p style="margin:0 0 10px; font-size:11px; color:#1a1a2e99; text-transform:uppercase; letter-spacing:1px;">Livré à</p>
                    <p style="margin:0; font-size:13px; color:#1a1a2e; line-height:1.5;">
                      ${shippingAddr.first_name} ${shippingAddr.last_name}<br>
                      ${shippingAddr.address_1}<br>
                      ${shippingAddr.postcode} ${shippingAddr.city}
                    </p>
                  </td>
                  <td width="50%" style="padding:20px; vertical-align:top;">
                    <p style="margin:0 0 10px; font-size:11px; color:#1a1a2e99; text-transform:uppercase; letter-spacing:1px;">Paiement</p>
                    <p style="margin:0; font-size:13px; color:#1a1a2e; line-height:1.5;">
                      <strong>${paymentMethod}</strong><br>
                      Facturé à: ${billing.first_name} ${billing.last_name}
                    </p>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0">
                <thead>
                  <tr>
                    <th align="left" style="padding-bottom:12px; border-bottom:2px solid #1a1a2e; font-size:12px; text-transform:uppercase; color:#1a1a2e99; letter-spacing:1px;">Articles</th>
                    <th align="right" style="padding-bottom:12px; border-bottom:2px solid #1a1a2e; font-size:12px; text-transform:uppercase; color:#1a1a2e99; letter-spacing:1px;">Prix</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">
                <tr>
                  <td style="padding: 10px 0; font-size: 14px; color: #1a1a2e99;">Sous-total Livraison</td>
                  <td align="right" style="padding: 10px 0; font-size: 14px; color: #1a1a2e;">${shipping} DT</td>
                </tr>
                <tr>
                  <td style="padding: 16px 0; font-size: 16px; color: #1a1a2e; font-weight: bold; border-top:1px solid #1a1a2e;">Total</td>
                  <td align="right" style="padding: 16px 0; font-size: 20px; color: #1a1a2e; font-weight: bold; border-top:1px solid #1a1a2e;">${total} DT</td>
                </tr>
              </table>

              <div style="margin-top:40px; text-align:center;">
                <p style="margin:0; font-size:13px; color:#1a1a2e99;">Des questions ? Contactez notre service client.</p>
              </div>
            </td>
          </tr>

          <tr>
            <td style="background:#fcfaf7; padding:32px 48px; border-top:1px solid #e0dbd4; text-align:center;">
              <p style="margin:0 0 8px; font-size:12px; color:#1a1a2e66;">Merci d'avoir choisi le confort de ${SITE_NAME}</p>
              <p style="margin:0; font-size:13px; color:#1a1a2e; font-weight:bold; letter-spacing:1px; text-transform:uppercase;">
                Mio Mondo Home
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export async function sendOrderCompletedEmail(options: OrderEmailOptions) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"${SITE_NAME}" <${process.env.SMTP_FROM ?? process.env.SMTP_USER}>`,
    to: options.to,
    subject: `Votre commande #${options.orderId} est prête — ${SITE_NAME}`,
    html: buildOrderCompletedHtml(
      options.firstName, 
      options.orderId, 
      options.items, 
      options.total, 
      options.shippingTotal,
      options.paymentMethod,
      options.billingAddress,
      options.shippingAddress
    ),
  });
}