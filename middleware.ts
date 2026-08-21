import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { isSupabaseServerConfigured } from "@/lib/supabase/env";
import {
  getAdminBasePath,
  isAdminPath,
  isLegacyAdminPath,
  toInternalAdminPath,
  usesSecretAdminPath,
} from "@/lib/admin/path";

function withNoIndex(response: NextResponse): NextResponse {
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return response;
}

/** Canonical host + HTTPS for production SEO + hidden admin path + Supabase auth. */
export async function middleware(request: NextRequest) {
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

  const pathname = request.nextUrl.pathname;

  // Hide the default /admin URL when a custom path is configured
  if (usesSecretAdminPath() && isLegacyAdminPath(pathname)) {
    return withNoIndex(NextResponse.rewrite(new URL("/not-found", request.url)));
  }

  if (isAdminPath(pathname)) {
    let response: NextResponse;

    if (isSupabaseServerConfigured()) {
      response = await updateSession(request);
    } else {
      response = NextResponse.next({ request });
    }

    // Serve app/admin/* while keeping the secret URL in the browser
    const adminBase = getAdminBasePath();
    if (adminBase !== "/admin") {
      const rewriteUrl = request.nextUrl.clone();
      rewriteUrl.pathname = toInternalAdminPath(pathname);
      const rewriteResponse = NextResponse.rewrite(rewriteUrl);

      response.cookies.getAll().forEach((cookie) => {
        rewriteResponse.cookies.set(cookie);
      });
      response.headers.forEach((value, key) => {
        if (key.toLowerCase() === "location") {
          rewriteResponse.headers.set(key, value);
        }
      });

      if (response.status >= 300 && response.status < 400) {
        return withNoIndex(response);
      }

      return withNoIndex(rewriteResponse);
    }

    return withNoIndex(response);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|xml)$).*)",
  ],
};
