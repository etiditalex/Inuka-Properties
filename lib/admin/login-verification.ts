import crypto from "crypto";

export const CODE_TTL_MS = 10 * 60 * 1000;
export const MAX_VERIFY_ATTEMPTS = 5;

type SessionTokens = {
  access_token: string;
  refresh_token: string;
};

function getSecret(): string {
  const secret = process.env.ADMIN_LOGIN_SECRET || process.env.WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("ADMIN_LOGIN_SECRET or WEBHOOK_SECRET must be configured");
  }
  return secret;
}

function deriveKey(): Buffer {
  return crypto.createHash("sha256").update(getSecret()).digest();
}

export function generateLoginCode(): string {
  return crypto.randomInt(100000, 1000000).toString();
}

export function hashLoginCode(code: string, verificationId: string): string {
  return crypto
    .createHmac("sha256", getSecret())
    .update(`${verificationId}:${code}`)
    .digest("hex");
}

export function encryptSession(session: SessionTokens): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", deriveKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(session), "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64url");
}

export function decryptSession(payload: string): SessionTokens {
  const buffer = Buffer.from(payload, "base64url");
  const iv = buffer.subarray(0, 12);
  const tag = buffer.subarray(12, 28);
  const encrypted = buffer.subarray(28);
  const decipher = crypto.createDecipheriv("aes-256-gcm", deriveKey(), iv);
  decipher.setAuthTag(tag);
  const json = Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
  return JSON.parse(json) as SessionTokens;
}

export async function sendLoginVerificationEmail(
  email: string,
  code: string
): Promise<boolean> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail =
    process.env.EMAIL_FROM || "IAPL Admin <notifications@inukaproperties.co.ke>";

  const html = `
    <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto">
      <div style="background:linear-gradient(135deg,#4a6cf7,#3f5ee0);padding:24px;border-radius:12px 12px 0 0">
        <h1 style="color:white;margin:0;font-size:20px">IAPL Admin Login</h1>
      </div>
      <div style="background:#fff;padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
        <p style="margin:0 0 16px;color:#374151">Use this verification code to complete your admin sign-in:</p>
        <p style="margin:0 0 16px;font-size:32px;font-weight:700;letter-spacing:0.35em;color:#111827;text-align:center">${code}</p>
        <p style="margin:0;font-size:13px;color:#6b7280">This code expires in 10 minutes. If you did not request this, you can ignore this email.</p>
      </div>
    </div>
  `;

  if (!resendApiKey) {
    if (process.env.NODE_ENV === "development") {
      console.log("[admin login code]", email, code);
      return true;
    }
    return false;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [email],
      subject: "Your IAPL Admin login verification code",
      html,
    }),
  });

  return res.ok;
}
