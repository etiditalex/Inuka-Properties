import type { SupabaseClient } from "@supabase/supabase-js";
import { createServiceClient } from "@/lib/supabase/service";
import type { Survey, SurveyQuestion, SurveyResponse } from "@/lib/supabase/types";
import { normalizeQuestion, normalizeResponse, responsesIncludeIdentity } from "@/lib/surveys/model";
import { surveyWorkbookAttachment } from "@/lib/surveys/export";
import { buildSurveyReportHtml, surveyReportSubject } from "@/lib/surveys/report-email";

type SendResult =
  | { ok: true }
  | { ok: false; error: string; status: number };

export async function sendSurveyReportEmail(
  supabase: SupabaseClient,
  surveyId: string,
  email: string,
  updated = false
): Promise<SendResult> {
  const { data: surveyRow, error: surveyError } = await supabase.from("surveys").select("*").eq("id", surveyId).maybeSingle();
  if (surveyError) return { ok: false, error: surveyError.message, status: 500 };
  if (!surveyRow) return { ok: false, error: "Survey not found.", status: 404 };

  const survey = surveyRow as Survey;
  const [{ data: questionRows, error: questionError }, { data: responseRows, error: responseError }] = await Promise.all([
    supabase.from("survey_questions").select("*").eq("survey_id", survey.id).order("sort_order", { ascending: true }),
    supabase.from("survey_responses").select("*").eq("survey_id", survey.id).order("submitted_at", { ascending: false }),
  ]);
  if (questionError || responseError) {
    return { ok: false, error: questionError?.message || responseError?.message || "Could not load the report.", status: 500 };
  }

  const questions = ((questionRows || []) as SurveyQuestion[]).map(normalizeQuestion);
  const responses = ((responseRows || []) as SurveyResponse[]).map(normalizeResponse);
  const includeIdentity = survey.collect_identity || responsesIncludeIdentity(responses);
  const attachment = surveyWorkbookAttachment({ survey, questions, responses, includeIdentity });
  const html = buildSurveyReportHtml(survey, responses.length, updated);
  const subject = surveyReportSubject(survey, responses.length);
  const from = process.env.EMAIL_FROM || "IAPL Admin <notifications@inukaproperties.co.ke>";
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    if (process.env.NODE_ENV === "development") {
      console.log("[survey-report]", updated ? "update" : "send", subject, "→", email, attachment.filename);
      return { ok: true };
    }
    return { ok: false, error: "Email sending is not configured.", status: 503 };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject,
      html,
      attachments: [{ filename: attachment.filename, content: attachment.content }],
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("[survey-report] Resend failed", res.status, detail);
    return { ok: false, error: "The email could not be sent.", status: 502 };
  }

  return { ok: true };
}

export async function rememberSurveyReportRecipient(supabase: SupabaseClient, surveyId: string, email: string) {
  const now = new Date().toISOString();
  const { error } = await supabase.from("survey_report_recipients").upsert(
    { survey_id: surveyId, email, updated_at: now },
    { onConflict: "survey_id,email" }
  );
  return error;
}

export async function refreshSurveyReportEmails(surveyId: string) {
  const supabase = createServiceClient();
  if (!supabase) {
    console.error("[survey-report] service client is not configured; the emailed report was not updated");
    return;
  }

  const { data, error } = await supabase.from("survey_report_recipients").select("email").eq("survey_id", surveyId);
  if (error) {
    console.error("[survey-report] could not load report recipients", error.message);
    return;
  }

  const emails = Array.from(
    new Set((data || []).map((row) => String(row.email || "").trim().toLowerCase()).filter(Boolean))
  );
  for (const email of emails) {
    const result = await sendSurveyReportEmail(supabase, surveyId, email, true);
    if (!result.ok) console.error("[survey-report] update failed", email, result.error);
  }
}
