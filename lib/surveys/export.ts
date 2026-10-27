import * as XLSX from "xlsx";
import type { Survey, SurveyQuestion, SurveyResponse } from "@/lib/supabase/types";
import { buildChart, formatAnswer, isChoiceQuestion, percent, questionTypeLabel } from "@/lib/surveys/model";

function todayStamp() {
  return new Date().toISOString().split("T")[0];
}

function safeFileName(title: string) {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return base || "survey";
}

function autoSizeColumns(sheet: XLSX.WorkSheet) {
  const range = XLSX.utils.decode_range(sheet["!ref"] || "A1");
  const widths: number[] = [];
  for (let col = range.s.c; col <= range.e.c; col++) {
    let max = 12;
    for (let row = range.s.r; row <= range.e.r; row++) {
      const cell = sheet[XLSX.utils.encode_cell({ r: row, c: col })];
      const value = cell?.v != null ? String(cell.v) : "";
      max = Math.max(max, Math.min(value.length + 2, 48));
    }
    widths.push(max);
  }
  sheet["!cols"] = widths.map((width) => ({ wch: width }));
}

function questionHeaders(questions: SurveyQuestion[]) {
  const seen = new Map<string, number>();
  return questions.map((question) => {
    const base = question.prompt.trim() || "Question";
    const count = (seen.get(base) || 0) + 1;
    seen.set(base, count);
    return count === 1 ? base : `${base} (${count})`;
  });
}

function createSurveyWorkbook(input: {
  survey: Survey;
  questions: SurveyQuestion[];
  responses: SurveyResponse[];
  includeIdentity: boolean;
}) {
  const { survey, questions, responses, includeIdentity } = input;
  const summaryRows: Record<string, string | number>[] = [];

  for (const question of questions) {
    if (isChoiceQuestion(question.question_type)) {
      const chart = buildChart(question, responses);
      const pieTotal = chart.slices.reduce((sum, slice) => sum + slice.value, 0);
      if (!chart.slices.length) {
        summaryRows.push({
          Question: question.prompt,
          Type: questionTypeLabel(question.question_type),
          Option: "",
          Count: 0,
          "Percent of answers": 0,
        });
      }
      for (const slice of chart.slices) {
        summaryRows.push({
          Question: question.prompt,
          Type: questionTypeLabel(question.question_type),
          Option: slice.label,
          Count: slice.value,
          "Percent of answers": percent(slice.value, question.question_type === "multiple_choice" ? chart.answered : pieTotal),
        });
      }
    } else {
      const filled = responses.filter((response) => formatAnswer(response.answers[question.id])).length;
      summaryRows.push({
        Question: question.prompt,
        Type: questionTypeLabel(question.question_type),
        Option: `${filled} written answer${filled === 1 ? "" : "s"}`,
        Count: filled,
        "Percent of answers": percent(filled, responses.length),
      });
    }
  }

  const headers = questionHeaders(questions);
  const responseRows = responses.map((response) => {
    const row: Record<string, string> = {
      Submitted: new Date(response.submitted_at).toLocaleString("en-GB"),
    };
    row.Mobile = response.respondent_phone || "";
    if (includeIdentity) {
      row.Name = response.respondent_name || "";
      row.Email = response.respondent_email || "";
    }
    questions.forEach((question, index) => {
      row[headers[index]] = formatAnswer(response.answers[question.id]);
    });
    return row;
  });

  const workbook = XLSX.utils.book_new();
  const summarySheet = XLSX.utils.json_to_sheet(
    summaryRows.length ? summaryRows : [{ Question: survey.title, Type: "", Option: "No responses yet", Count: 0, "Percent of answers": 0 }]
  );
  autoSizeColumns(summarySheet);
  XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");

  const responseSheet = XLSX.utils.json_to_sheet(
    responseRows.length
      ? responseRows
      : [{ Submitted: "", Mobile: "", ...(includeIdentity ? { Name: "", Email: "" } : {}), Note: "No responses yet" }]
  );
  autoSizeColumns(responseSheet);
  XLSX.utils.book_append_sheet(workbook, responseSheet, "Responses");
  return {
    workbook,
    filename: `Inuka-Survey-${safeFileName(survey.title)}-${todayStamp()}.xlsx`,
  };
}

export function downloadSurveyWorkbook(input: {
  survey: Survey;
  questions: SurveyQuestion[];
  responses: SurveyResponse[];
  includeIdentity: boolean;
}) {
  const { workbook, filename } = createSurveyWorkbook(input);
  XLSX.writeFile(workbook, filename);
}

export function surveyWorkbookAttachment(input: {
  survey: Survey;
  questions: SurveyQuestion[];
  responses: SurveyResponse[];
  includeIdentity: boolean;
}) {
  const { workbook, filename } = createSurveyWorkbook(input);
  const content = XLSX.write(workbook, { bookType: "xlsx", type: "base64" }) as string;
  return { filename, content };
}
