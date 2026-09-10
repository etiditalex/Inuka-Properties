export const LANDING_PAGE_BASE = "/lp";

export function landingPagePath(slug: string): string {
  const clean = slug.replace(/^\/+|\/+$/g, "");
  return `${LANDING_PAGE_BASE}/${clean}`;
}

export function isLandingPagePath(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return pathname === LANDING_PAGE_BASE || pathname.startsWith(`${LANDING_PAGE_BASE}/`);
}
