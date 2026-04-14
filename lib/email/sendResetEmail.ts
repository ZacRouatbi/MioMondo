import nodemailer from "nodemailer";

const SITE_NAME = process.env.SITE_NAME ?? "MioMondoHome";
const SITE_URL = process.env.SITE_URL ?? "https://miomondohome.com";
const SITE_LOGO_URL = `${process.env.BACKEND_URL}/wp-content/uploads/2026/04/emailBanner.png`;

interface ResetEmailOptions {
  to: string;
  firstName: string;
  token: string; // Removed newPassword
}

function buildEmailHtml(firstName: string, token: string): string {
  const resetUrl = `${SITE_URL}/reset-success?token=${encodeURIComponent(token)}`;

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Réinitialisation de votre mot de passe</title>
</head>
<body style="margin:0;padding:0;background-color:#f0ece6;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0ece6;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;background:#ffffff;border:1px solid #e0dbd4;">

          <tr>
            <td style="padding:0;">
              <img
                src="${SITE_LOGO_URL}"
                alt="${SITE_NAME}"
                width="620"
                style="display:block;width:100%;max-width:620px;border:0;"
              />
            </td>
          </tr>

          <tr>
            <td style="padding:40px 48px 32px;">
              <p style="margin:0 0 16px;font-size:15px;color:#1a1a2e;line-height:1.7;">
                Bonjour <strong>${firstName}</strong>,
              </p>
              <p style="margin:0 0 24px;font-size:15px;color:#1a1a2e;line-height:1.7;">
                Vous avez demandé la réinitialisation de votre mot de passe sur 
                <strong>${SITE_NAME}</strong>. Pour choisir un nouveau mot de passe, 
                veuillez cliquer sur le bouton ci-dessous :
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin:32px 0;">
                <tr>
                  <td align="center">
                    <a
                      href="${resetUrl}"
                      style="display:inline-block;background:#1a1a2e;color:#ffffff;text-decoration:none;font-family:Georgia,serif;font-size:13px;font-weight:bold;letter-spacing:0.18em;text-transform:uppercase;padding:18px 44px;border-radius:3px;"
                    >
                      Réinitialiser mon mot de passe
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 16px;font-size:14px;color:#1a1a2e99;line-height:1.7;">
                Ce lien est valable <strong>1 heure</strong>. Si vous ne réinitialisez pas votre mot de passe dans ce délai, 
                votre mot de passe actuel restera inchangé.
              </p>
              
              <p style="margin:24px 0 0;font-size:13px;color:#1a1a2e99;line-height:1.7;">
                Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet e-mail en toute sécurité.
              </p>
            </td>
          </tr>

          <tr>
            <td style="background:#f0ece6;padding:24px 48px;border-top:1px solid #e0dbd4;">
              <p style="margin:0 0 6px;font-size:12px;color:#1a1a2e66;line-height:1.6;">
                Merci,
              </p>
              <p style="margin:0 0 16px;font-size:12px;color:#1a1a2e99;font-weight:bold;">
                L'équipe ${SITE_NAME}
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

export async function sendResetEmail({ to, firstName, token }: Omit<ResetEmailOptions, 'newPassword'>) {
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
    to,
    subject: `Réinitialisation de votre mot de passe — ${SITE_NAME}`,
    html: buildEmailHtml(firstName, token),
  });
}