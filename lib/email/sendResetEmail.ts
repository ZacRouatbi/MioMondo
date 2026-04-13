import nodemailer from "nodemailer";

const SITE_NAME = process.env.SITE_NAME ?? "MioMondoHome";
const SITE_URL = process.env.SITE_URL ?? "https://miomondohome.com";
const SITE_LOGO_URL = `${process.env.BACKEND_URL}/wp-content/uploads/2026/04/emailBanner.png`; // replace with your actual hosted banner

interface ResetEmailOptions {
  to: string;
  firstName: string;
  newPassword: string;
}

function buildEmailHtml(firstName: string, newPassword: string): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Réinitialisation de mot de passe</title>
</head>
<body style="margin:0;padding:0;background-color:#f0ece6;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0ece6;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;background:#ffffff;border:1px solid #e0dbd4;">

          <!-- Banner -->
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

          <!-- Body -->
          <tr>
            <td style="padding:40px 48px 32px;">
              <p style="margin:0 0 16px;font-size:15px;color:#1a1a2e;line-height:1.7;">
                Bonjour <strong>${firstName}</strong>,
              </p>
              <p style="margin:0 0 16px;font-size:15px;color:#1a1a2e;line-height:1.7;">
                Vous avez demandé la réinitialisation de votre mot de passe sur
                <strong>${SITE_NAME}</strong>. Voici votre nouveau mot de passe temporaire :
              </p>

              <!-- Password box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;">
                <tr>
                  <td align="center">
                    <div style="display:inline-block;background:#1a1a2e;color:#ffffff;font-family:Courier New,monospace;font-size:20px;font-weight:bold;letter-spacing:0.12em;padding:16px 36px;border-radius:4px;">
                      ${newPassword}
                    </div>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 16px;font-size:15px;color:#1a1a2e;line-height:1.7;">
                Pour des raisons de sécurité, nous vous recommandons de modifier ce mot de passe
                dès votre prochaine connexion depuis votre espace client.
              </p>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:32px 0;">
                <tr>
                  <td align="center">
                    <a
                      href="${SITE_URL}/account"
                      style="display:inline-block;background:#1a1a2e;color:#ffffff;text-decoration:none;font-family:Georgia,serif;font-size:13px;font-weight:bold;letter-spacing:0.18em;text-transform:uppercase;padding:16px 40px;border-radius:3px;"
                    >
                      Se connecter
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px;font-size:13px;color:#1a1a2e99;line-height:1.7;">
                Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer ce message.
                Votre mot de passe actuel restera inchangé.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f0ece6;padding:24px 48px;border-top:1px solid #e0dbd4;">
              <p style="margin:0 0 6px;font-size:12px;color:#1a1a2e66;line-height:1.6;">
                Merci,
              </p>
              <p style="margin:0 0 16px;font-size:12px;color:#1a1a2e99;font-weight:bold;">
                L'équipe ${SITE_NAME}
              </p>
              <p style="margin:0;font-size:11px;color:#1a1a2e44;line-height:1.7;">
                Si vous avez reçu cet e-mail par erreur, supprimez-le simplement.
                Vous ne recevrez aucun autre e-mail de notre part à moins d'avoir effectué
                une demande sur <a href="${SITE_URL}" style="color:#1a1a2e66;">${SITE_URL}</a>.
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

export async function sendResetEmail({ to, firstName, newPassword }: ResetEmailOptions) {
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
    subject: `Votre nouveau mot de passe — ${SITE_NAME}`,
    html: buildEmailHtml(firstName, newPassword),
  });
}