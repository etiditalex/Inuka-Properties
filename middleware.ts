import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Canonical host + HTTPS for production SEO. */
export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  if (
    process.env.NODE_ENV === "production" &&
    host === "inukaproperties.co.ke"
  ) {
    const url = request.nextUrl.clone();
    url.host = "www.inukaproperties.co.ke";
    url.protocol = "https:";
    return NextResponse.redirect(url, 301);
  }

  if (
    process.env.NODE_ENV === "production" &&
    proto === "http" &&
    host.endsWith("inukaproperties.co.ke")
  ) {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
