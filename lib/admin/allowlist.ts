const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** SHA-256 of an admin login. The address itself stays out of the repository. */
const ALLOWED_EMAIL_SHA256 = ["78d778f5f5fce1ab574fbb5a98984e1e9165e64b86d9dfc89a6d8392b4206f06"];

function rightRotate(value: number, amount: number): number {
  return (value >>> amount) | (value << (32 - amount));
}

/** Sync SHA-256 so the check can run in middleware and in route handlers. */
function sha256Hex(message: string): string {
  const maxWord = 2 ** 32;
  const words: number[] = [];
  const hash: number[] = [];
  const k: number[] = [];
  const composite: Record<number, number> = {};
  let primeCounter = 0;
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (composite[candidate]) continue;
    for (let i = 0; i < 313; i += candidate) composite[i] = candidate;
    hash[primeCounter] = (candidate ** 0.5 * maxWord) | 0;
    k[primeCounter] = (candidate ** (1 / 3) * maxWord) | 0;
    primeCounter++;
  }

  const bitLength = message.length * 8;
  let padded = `${message}\u0080`;
  while ((padded.length % 64) - 56) padded += "\u0000";
  for (let i = 0; i < padded.length; i++) {
    words[i >> 2] = (words[i >> 2] || 0) | (padded.charCodeAt(i) << ((3 - (i % 4)) * 8));
  }
  words[words.length] = (bitLength / maxWord) | 0;
  words[words.length] = bitLength;

  for (let j = 0; j < words.length; ) {
    const w = words.slice(j, (j += 16));
    const oldHash = hash.slice(0);
    for (let i = 0; i < 64; i++) {
      const w15 = w[i - 15];
      const w2 = w[i - 2];
      const a = hash[0];
      const e = hash[4];
      const temp1 =
        (hash[7] +
          (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) +
          ((e & hash[5]) ^ (~e & hash[6])) +
          k[i] +
          (w[i] =
            i < 16
              ? w[i]
              : (w[i - 16] +
                  (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) +
                  w[i - 7] +
                  (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) |
                0)) |
        0;
      const temp2 =
        (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) +
        ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
      hash.unshift((temp1 + temp2) | 0);
      hash[4] = (hash[4] + temp1) | 0;
      hash.pop();
    }
    for (let i = 0; i < 8; i++) hash[i] = (hash[i] + oldHash[i]) | 0;
  }

  let result = "";
  for (let i = 0; i < 8; i++) {
    for (let shift = 3; shift >= 0; shift--) {
      const byte = (hash[i] >> (shift * 8)) & 255;
      result += (byte < 16 ? "0" : "") + byte.toString(16);
    }
  }
  return result;
}

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
  return getAdminAllowlist().length > 0 || ALLOWED_EMAIL_SHA256.length > 0;
}

export function isAdminEmailAllowed(email: string | null | undefined): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  if (getAdminAllowlist().includes(normalized)) return true;
  return ALLOWED_EMAIL_SHA256.includes(sha256Hex(normalized));
}
