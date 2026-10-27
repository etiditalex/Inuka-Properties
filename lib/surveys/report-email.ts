import type { Survey } from "@/lib/supabase/types";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildSurveyReportHtml(survey: Survey, responseCount: number, updated = false) {
  const responses = `${responseCount} response${responseCount === 1 ? "" : "s"}`;
  const message = updated
    ? `A new response was recorded. This Excel file replaces the earlier one and includes all ${responses}. Open the attachment for the latest results. No login is required.`
    : `The report is attached as an Excel file (${responses}). Open the attachment to see the summary and every response. Each new response sends an updated Excel file to this address. No login is required.`;
  return `<!DOCTYPE html>
  <html>
    <body style="margin:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;">
      <div style="max-width:640px;margin:0 auto;padding:32px 16px;">
        <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;padding:28px;">
          <p style="margin:0 0 8px;color:#0284c7;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">Inuka Survey</p>
          <h1 style="margin:0;font-size:24px;color:#0f172a;">${escapeHtml(survey.title)}</h1>
          <p style="margin:16px 0 0;color:#334155;font-size:15px;line-height:1.5;">${message}</p>
        </div>
      </div>
    </body>
  </html>`;
}

export function surveyReportSubject(survey: Survey, responseCount: number) {
  return `Inuka Survey report: ${survey.title} (${responseCount} response${responseCount === 1 ? "" : "s"})`;
}
