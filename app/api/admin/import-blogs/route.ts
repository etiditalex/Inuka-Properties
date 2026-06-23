import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { authConfigError } from "@/lib/admin/auth-config";
import { importCatalogBlogs } from "@/lib/blog/importCatalog";
import { BLOG_POSTS } from "@/lib/blogPosts";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const serviceClient = createServiceClient();
    if (!serviceClient) {
      return NextResponse.json({ error: authConfigError() }, { status: 503 });
    }

    const result = await importCatalogBlogs(serviceClient);

    return NextResponse.json({
      ...result,
      total: BLOG_POSTS.length,
      message:
        result.failed === 0
          ? `Imported ${result.imported} blog posts from the website.`
          : `Imported ${result.imported} blog posts. ${result.failed} failed.`,
    });
  } catch (err) {
    console.error("[import-blogs]", err);
    return NextResponse.json({ error: "Import failed" }, { status: 500 });
  }
}
