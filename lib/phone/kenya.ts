/** Normalize Kenyan phone numbers to E.164 without + (e.g. 254711082084). */
export function formatPhoneKenyaE164(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("254")) return digits;
  if (digits.startsWith("0")) return `254${digits.slice(1)}`;
  if (digits.length === 9) return `254${digits}`;
  return digits;
}

export function isValidKenyaMobile(phone: string): boolean {
  const e164 = formatPhoneKenyaE164(phone);
  return /^2547\d{8}$/.test(e164);
}
