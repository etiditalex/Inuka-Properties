import { NextResponse } from "next/server";
import { fetchPublishedLandingPage } from "@/lib/landing-pages/getLandingPage";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const page = await fetchPublishedLandingPage(params.slug);
  if (!page) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ page });
}
