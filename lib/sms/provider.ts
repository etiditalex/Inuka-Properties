import { formatPhoneKenyaE164, isValidKenyaMobile } from "@/lib/phone/kenya";

export type SmsSendResult = {
  ok: boolean;
  providerMessageId?: string;
  error?: string;
};

function normalizeApiKey(raw?: string): string | undefined {
  if (!raw) return undefined;
  const trimmed = raw.trim();
  if (trimmed.toLowerCase().startsWith("bearer ")) {
    return trimmed.slice(7).trim();
  }
  return trimmed;
}

function getSmsConfig() {
  const apiBase =
    process.env.OKAYSMS_API_URL ||
    process.env.SMS_API_URL ||
    "https://my.okaysms.com/api/v3";

  return {
    provider: (process.env.SMS_PROVIDER || "okaysms").toLowerCase(),
    username: process.env.AFRICAS_TALKING_USERNAME || process.env.SMS_API_USERNAME,
    apiKey: normalizeApiKey(
      process.env.OKAYSMS_API_KEY ||
        process.env.SMS_API_KEY ||
        process.env.AFRICAS_TALKING_API_KEY ||
        process.env.BULKSMS_API_KEY
    ),
    senderId:
      process.env.SMS_SENDER_ID ||
      process.env.OKAYSMS_SENDER_ID ||
      process.env.AFRICAS_TALKING_SENDER_ID ||
      process.env.BULKSMS_SENDER_ID ||
      "INUKA",
    apiUrl: apiBase,
    celcomPartnerId: process.env.CELCOM_PARTNER_ID,
    celcomShortcode: process.env.CELCOM_SHORTCODE || process.env.SMS_SENDER_ID,
  };
}

function getOkaySmsSendUrl(): string {
  const base = getSmsConfig().apiUrl.replace(/\/$/, "");
  if (base.endsWith("/sms/send")) return base;
  return `${base}/sms/send`;
}

function parseOkaySmsResponse(data: unknown, httpStatus: number): SmsSendResult {
  if (!data || typeof data !== "object") {
    return { ok: false, error: `Okay SMS returned empty response (HTTP ${httpStatus})` };
  }

  const body = data as {
    status?: string;
    message?: string;
    message_id?: string;
    errors?: Record<string, string[]>;
    data?: { uid?: string; id?: string; status?: string } | string | Array<{ uid?: string; id?: string }>;
    uid?: string;
    id?: string;
  };

  const status = (body.status || "").toLowerCase();
  if (status === "error") {
    const validation =
      body.errors &&
      Object.entries(body.errors)
        .map(([k, v]) => `${k}: ${v.join(", ")}`)
        .join("; ");
    return {
      ok: false,
      error: body.message || validation || "Okay SMS rejected the request",
    };
  }

  if (status === "success") {
    let messageId: string | undefined;
    if (typeof body.data === "string") {
      messageId = body.data;
    } else if (Array.isArray(body.data)) {
      messageId = body.data[0]?.uid || body.data[0]?.id;
    } else if (body.data && typeof body.data === "object") {
      messageId = body.data.uid || body.data.id;
    }
    messageId = messageId || body.message_id || body.uid || body.id;
    return { ok: true, providerMessageId: messageId ? String(messageId) : undefined };
  }

  // Laravel-style validation without status field
  if (body.message && body.errors) {
    const validation = Object.entries(body.errors)
      .map(([k, v]) => `${k}: ${v.join(", ")}`)
      .join("; ");
    return { ok: false, error: `${body.message} (${validation})` };
  }

  return {
    ok: false,
    error: body.message || JSON.stringify(body),
  };
}

async function sendViaOkaySms(
  to: string,
  message: string,
  senderId: string
): Promise<SmsSendResult> {
  const { apiKey } = getSmsConfig();
  if (!apiKey) {
    if (process.env.NODE_ENV === "development") {
      console.log("[okaysms]", to, message);
      return { ok: true, providerMessageId: "dev" };
    }
    return { ok: false, error: "Okay SMS API key not configured (OKAYSMS_API_KEY or SMS_API_KEY)" };
  }

  const res = await fetch(getOkaySmsSendUrl(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      recipient: to,
      sender_id: senderId,
      type: "plain",
      message,
    }),
  });

  const rawText = await res.text();
  let data: unknown = {};
  try {
    data = rawText ? JSON.parse(rawText) : {};
  } catch {
    return {
      ok: false,
      error: `Okay SMS non-JSON response (HTTP ${res.status}): ${rawText.slice(0, 200)}`,
    };
  }

  if (!res.ok) {
    const parsed = parseOkaySmsResponse(data, res.status);
    return {
      ok: false,
      error:
        parsed.error ||
        (data as { message?: string }).message ||
        `Okay SMS HTTP ${res.status}`,
    };
  }

  return parseOkaySmsResponse(data, res.status);
}

async function sendViaAfricasTalking(
  to: string,
  message: string,
  senderId: string
): Promise<SmsSendResult> {
  const { username, apiKey } = getSmsConfig();
  if (!username || !apiKey) {
    if (process.env.NODE_ENV === "development") {
      console.log("[sms]", to, message);
      return { ok: true, providerMessageId: "dev" };
    }
    return { ok: false, error: "SMS API credentials not configured" };
  }

  const body = new URLSearchParams({
    username,
    to,
    message,
    from: senderId,
  });

  const res = await fetch("https://api.africastalking.com/version1/messaging", {
    method: "POST",
    headers: {
      apiKey: apiKey,
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return { ok: false, error: (data as { SMSMessageData?: { Message?: string } })?.SMSMessageData?.Message || "SMS send failed" };
  }

  const recipients = (data as { SMSMessageData?: { Recipients?: { status: string; messageId?: string; number: string }[] } })
    ?.SMSMessageData?.Recipients;
  const first = recipients?.[0];
  if (first?.status === "Success") {
    return { ok: true, providerMessageId: first.messageId };
  }
  return { ok: false, error: first?.status || "SMS rejected by provider" };
}

async function sendViaCelcom(to: string, message: string, senderId: string): Promise<SmsSendResult> {
  const { apiKey, celcomPartnerId, celcomShortcode } = getSmsConfig();
  if (!apiKey || !celcomPartnerId) {
    return { ok: false, error: "Celcom SMS credentials not configured" };
  }

  const res = await fetch("https://isms.celcomafrica.com/api/services/sendsms/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      apikey: apiKey,
      partnerID: celcomPartnerId,
      mobile: to,
      message,
      shortcode: celcomShortcode || senderId,
      pass_type: "plain",
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return { ok: false, error: (data as { message?: string }).message || "Celcom SMS failed" };
  }
  return { ok: true, providerMessageId: String((data as { responses?: { messageid?: string }[] }).responses?.[0]?.messageid || "") };
}

async function sendViaGenericApi(to: string, message: string, senderId: string): Promise<SmsSendResult> {
  const { apiUrl, apiKey } = getSmsConfig();
  if (!apiUrl || !apiKey) {
    if (process.env.NODE_ENV === "development") {
      console.log("[sms]", to, message);
      return { ok: true, providerMessageId: "dev" };
    }
    return { ok: false, error: "Bulk SMS API URL/key not configured" };
  }

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "X-API-Key": apiKey,
    },
    body: JSON.stringify({ to, phone: to, mobile: to, message, sender: senderId, sender_id: senderId }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return { ok: false, error: (data as { error?: string; message?: string }).error || (data as { message?: string }).message || "Bulk SMS failed" };
  }
  return {
    ok: true,
    providerMessageId: String((data as { id?: string; message_id?: string }).id || (data as { message_id?: string }).message_id || ""),
  };
}

export async function sendSms(
  phone: string,
  message: string,
  senderId?: string
): Promise<SmsSendResult> {
  const to = formatPhoneKenyaE164(phone);
  if (!isValidKenyaMobile(to)) {
    return { ok: false, error: "Invalid Kenya mobile number" };
  }

  const { provider, senderId: defaultSender } = getSmsConfig();
  const from = senderId || defaultSender;

  switch (provider) {
    case "celcom":
      return sendViaCelcom(to, message, from);
    case "generic":
    case "bulk":
      return sendViaGenericApi(to, message, from);
    case "africas_talking":
      return sendViaAfricasTalking(to, message, from);
    case "okaysms":
    default:
      return sendViaOkaySms(to, message, from);
  }
}

export async function sendBulkSms(
  recipients: { phone: string; message: string }[],
  senderId?: string
): Promise<{ sent: number; failed: number; results: SmsSendResult[] }> {
  const results: SmsSendResult[] = [];
  let sent = 0;
  let failed = 0;

  for (const { phone, message } of recipients) {
    const result = await sendSms(phone, message, senderId);
    results.push(result);
    if (result.ok) sent++;
    else failed++;
    // Small delay to respect provider rate limits
    await new Promise((r) => setTimeout(r, 120));
  }

  return { sent, failed, results };
}
