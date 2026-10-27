"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Download, Send } from "lucide-react";
import AdminButton from "@/components/admin/AdminButton";
import { AdminInput } from "@/components/admin/AdminForm";
import SurveyShareBar from "@/components/admin/surveys/SurveyShareBar";
import { SurveyBarChart, SurveyPieChart } from "@/components/survey/SurveyCharts";
import { adminPath } from "@/lib/admin/path";
import { createClient } from "@/lib/supabase/client";
import type { Survey, SurveyQuestion, SurveyResponse } from "@/lib/supabase/types";
import { downloadSurveyWorkbook } from "@/lib/surveys/export";
import {
  averageRating,
  buildChart,
  formatAnswer,
  isChoiceQuestion,
  formatSurveyExpiry,
  isSurveyExpired,
  normalizeQuestion,
  normalizeResponse,
  responsesIncludeIdentity,
  textResponses,
} from "@/lib/surveys/model";

export default function SurveyResults({ surveyId }: { surveyId: string }) {
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const supabase = createClient();
    Promise.all([
      supabase.from("surveys").select("*").eq("id", surveyId).single(),
      supabase.from("survey_questions").select("*").eq("survey_id", surveyId).order("sort_order", { ascending: true }),
      supabase.from("survey_responses").select("*").eq("survey_id", surveyId).order("submitted_at", { ascending: false }),
    ]).then(([surveyResult, questionResult, responseResult]) => {
      const failure = surveyResult.error || questionResult.error || responseResult.error;
      if (failure || !surveyResult.data) {
        setError(failure?.message || "Survey not found.");
        setLoading(false);
        return;
      }
      setSurvey(surveyResult.data as Survey);
      setQuestions(((questionResult.data || []) as SurveyQuestion[]).map(normalizeQuestion));
      setResponses(((responseResult.data || []) as SurveyResponse[]).map(normalizeResponse));
      setLoading(false);
    });
  }, [surveyId]);

  const sendReport = async () => {
    setNotice("");
    setSending(true);
    const response = await fetch(`/api/admin/surveys/${surveyId}/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await response.json().catch(() => ({}));
    setSending(false);
    if (!response.ok) {
      setNotice(data.error || "Could not send the report.");
      return;
    }
    setNotice(data.message || "Report sent.");
    setEmail("");
  };

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
      </div>
    );
  }

  if (!survey) {
    return <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error || "Survey not found."}</div>;
  }

  const includeIdentity = survey.collect_identity || responsesIncludeIdentity(responses);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href={adminPath("surveys")} className="text-sm font-medium text-primary-700 hover:underline">
          Back to surveys
        </Link>
        <Link href={adminPath(`surveys/${survey.id}`)} className="text-sm font-medium text-primary-700 hover:underline">
          Edit form
        </Link>
      </div>

      <section className="rounded-2xl border border-dark-200/60 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-montserrat text-xl font-bold text-dark-900">{survey.title}</h2>
            <p className="mt-1 text-sm text-dark-500">
              {responses.length} response{responses.length === 1 ? "" : "s"} · {survey.collect_identity ? "Names and emails" : "Anonymous"} · {isSurveyExpired(survey) ? "Expired" : survey.status}
              {survey.expires_at ? ` · ${isSurveyExpired(survey) ? "Expired" : "Expires"} ${formatSurveyExpiry(survey.expires_at)}` : ""}
            </p>
          </div>
          <SurveyShareBar slug={survey.slug} title={survey.title} status={survey.status} />
        </div>
        <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-end">
          <AdminButton
            variant="secondary"
            onClick={() => downloadSurveyWorkbook({ survey, questions, responses, includeIdentity })}
          >
            <Download size={16} /> Download Excel
          </AdminButton>
          <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-end">
            <div className="min-w-0 flex-1">
              <AdminInput
                label="Email this report"
                type="email"
                value={email}
                placeholder="name@company.com"
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <AdminButton onClick={sendReport} loading={sending} disabled={!email.trim()}>
              <Send size={16} /> Send
            </AdminButton>
          </div>
        </div>
        {notice ? <p className="mt-3 text-sm text-dark-600">{notice}</p> : null}
        {!survey.collect_identity && responsesIncludeIdentity(responses) ? (
          <p className="mt-3 text-xs text-dark-400">
            This survey is anonymous now. Some earlier responses still include a name or email from when collection was turned on.
          </p>
        ) : null}
      </section>

      {questions.map((question, index) => {
        const chart = isChoiceQuestion(question.question_type) ? buildChart(question, responses) : null;
        const written = textResponses(question, responses);
        return (
          <article key={question.id} className="rounded-2xl border border-dark-200/60 bg-white p-5 shadow-sm">
            <h3 className="font-montserrat text-lg font-bold text-dark-900">
              {index + 1}. {question.prompt}
            </h3>
            <p className="mt-1 text-xs text-dark-400">
              {chart ? `${chart.answered} of ${responses.length} answered` : `${written.length} written answer${written.length === 1 ? "" : "s"}`}
            </p>
            {chart ? (
              <>
                {question.question_type === "rating" && chart.answered ? (
                  <p className="mt-2 text-sm font-medium text-primary-800">
                    Average {averageRating(chart.slices).toFixed(1)} / 5
                  </p>
                ) : null}
                {question.question_type === "multiple_choice" ? (
                  <p className="mt-2 text-xs text-dark-400">
                    The pie chart shows the share of all selections. The bars show the percent of people who picked each option.
                  </p>
                ) : null}
                <div className="mt-5 grid gap-8 lg:grid-cols-2">
                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-dark-400">Pie chart</p>
                    <SurveyPieChart slices={chart.slices} />
                  </div>
                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-dark-400">Bar graph</p>
                    <SurveyBarChart
                      slices={chart.slices}
                      denominator={
                        question.question_type === "multiple_choice"
                          ? chart.answered
                          : chart.slices.reduce((sum, slice) => sum + slice.value, 0)
                      }
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="mt-4 max-h-72 space-y-2 overflow-y-auto">
                {written.length ? (
                  written.slice(0, 40).map((item, itemIndex) => (
                    <p key={`${item.submitted_at}-${itemIndex}`} className="rounded-xl bg-dark-50 px-3 py-2 text-sm text-dark-700">
                      {item.text}
                    </p>
                  ))
                ) : (
                  <p className="text-sm text-dark-400">No written answers yet.</p>
                )}
              </div>
            )}
          </article>
        );
      })}

      <section className="overflow-hidden rounded-2xl border border-dark-200/60 bg-white shadow-sm">
        <div className="border-b border-dark-100 px-5 py-4">
          <h3 className="font-montserrat font-bold text-dark-900">All responses</h3>
        </div>
        {responses.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-dark-50 text-xs uppercase tracking-wide text-dark-400">
                <tr>
                  <th className="px-4 py-3 font-semibold">Submitted</th>
                  <th className="px-4 py-3 font-semibold">Mobile</th>
                  {includeIdentity ? <th className="px-4 py-3 font-semibold">Name</th> : null}
                  {includeIdentity ? <th className="px-4 py-3 font-semibold">Email</th> : null}
                  {questions.map((question) => (
                    <th key={question.id} className="px-4 py-3 font-semibold">{question.prompt}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {responses.slice(0, 200).map((response) => (
                  <tr key={response.id} className="border-t border-dark-100 align-top">
                    <td className="whitespace-nowrap px-4 py-3 text-dark-600">
                      {new Date(response.submitted_at).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">{response.respondent_phone || "—"}</td>
                    {includeIdentity ? <td className="px-4 py-3">{response.respondent_name || "—"}</td> : null}
                    {includeIdentity ? <td className="px-4 py-3">{response.respondent_email || "—"}</td> : null}
                    {questions.map((question) => (
                      <td key={question.id} className="max-w-xs px-4 py-3 text-dark-700">
                        {formatAnswer(response.answers[question.id]) || "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="px-5 py-10 text-center text-sm text-dark-400">No responses yet. Share the form link to start collecting them.</p>
        )}
        {responses.length > 200 ? (
          <p className="border-t border-dark-100 px-5 py-3 text-xs text-dark-400">
            Showing the latest 200 responses. Download Excel for the full set.
          </p>
        ) : null}
      </section>
    </div>
  );
}
