import type { Survey, SurveyQuestion, SurveyResponse } from "@/lib/supabase/types";
import { adminPath } from "@/lib/admin/path";
import { SITE_ORIGIN } from "@/lib/site";
import {
  averageRating,
  buildChart,
  isChoiceQuestion,
  percent,
  textResponses,
} from "@/lib/surveys/model";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildSurveyReportHtml(input: {
  survey: Survey;
  questions: SurveyQuestion[];
  responses: SurveyResponse[];
}) {
  const { survey, questions, responses } = input;
  const resultsUrl = `${SITE_ORIGIN}${adminPath(`surveys/${survey.id}/results`)}`;
  const identity = survey.collect_identity ? "Names and emails collected" : "Anonymous";

  const sections = questions
    .map((question, index) => {
      if (isChoiceQuestion(question.question_type)) {
        const chart = buildChart(question, responses);
        const whole = question.question_type === "multiple_choice"
          ? chart.answered
          : chart.slices.reduce((sum, slice) => sum + slice.value, 0);
        const average =
          question.question_type === "rating" && chart.answered
            ? `<p style="margin:8px 0 0;color:#475569;font-size:13px;">Average rating: ${averageRating(chart.slices).toFixed(1)} / 5</p>`
            : "";
        const rows = chart.slices
          .map((slice) => {
            const share = percent(slice.value, whole);
            return `<tr>
              <td style="padding:8px 0;color:#0f172a;font-size:14px;">${escapeHtml(slice.label)}</td>
              <td style="padding:8px 12px;width:46%;">
                <div style="background:#e2e8f0;border-radius:999px;height:10px;overflow:hidden;">
                  <div style="background:${slice.color};height:10px;width:${share}%;"></div>
                </div>
              </td>
              <td style="padding:8px 0;text-align:right;color:#0f172a;font-size:13px;white-space:nowrap;">${slice.value} · ${share}%</td>
            </tr>`;
          })
          .join("");
        return `<h3 style="margin:28px 0 4px;font-size:16px;color:#0f172a;">${index + 1}. ${escapeHtml(question.prompt)}</h3>
          <p style="margin:0;color:#64748b;font-size:12px;">${chart.answered} of ${responses.length} answered</p>
          ${average}
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">${rows}</table>`;
      }

      const allWritten = textResponses(question, responses);
      const written = allWritten.slice(0, 8);
      const items = written.length
        ? written
            .map(
              (item) =>
                `<li style="margin:0 0 8px;color:#334155;font-size:14px;">${escapeHtml(item.text)}</li>`
            )
            .join("")
        : `<li style="color:#94a3b8;font-size:14px;">No written answers yet.</li>`;
      const more =
        allWritten.length > written.length
          ? `<p style="margin:8px 0 0;color:#64748b;font-size:12px;">Showing ${written.length} of ${allWritten.length}. Download the Excel file for the rest.</p>`
          : "";
      return `<h3 style="margin:28px 0 8px;font-size:16px;color:#0f172a;">${index + 1}. ${escapeHtml(question.prompt)}</h3>
        <ul style="margin:0;padding-left:18px;">${items}</ul>${more}`;
    })
    .join("");

  return `<!DOCTYPE html>
  <html>
    <body style="margin:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;">
      <div style="max-width:640px;margin:0 auto;padding:32px 16px;">
        <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;padding:28px;">
          <p style="margin:0 0 8px;color:#0284c7;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">Inuka Survey</p>
          <h1 style="margin:0;font-size:24px;color:#0f172a;">${escapeHtml(survey.title)}</h1>
          <p style="margin:8px 0 0;color:#64748b;font-size:14px;">${responses.length} response${responses.length === 1 ? "" : "s"} · ${identity}</p>
          ${survey.description ? `<p style="margin:16px 0 0;color:#334155;font-size:14px;line-height:1.5;">${escapeHtml(survey.description)}</p>` : ""}
          ${sections || `<p style="margin-top:24px;color:#64748b;">This survey has no questions yet.</p>`}
          <p style="margin:28px 0 0;">
            <a href="${resultsUrl}" style="display:inline-block;background:#0284c7;color:#ffffff;text-decoration:none;font-weight:700;border-radius:10px;padding:12px 16px;">Open full report</a>
          </p>
          <p style="margin:16px 0 0;color:#94a3b8;font-size:12px;">Written answers in this email are a sample. Download the Excel file from the dashboard for every response.</p>
        </div>
      </div>
    </body>
  </html>`;
}

export function surveyReportSubject(survey: Survey, responseCount: number) {
  return `Inuka Survey report: ${survey.title} (${responseCount} response${responseCount === 1 ? "" : "s"})`;
}
