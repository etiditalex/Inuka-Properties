const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readEmails(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(/[,;\s]+/)
    .map((email) => email.trim().toLowerCase())
    .filter((email) => EMAIL_RE.test(email));
}

/** Login addresses allowed to use the admin app and admin APIs. */
export function getAdminAllowlist(): string[] {
  const emails = [
    ...readEmails(process.env.ADMIN_ALLOWED_EMAILS),
    ...readEmails(process.env.ADMIN_EMAILS),
    ...readEmails(process.env.NOTIFY_EMAIL),
  ];
  return [...new Set(emails)];
}

export function isAdminAllowlistConfigured(): boolean {
  return getAdminAllowlist().length > 0;
}

export function isAdminEmailAllowed(email: string | null | undefined): boolean {
  if (!email || !isAdminAllowlistConfigured()) return false;
  return getAdminAllowlist().includes(email.trim().toLowerCase());
}
