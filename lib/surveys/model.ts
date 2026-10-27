import type {
  Survey,
  SurveyAnswerValue,
  SurveyQuestion,
  SurveyQuestionType,
  SurveyResponse,
} from "@/lib/supabase/types";
import { formatPhoneKenyaE164, isValidKenyaMobile } from "@/lib/phone/kenya";

export const QUESTION_TYPE_OPTIONS: { value: SurveyQuestionType; label: string }[] = [
  { value: "short_text", label: "Short answer" },
  { value: "long_text", label: "Paragraph" },
  { value: "single_choice", label: "Multiple choice" },
  { value: "multiple_choice", label: "Checkboxes" },
  { value: "yes_no", label: "Yes / No" },
  { value: "rating", label: "Rating (1–5)" },
];

export const SURVEY_STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "open", label: "Open — accepting responses" },
  { value: "closed", label: "Closed" },
];

export const CHART_COLORS = [
  "#0284c7",
  "#d97706",
  "#0369a1",
  "#0ea5e9",
  "#b45309",
  "#075985",
  "#f59e0b",
  "#38bdf8",
  "#92400e",
  "#0c4a6e",
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ChartSlice = {
  key: string;
  label: string;
  value: number;
  color: string;
};

export function isChoiceQuestion(type: SurveyQuestionType) {
  return (
    type === "single_choice" ||
    type === "multiple_choice" ||
    type === "yes_no" ||
    type === "rating"
  );
}

export function normalizeOptions(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item));
}

export function normalizeAnswers(value: unknown): Record<string, SurveyAnswerValue> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const answers: Record<string, SurveyAnswerValue> = {};
  for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
    if (Array.isArray(raw)) answers[key] = raw.map((item) => String(item));
    else if (raw != null && String(raw).trim()) answers[key] = String(raw);
  }
  return answers;
}

export function normalizeQuestion(row: SurveyQuestion): SurveyQuestion {
  return {
    ...row,
    options: normalizeOptions(row.options),
    help_text: row.help_text || null,
  };
}

export function normalizeResponse(row: SurveyResponse): SurveyResponse {
  return {
    ...row,
    answers: normalizeAnswers(row.answers),
  };
}

export function answerValues(value: SurveyAnswerValue | undefined): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((item) => item.trim()).filter(Boolean);
  const text = value.trim();
  return text ? [text] : [];
}

export function formatAnswer(value: SurveyAnswerValue | undefined): string {
  return answerValues(value).join(", ");
}

export function choiceLabels(question: SurveyQuestion): { key: string; label: string }[] {
  if (question.question_type === "yes_no") {
    return [
      { key: "Yes", label: "Yes" },
      { key: "No", label: "No" },
    ];
  }
  if (question.question_type === "rating") {
    return [1, 2, 3, 4, 5].map((score) => ({ key: String(score), label: String(score) }));
  }
  return normalizeOptions(question.options)
    .map((option) => option.trim())
    .filter(Boolean)
    .map((option) => ({ key: option, label: option }));
}

export function buildChart(question: SurveyQuestion, responses: SurveyResponse[]) {
  const labels = choiceLabels(question);
  const counts = new Map(labels.map((item) => [item.key, 0]));
  let answered = 0;

  for (const response of responses) {
    const values = answerValues(response.answers[question.id]);
    if (values.length) answered += 1;
    for (const value of values) {
      if (counts.has(value)) counts.set(value, (counts.get(value) || 0) + 1);
    }
  }

  const slices: ChartSlice[] = labels.map((item, index) => ({
    key: item.key,
    label: item.label,
    value: counts.get(item.key) || 0,
    color: CHART_COLORS[index % CHART_COLORS.length],
  }));

  return { slices, answered };
}

export function averageRating(slices: ChartSlice[]) {
  const total = slices.reduce((sum, slice) => sum + slice.value, 0);
  if (!total) return 0;
  const weighted = slices.reduce((sum, slice) => sum + Number(slice.key) * slice.value, 0);
  return weighted / total;
}

export function textResponses(question: SurveyQuestion, responses: SurveyResponse[]) {
  return responses.flatMap((response) => {
    const text = formatAnswer(response.answers[question.id]);
    if (!text) return [];
    return [{ text, submitted_at: response.submitted_at }];
  });
}

export function percent(part: number, whole: number) {
  if (!whole) return 0;
  return Math.round((part / whole) * 100);
}

export function questionTypeLabel(type: SurveyQuestionType) {
  return QUESTION_TYPE_OPTIONS.find((option) => option.value === type)?.label || type;
}

type ParsedAnswer =
  | { ok: true; value: SurveyAnswerValue | null }
  | { ok: false; error: string };

function parseAnswer(question: SurveyQuestion, raw: unknown): ParsedAnswer {
  if (question.question_type === "multiple_choice") {
    const values = Array.isArray(raw) ? raw.map((item) => String(item).trim()).filter(Boolean) : [];
    const unique = Array.from(new Set(values));
    if (!unique.length) return { ok: true, value: null };
    const allowed = new Set(choiceLabels(question).map((item) => item.key));
    if (unique.some((value) => !allowed.has(value))) {
      return { ok: false, error: `Choose a valid option for “${question.prompt}”.` };
    }
    return { ok: true, value: unique };
  }

  const text = raw == null ? "" : String(Array.isArray(raw) ? raw[0] ?? "" : raw).trim();
  if (!text) return { ok: true, value: null };

  if (question.question_type === "short_text" && text.length > 300) {
    return { ok: false, error: `“${question.prompt}” is too long.` };
  }
  if (question.question_type === "long_text" && text.length > 4000) {
    return { ok: false, error: `“${question.prompt}” is too long.` };
  }
  if (isChoiceQuestion(question.question_type)) {
    const allowed = new Set(choiceLabels(question).map((item) => item.key));
    if (!allowed.has(text)) {
      return { ok: false, error: `Choose a valid option for “${question.prompt}”.` };
    }
  }
  return { ok: true, value: text };
}

export function isSurveyExpired(survey: { expires_at?: string | null }, now = Date.now()) {
  if (!survey.expires_at) return false;
  const time = new Date(survey.expires_at).getTime();
  return Number.isFinite(time) && time <= now;
}

export function surveySubmissionsClosed(
  survey: { status?: string | null; expires_at?: string | null },
  now = Date.now()
) {
  if (survey.status === "closed") return true;
  if (survey.status === "draft") return false;
  return isSurveyExpired(survey, now);
}

export function formatSurveyExpiry(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function toDatetimeLocalValue(iso: string | null) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function validateSubmission(input: {
  survey: Pick<Survey, "status" | "collect_identity" | "expires_at">;
  questions: SurveyQuestion[];
  name?: string;
  email?: string;
  phone?: string;
  answers?: Record<string, unknown>;
}):
  | { ok: true; name: string | null; email: string | null; phone: string; answers: Record<string, SurveyAnswerValue> }
  | { ok: false; error: string } {
  const phone = formatPhoneKenyaE164(input.phone || "");
  if (!isValidKenyaMobile(phone)) {
    return { ok: false, error: "Enter a valid Kenyan mobile number so we can text you the thank-you message." };
  }

  if (input.survey.status !== "open" || isSurveyExpired(input.survey)) {
    return {
      ok: false,
      error: isSurveyExpired(input.survey)
        ? "This survey has expired and is no longer accepting responses."
        : "This survey is not accepting responses.",
    };
  }

  let name: string | null = null;
  let email: string | null = null;
  if (input.survey.collect_identity) {
    name = (input.name || "").trim();
    email = (input.email || "").trim().toLowerCase();
    if (!name || !email) return { ok: false, error: "Name and email are required." };
    if (name.length > 120) return { ok: false, error: "Name is too long." };
    if (!EMAIL_RE.test(email) || email.length > 200) {
      return { ok: false, error: "Enter a valid email address." };
    }
  }

  const answers: Record<string, SurveyAnswerValue> = {};
  for (const question of input.questions) {
    const parsed = parseAnswer(question, input.answers?.[question.id]);
    if (!parsed.ok) return parsed;
    if (parsed.value == null) {
      if (question.required) return { ok: false, error: `Please answer: ${question.prompt}` };
      continue;
    }
    answers[question.id] = parsed.value;
  }

  return { ok: true, name, email, phone, answers };
}

export function responsesIncludeIdentity(responses: SurveyResponse[]) {
  return responses.some((response) => response.respondent_name || response.respondent_email);
}
