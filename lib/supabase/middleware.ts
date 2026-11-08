import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isAdminAllowlistConfigured, isAdminEmailAllowed } from "@/lib/admin/allowlist";
import { adminPath, isAdminPath } from "@/lib/admin/path";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    getSupabaseUrl(),
    getSupabaseAnonKey(),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const loginPath = adminPath("login");
  const isLoginPage = pathname === loginPath;
  const allowed = isAdminEmailAllowed(user?.email);

  if (isAdminPath(pathname) && !isLoginPage && !user) {
    const url = request.nextUrl.clone();
    url.pathname = loginPath;
    url.searchParams.set("redirect", pathname);
    return { response: NextResponse.redirect(url), user };
  }

  if (isAdminPath(pathname) && !isLoginPage && user && !allowed) {
    const url = request.nextUrl.clone();
    url.pathname = loginPath;
    url.searchParams.set("error", isAdminAllowlistConfigured() ? "not-allowed" : "allowlist");
    return { response: NextResponse.redirect(url), user };
  }

  if (isLoginPage && user && allowed) {
    const url = request.nextUrl.clone();
    url.pathname = adminPath();
    url.search = "";
    return { response: NextResponse.redirect(url), user };
  }

  return { response: supabaseResponse, user };
}
