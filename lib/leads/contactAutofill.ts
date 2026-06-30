export type ContactDetails = {
  name: string;
  email: string;
  phone: string;
};

const STORAGE_KEY = "iapl_contact_details";

export function loadSavedContact(): Partial<ContactDetails> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Partial<ContactDetails>;
  } catch {
    return {};
  }
}

export function saveContact(details: ContactDetails) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(details));
  } catch {
    // ignore quota / private mode
  }
}

export function contactFromSearchParams(
  params: URLSearchParams
): Partial<ContactDetails> {
  const firstName =
    params.get("first_name") || params.get("firstname") || params.get("fn") || "";
  const lastName =
    params.get("last_name") || params.get("lastname") || params.get("ln") || "";
  const combinedName = [firstName, lastName].filter(Boolean).join(" ").trim();

  const name =
    params.get("name") ||
    params.get("full_name") ||
    params.get("fullname") ||
    combinedName ||
    "";

  const email = params.get("email") || params.get("e") || "";
  const phone =
    params.get("phone") ||
    params.get("tel") ||
    params.get("mobile") ||
    params.get("phone_number") ||
    params.get("whatsapp") ||
    "";

  return {
    ...(name ? { name: decodeURIComponent(name) } : {}),
    ...(email ? { email: decodeURIComponent(email) } : {}),
    ...(phone ? { phone: decodeURIComponent(phone) } : {}),
  };
}

export function resolveContactPrefill(params?: URLSearchParams): ContactDetails {
  const fromUrl = params ? contactFromSearchParams(params) : {};
  const saved = loadSavedContact();

  return {
    name: fromUrl.name || saved.name || "",
    email: fromUrl.email || saved.email || "",
    phone: fromUrl.phone || saved.phone || "",
  };
}

export function hasContactDetails(details: Partial<ContactDetails>): boolean {
  return Boolean(details.name || details.email || details.phone);
}
