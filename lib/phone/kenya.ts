/** Normalize Kenyan phone numbers to 2547XXXXXXXX, without a plus. */
export function formatPhoneKenyaE164(phone: string): string {
  let digits = phone.replace(/\D/g, "");
  if (!digits) return "";

  // +25407... or 25407... keeps the trunk zero. Drop it.
  if (digits.startsWith("2540")) {
    digits = `254${digits.slice(4)}`;
  } else if (digits.startsWith("0")) {
    digits = `254${digits.slice(1)}`;
  } else if (!digits.startsWith("254") && digits.length === 9) {
    digits = `254${digits}`;
  }

  return digits;
}

/** Rewrite a finished 07... or +254... entry to 254... Leave a partial number as typed. */
export function normalizeKenyaPhoneInput(value: string): string {
  const formatted = formatPhoneKenyaE164(value);
  return isValidKenyaMobile(formatted) ? formatted : value;
}

export function isValidKenyaMobile(phone: string): boolean {
  const e164 = formatPhoneKenyaE164(phone);
  return /^2547\d{8}$/.test(e164);
}
