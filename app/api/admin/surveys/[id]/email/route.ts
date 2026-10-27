import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Survey } from "@/lib/supabase/types";
import {
  deliverFinalSurveyReport,
  rememberSurveyReportRecipient,
  sendSurveyReportEmail,
} from "@/lib/surveys/deliver-report";
import { surveySubmissionsClosed } from "@/lib/surveys/model";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  if (body.finalize === true) {
    const result = await deliverFinalSurveyReport(params.id, supabase);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 });
    return NextResponse.json({
      ok: true,
      sent: result.sent,
      message: result.sent
        ? `Excel report sent to ${result.sent} address${result.sent === 1 ? "" : "es"}.`
        : "No final report was sent.",
    });
  }

  const email = String(body.email || "").trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 200) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const { data: surveyRow, error: surveyError } = await supabase.from("surveys").select("*").eq("id", params.id).maybeSingle();
  if (surveyError) return NextResponse.json({ error: surveyError.message }, { status: 500 });
  if (!surveyRow) return NextResponse.json({ error: "Survey not found." }, { status: 404 });

  const saved = await rememberSurveyReportRecipient(supabase, params.id, email);
  if (saved) {
    console.error("[survey-report] could not save recipient", saved.message);
    return NextResponse.json(
      { error: "The address could not be saved. Run the latest Inuka Survey SQL in Supabase, then try again." },
      { status: 500 }
    );
  }

  if (!surveySubmissionsClosed(surveyRow as Survey)) {
    return NextResponse.json({
      ok: true,
      sent: 0,
      message: `${email} will receive the Excel report when this survey closes.`,
    });
  }

  const sent = await sendSurveyReportEmail(supabase, params.id, email);
  if (!sent.ok) return NextResponse.json({ error: sent.error }, { status: sent.status });

  const now = new Date().toISOString();
  await supabase
    .from("survey_report_recipients")
    .update({ final_sent_at: now, updated_at: now })
    .eq("survey_id", params.id)
    .eq("email", email);

  return NextResponse.json({
    ok: true,
    sent: 1,
    message: `Excel report sent to ${email}.`,
  });
}
