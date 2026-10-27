import { NextResponse } from "next/server";
import { isSupabaseServerConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { sendSms } from "@/lib/sms/provider";
import type { Survey, SurveyQuestion } from "@/lib/supabase/types";
import { normalizeQuestion, validateSubmission } from "@/lib/surveys/model";

export const dynamic = "force-dynamic";

export async function POST(request: Request, { params }: { params: { slug: string } }) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (typeof body.company_website === "string" && body.company_website.trim()) {
    return NextResponse.json({ ok: true });
  }

  if (!isSupabaseServerConfigured()) {
    return NextResponse.json({ error: "Surveys are temporarily unavailable." }, { status: 503 });
  }

  const supabase = await createClient();
  const { data: survey, error } = await supabase.from("surveys").select("*").eq("slug", params.slug).maybeSingle();
  if (error) return NextResponse.json({ error: "Surveys are temporarily unavailable." }, { status: 503 });
  if (!survey) return NextResponse.json({ error: "Survey not found." }, { status: 404 });

  const { data: questionRows, error: questionError } = await supabase
    .from("survey_questions")
    .select("*")
    .eq("survey_id", survey.id)
    .order("sort_order", { ascending: true });
  if (questionError) {
    return NextResponse.json({ error: "Surveys are temporarily unavailable." }, { status: 503 });
  }

  const questions = ((questionRows || []) as SurveyQuestion[]).map(normalizeQuestion);
  const validation = validateSubmission({
    survey: survey as Survey,
    questions,
    name: typeof body.name === "string" ? body.name : "",
    email: typeof body.email === "string" ? body.email : "",
    phone: typeof body.phone === "string" ? body.phone : "",
    answers: body.answers && typeof body.answers === "object" ? body.answers : {},
  });
  if (!validation.ok) return NextResponse.json({ error: validation.error }, { status: 400 });

  const { error: insertError } = await supabase.from("survey_responses").insert({
    survey_id: survey.id,
    respondent_name: validation.name,
    respondent_email: validation.email,
    respondent_phone: validation.phone,
    answers: validation.answers,
  });
  if (insertError) {
    if (insertError.code === "23505") {
      return NextResponse.json(
        { error: "This number has already submitted a response for this survey." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Could not save your response." }, { status: 500 });
  }

  const thankYou = String(survey.thank_you_message || "Thank you. Your response has been recorded.").trim();
  const sms = await sendSms(validation.phone, `${survey.title}: ${thankYou}`.slice(0, 320));
  if (!sms.ok) console.error("[survey-sms]", sms.error);

  return NextResponse.json({ ok: true, smsSent: sms.ok });
}
