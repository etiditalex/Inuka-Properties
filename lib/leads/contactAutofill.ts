export type ContactDetails = {
  name: string;
  email: string;
  phone: string;
};

export type ContactFormFields = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

const STORAGE_KEY = "iapl_contact_details";
const FACEBOOK_SESSION_KEY = "iapl_facebook_landing";
const FACEBOOK_CONTACT_SESSION_KEY = "iapl_facebook_lead_contact";
const AUTO_CAPTURED_KEY = "iapl_lead_auto_captured";

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value.replace(/\+/g, " "));
  } catch {
    return value;
  }
}

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

/** True when visitor likely arrived from a Meta/Facebook ad click. */
export function isFacebookAdTraffic(params: URLSearchParams): boolean {
  const utmSource = params.get("utm_source")?.toLowerCase() ?? "";
  const utmMedium = params.get("utm_medium")?.toLowerCase() ?? "";

  return Boolean(
    params.get("fbclid") ||
      params.get("fbc") ||
      utmSource.includes("facebook") ||
      utmSource.includes("meta") ||
      utmSource === "fb" ||
      utmMedium === "paid_social" ||
      (utmMedium === "cpc" && utmSource.includes("fb"))
  );
}

export function contactFromSearchParams(
  params: URLSearchParams
): Partial<ContactDetails> {
  const firstName = safeDecode(
    params.get("first_name") ||
      params.get("firstname") ||
      params.get("fn") ||
      params.get("given_name") ||
      ""
  );
  const lastName = safeDecode(
    params.get("last_name") ||
      params.get("lastname") ||
      params.get("ln") ||
      params.get("family_name") ||
      ""
  );
  const combinedName = [firstName, lastName].filter(Boolean).join(" ").trim();

  const name = safeDecode(
    params.get("name") ||
      params.get("full_name") ||
      params.get("fullname") ||
      params.get("contact_name") ||
      combinedName ||
      ""
  );

  const email = safeDecode(
    params.get("email") ||
      params.get("e") ||
      params.get("em") ||
      params.get("email_address") ||
      ""
  );
  const phone = safeDecode(
    params.get("phone") ||
      params.get("tel") ||
      params.get("mobile") ||
      params.get("ph") ||
      params.get("phone_number") ||
      params.get("whatsapp") ||
      ""
  );

  return {
    ...(name ? { name } : {}),
    ...(email ? { email } : {}),
    ...(phone ? { phone } : {}),
  };
}

export function loadFacebookSessionContact(): Partial<ContactDetails> {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(FACEBOOK_CONTACT_SESSION_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Partial<ContactDetails>;
  } catch {
    return {};
  }
}

/** Persist Facebook ad landing contact params for the browsing session. */
export function captureFacebookLandingParams(params: URLSearchParams) {
  if (typeof window === "undefined") return;

  const fromUrl = contactFromSearchParams(params);
  const isFacebook = isFacebookAdTraffic(params);

  if (!isFacebook && !hasContactDetails(fromUrl)) return;

  try {
    sessionStorage.setItem(
      FACEBOOK_SESSION_KEY,
      JSON.stringify({
        fbclid: params.get("fbclid"),
        captured_at: Date.now(),
        is_facebook_ad: isFacebook,
      })
    );

    if (hasContactDetails(fromUrl)) {
      sessionStorage.setItem(FACEBOOK_CONTACT_SESSION_KEY, JSON.stringify(fromUrl));
      if (fromUrl.name && fromUrl.email && fromUrl.phone) {
        saveContact({
          name: fromUrl.name,
          email: fromUrl.email,
          phone: fromUrl.phone,
        });
      }
    }
  } catch {
    // private mode
  }
}

export function splitFullName(name: string): Pick<ContactFormFields, "firstName" | "lastName"> {
  const trimmed = name.trim();
  if (!trimmed) return { firstName: "", lastName: "" };
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

export function joinFullName(firstName: string, lastName: string): string {
  return [firstName.trim(), lastName.trim()].filter(Boolean).join(" ");
}

export function resolveContactFormPrefill(params?: URLSearchParams): ContactFormFields {
  if (params) captureFacebookLandingParams(params);

  const fromUrl = params ? contactFromSearchParams(params) : {};
  const fromFacebookSession = loadFacebookSessionContact();
  const saved = loadSavedContact();

  const firstNameParam = params
    ? safeDecode(
        params.get("first_name") ||
          params.get("firstname") ||
          params.get("fn") ||
          params.get("given_name") ||
          ""
      )
    : "";
  const lastNameParam = params
    ? safeDecode(
        params.get("last_name") ||
          params.get("lastname") ||
          params.get("ln") ||
          params.get("family_name") ||
          ""
      )
    : "";

  const mergedName =
    fromUrl.name || fromFacebookSession.name || saved.name || "";
  const split = splitFullName(mergedName);

  return {
    firstName: firstNameParam || split.firstName,
    lastName: lastNameParam || split.lastName,
    email: fromUrl.email || fromFacebookSession.email || saved.email || "",
    phone: fromUrl.phone || fromFacebookSession.phone || saved.phone || "",
  };
}

/** Merge URL, Facebook session, and saved contact into one profile. */
export function getResolvedContact(params?: URLSearchParams): Partial<ContactDetails> {
  if (params) captureFacebookLandingParams(params);
  const fromUrl = params ? contactFromSearchParams(params) : {};
  const fromFacebookSession = loadFacebookSessionContact();
  const saved = loadSavedContact();

  return {
    name: fromUrl.name || fromFacebookSession.name || saved.name || "",
    email: fromUrl.email || fromFacebookSession.email || saved.email || "",
    phone: fromUrl.phone || fromFacebookSession.phone || saved.phone || "",
  };
}

/**
 * Build a dashboard-ready contact. Needs at least a phone number.
 * Missing name/email are filled so WhatsApp leads still save.
 */
export function normalizeContactForLead(
  partial: Partial<ContactDetails>
): ContactDetails | null {
  const phone = (partial.phone || "").trim();
  if (!phone) return null;

  let name = (partial.name || "").trim();
  let email = (partial.email || "").trim();

  if (!name && email) {
    name = email.split("@")[0]?.replace(/[._+]/g, " ").trim() || "Website visitor";
  }
  if (!name) name = "Website visitor";

  if (!email) {
    const digits = phone.replace(/\D/g, "") || "unknown";
    email = `${digits}@noemail.inukaproperties.co.ke`;
  }

  return { name, email, phone };
}

export function hasUsablePhone(partial: Partial<ContactDetails>): boolean {
  return Boolean((partial.phone || "").trim());
}

function leadCaptureKey(details: ContactDetails): string {
  return `${details.phone.replace(/\D/g, "")}|${details.email.toLowerCase()}`;
}

export function wasLeadCapturedThisSession(details: ContactDetails): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = sessionStorage.getItem(AUTO_CAPTURED_KEY);
    if (!raw) return false;
    const keys = JSON.parse(raw) as string[];
    return keys.includes(leadCaptureKey(details));
  } catch {
    return false;
  }
}

export function markLeadCapturedThisSession(details: ContactDetails) {
  if (typeof window === "undefined") return;
  try {
    const raw = sessionStorage.getItem(AUTO_CAPTURED_KEY);
    const keys: string[] = raw ? (JSON.parse(raw) as string[]) : [];
    const key = leadCaptureKey(details);
    if (!keys.includes(key)) {
      keys.push(key);
      sessionStorage.setItem(AUTO_CAPTURED_KEY, JSON.stringify(keys));
    }
  } catch {
    // private mode
  }
}

/** Fresh contact from this page URL (not only old localStorage). */
export function contactFromCurrentVisit(params: URLSearchParams): Partial<ContactDetails> {
  const fromUrl = contactFromSearchParams(params);
  if (hasContactDetails(fromUrl)) return fromUrl;
  if (isFacebookAdTraffic(params)) return loadFacebookSessionContact();
  return {};
}

/** @deprecated Use resolveContactFormPrefill */
export function resolveContactPrefill(params?: URLSearchParams): ContactDetails {
  const fields = resolveContactFormPrefill(params);
  return {
    name: joinFullName(fields.firstName, fields.lastName),
    email: fields.email,
    phone: fields.phone,
  };
}

export function hasContactDetails(details: Partial<ContactDetails>): boolean {
  return Boolean(details.name || details.email || details.phone);
}

export function hasContactFormFields(fields: Partial<ContactFormFields>): boolean {
  return Boolean(
    fields.firstName || fields.lastName || fields.email || fields.phone
  );
}

export function isFacebookAdSession(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = sessionStorage.getItem(FACEBOOK_SESSION_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw) as { is_facebook_ad?: boolean };
    return Boolean(data.is_facebook_ad);
  } catch {
    return false;
  }
}
