import type { SupabaseClient } from "@supabase/supabase-js";
import { createServiceClient } from "@/lib/supabase/service";
import type { Survey, SurveyQuestion, SurveyResponse } from "@/lib/supabase/types";
import { normalizeQuestion, normalizeResponse, responsesIncludeIdentity, surveySubmissionsClosed } from "@/lib/surveys/model";
import { surveyWorkbookAttachment } from "@/lib/surveys/export";
import { buildSurveyReportHtml, surveyReportSubject } from "@/lib/surveys/report-email";

type SendResult =
  | { ok: true }
  | { ok: false; error: string; status: number };

export async function sendSurveyReportEmail(
  supabase: SupabaseClient,
  surveyId: string,
  email: string
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
  const html = buildSurveyReportHtml(survey, responses.length);
  const subject = surveyReportSubject(survey, responses.length);
  const from = process.env.EMAIL_FROM || "IAPL Admin <notifications@inukaproperties.co.ke>";
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    if (process.env.NODE_ENV === "development") {
      console.log("[survey-report]", subject, "→", email, attachment.filename);
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

async function markSurveyReportSent(supabase: SupabaseClient, surveyId: string, email: string) {
  const now = new Date().toISOString();
  const { error } = await supabase
    .from("survey_report_recipients")
    .update({ final_sent_at: now, updated_at: now })
    .eq("survey_id", surveyId)
    .eq("email", email);
  if (error) console.error("[survey-report] could not record the final send", error.message);
}

export async function deliverFinalSurveyReport(surveyId: string, supabase?: SupabaseClient) {
  const client = supabase ?? createServiceClient();
  if (!client) {
    console.error("[survey-report] service client is not configured; the final report was not emailed");
    return { ok: false as const, error: "Email updates are not configured.", sent: 0 };
  }

  const { data: surveyRow, error: surveyError } = await client.from("surveys").select("*").eq("id", surveyId).maybeSingle();
  if (surveyError) return { ok: false as const, error: surveyError.message, sent: 0 };
  if (!surveyRow) return { ok: false as const, error: "Survey not found.", sent: 0 };
  if (!surveySubmissionsClosed(surveyRow as Survey)) return { ok: true as const, sent: 0 };

  const { data, error } = await client
    .from("survey_report_recipients")
    .select("email, final_sent_at")
    .eq("survey_id", surveyId);
  if (error) {
    console.error("[survey-report] could not load report recipients", error.message);
    return { ok: false as const, error: error.message, sent: 0 };
  }

  const emails = Array.from(
    new Set(
      (data || [])
        .filter((row) => !row.final_sent_at)
        .map((row) => String(row.email || "").trim().toLowerCase())
        .filter(Boolean)
    )
  );

  let sent = 0;
  for (const email of emails) {
    const result = await sendSurveyReportEmail(client, surveyId, email);
    if (!result.ok) {
      console.error("[survey-report] final send failed", email, result.error);
      continue;
    }
    await markSurveyReportSent(client, surveyId, email);
    sent += 1;
  }

  return { ok: true as const, sent };
}
