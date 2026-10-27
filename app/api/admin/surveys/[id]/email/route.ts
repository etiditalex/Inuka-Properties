import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Survey, SurveyQuestion, SurveyResponse } from "@/lib/supabase/types";
import { normalizeQuestion, normalizeResponse } from "@/lib/surveys/model";
import { buildSurveyReportHtml, surveyReportSubject } from "@/lib/surveys/report-email";

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

  const { data: surveyRow, error: surveyError } = await supabase.from("surveys").select("*").eq("id", params.id).maybeSingle();
  if (surveyError) return NextResponse.json({ error: surveyError.message }, { status: 500 });
  if (!surveyRow) return NextResponse.json({ error: "Survey not found." }, { status: 404 });

  const survey = surveyRow as Survey;
  const [{ data: questionRows, error: questionError }, { data: responseRows, error: responseError }] = await Promise.all([
    supabase.from("survey_questions").select("*").eq("survey_id", survey.id).order("sort_order", { ascending: true }),
    supabase.from("survey_responses").select("*").eq("survey_id", survey.id).order("submitted_at", { ascending: false }),
  ]);
  if (questionError || responseError) {
    return NextResponse.json({ error: questionError?.message || responseError?.message }, { status: 500 });
  }

  const questions = ((questionRows || []) as SurveyQuestion[]).map(normalizeQuestion);
  const responses = ((responseRows || []) as SurveyResponse[]).map(normalizeResponse);
  const html = buildSurveyReportHtml({ survey, questions, responses });
  const subject = surveyReportSubject(survey, responses.length);
  const from = process.env.EMAIL_FROM || "IAPL Admin <notifications@inukaproperties.co.ke>";
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    if (process.env.NODE_ENV === "development") {
      console.log("[survey-report]", subject, "→", email);
      return NextResponse.json({
        ok: true,
        message: "Mail is not configured in this environment, so the report was logged on the server instead of sent.",
      });
    }
    return NextResponse.json({ error: "Email sending is not configured." }, { status: 503 });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: [email], subject, html }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("[survey-report] Resend failed", res.status, detail);
    return NextResponse.json({ error: "The email could not be sent." }, { status: 502 });
  }

  return NextResponse.json({ ok: true, message: `Report sent to ${email}.` });
}
