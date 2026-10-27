import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rememberSurveyReportRecipient, sendSurveyReportEmail } from "@/lib/surveys/deliver-report";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 200) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const sent = await sendSurveyReportEmail(supabase, params.id, email, false);
  if (!sent.ok) return NextResponse.json({ error: sent.error }, { status: sent.status });

  const saved = await rememberSurveyReportRecipient(supabase, params.id, email);
  if (saved) {
    console.error("[survey-report] could not save recipient", saved.message);
    return NextResponse.json({
      ok: true,
      message: `Excel report sent to ${email}. Automatic updates were not saved. Run the latest Inuka Survey SQL in Supabase, then send to this address again.`,
    });
  }

  return NextResponse.json({
    ok: true,
    message: `Excel report sent to ${email}. Each new response will email an updated Excel file to this address.`,
  });
}
