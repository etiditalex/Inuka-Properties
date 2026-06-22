import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { adminPath, isAdminPath } from "@/lib/admin/path";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

  if (isAdminPath(pathname) && !isLoginPage && !user) {
    const url = request.nextUrl.clone();
    url.pathname = loginPath;
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

    if (isLoginPage && user) {
      const url = request.nextUrl.clone();
      url.pathname = adminPath();
      url.search = "";
      return NextResponse.redirect(url);
    }

  return supabaseResponse;
}
