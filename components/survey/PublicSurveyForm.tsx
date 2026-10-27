"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import type { Survey, SurveyAnswerValue, SurveyQuestion } from "@/lib/supabase/types";
import { normalizeKenyaPhoneInput } from "@/lib/phone/kenya";
import { formatSurveyExpiry, isChoiceQuestion, validateSubmission } from "@/lib/surveys/model";
import { cn } from "@/lib/admin/utils";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100";

type PublicSurveyFormProps = {
  survey: Survey;
  questions: SurveyQuestion[];
  mode: "open" | "closed" | "preview" | "expired";
};

export default function PublicSurveyForm({ survey, questions, mode }: PublicSurveyFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [honey, setHoney] = useState("");
  const [answers, setAnswers] = useState<Record<string, SurveyAnswerValue>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [smsSent, setSmsSent] = useState<boolean | null>(null);
  const storageKey = `inuka-survey-done:${survey.id}`;

  useEffect(() => {
    try {
      if (window.localStorage.getItem(storageKey) === "1") setDone(true);
    } catch {
      // Private browsing can block storage. The server still rejects a repeat number.
    }
  }, [storageKey]);

  const setAnswer = (questionId: string, value: SurveyAnswerValue) => {
    setAnswers((current) => ({ ...current, [questionId]: value }));
    setError("");
  };

  const toggleOption = (questionId: string, option: string) => {
    const current = answers[questionId];
    const selected = Array.isArray(current) ? current : [];
    const next = selected.includes(option)
      ? selected.filter((item) => item !== option)
      : [...selected, option];
    setAnswer(questionId, next);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (mode !== "open") return;

    const validation = validateSubmission({
      survey,
      questions,
      name,
      email,
      phone,
      answers,
    });
    if (!validation.ok) {
      setError(validation.error);
      return;
    }

    setLoading(true);
    setError("");
    const response = await fetch(`/api/surveys/${survey.slug}/responses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        phone,
        answers,
        company_website: honey,
      }),
    });
    const data = await response.json().catch(() => ({}));
    setLoading(false);
    if (response.status === 409) {
      try {
        window.localStorage.setItem(storageKey, "1");
      } catch {
        // Ignore storage failures.
      }
      setDone(true);
      setSmsSent(null);
      return;
    }
    if (!response.ok) {
      setError(data.error || "Could not submit your response. Please try again.");
      return;
    }
    try {
      window.localStorage.setItem(storageKey, "1");
    } catch {
      // Ignore storage failures.
    }
    setSmsSent(Boolean(data.smsSent));
    setDone(true);
  };

  if (done) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-white p-8 text-center shadow-xl shadow-emerald-900/5 md:p-12">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
        </div>
        <h1 className="font-montserrat text-2xl font-bold text-slate-900">Response recorded</h1>
        <p className="mt-3 text-slate-600">{survey.thank_you_message}</p>
        {smsSent === true ? (
          <p className="mt-3 text-sm text-slate-500">A thank-you text has been sent to your number.</p>
        ) : null}
        {smsSent === false ? (
          <p className="mt-3 text-sm text-slate-500">Your response was saved. The text message could not be sent.</p>
        ) : null}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-slate-900/5"
    >
      <div className="border-b border-slate-100 bg-gradient-to-r from-primary-50 to-white px-6 py-6 md:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-700">Inuka Survey</p>
        <h1 className="mt-2 font-montserrat text-2xl font-bold leading-normal text-slate-900 md:text-3xl">{survey.title}</h1>
        {survey.description ? (
          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">{survey.description}</p>
        ) : null}
        {mode === "preview" ? (
          <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-800">
            Preview only. This survey is still a draft, so responses are not saved.
          </p>
        ) : null}
        {mode === "closed" ? (
          <p className="mt-4 rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-700">
            This survey is closed and is no longer accepting responses.
          </p>
        ) : null}
        {mode === "expired" ? (
          <p className="mt-4 rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-700">
            This survey expired{survey.expires_at ? ` on ${formatSurveyExpiry(survey.expires_at)}` : ""} and is no longer accepting responses.
          </p>
        ) : null}
        {mode === "open" && survey.expires_at ? (
          <p className="mt-4 text-sm text-slate-500">Closes {formatSurveyExpiry(survey.expires_at)}.</p>
        ) : null}
        {mode === "open" && !survey.collect_identity ? (
          <p className="mt-4 text-sm text-slate-500">
            Your name and email are not collected. Your mobile number is used only to send the thank-you text, and only once.
          </p>
        ) : null}
      </div>

      {mode === "open" || mode === "preview" ? (
        <div className="space-y-8 p-6 md:p-8">
          <div className="absolute -left-[9999px]" aria-hidden="true">
            <label>
              Company website
              <input
                tabIndex={-1}
                autoComplete="off"
                value={honey}
                onChange={(event) => setHoney(event.target.value)}
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {survey.collect_identity ? (
              <>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-slate-800">
                    Name <span className="text-red-500">*</span>
                  </span>
                  <input className={inputClass} value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-slate-800">
                    Email <span className="text-red-500">*</span>
                  </span>
                  <input
                    type="email"
                    className={inputClass}
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@email.com"
                  />
                </label>
              </>
            ) : null}
            <label className="block md:col-span-2">
              <span className="mb-1.5 block text-sm font-semibold text-slate-800">
                Mobile number <span className="text-red-500">*</span>
              </span>
              <input
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                className={inputClass}
                value={phone}
                onChange={(event) => setPhone(normalizeKenyaPhoneInput(event.target.value))}
                placeholder="0711 082084"
              />
              <span className="mt-1 block text-xs text-slate-500">
                We text the thank-you message to this number. Each number can respond once.
              </span>
            </label>
          </div>

          {questions.map((question, index) => {
            const selected = answers[question.id];
            return (
              <fieldset key={question.id} className="space-y-3">
                <legend className="text-base font-semibold text-slate-900">
                  <span className="mr-2 text-primary-700">{index + 1}.</span>
                  {question.prompt}
                  {question.required ? <span className="text-red-500"> *</span> : null}
                </legend>
                {question.help_text ? <p className="text-sm text-slate-500">{question.help_text}</p> : null}
                <QuestionField
                  question={question}
                  selected={selected}
                  onChange={(value) => setAnswer(question.id, value)}
                  onToggle={(option) => toggleOption(question.id, option)}
                />
              </fieldset>
            );
          })}

          {error ? <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

          {mode === "open" ? (
            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-5 py-3 font-montserrat text-sm font-semibold text-white transition hover:bg-primary-700 disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Submit
            </button>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}

function QuestionField({
  question,
  selected,
  onChange,
  onToggle,
}: {
  question: SurveyQuestion;
  selected: SurveyAnswerValue | undefined;
  onChange: (value: SurveyAnswerValue) => void;
  onToggle: (option: string) => void;
}) {
  if (question.question_type === "long_text") {
    return (
      <textarea
        rows={4}
        className={inputClass}
        value={typeof selected === "string" ? selected : ""}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  }

  if (question.question_type === "short_text") {
    return (
      <input
        className={inputClass}
        value={typeof selected === "string" ? selected : ""}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  }

  if (question.question_type === "rating") {
    const value = typeof selected === "string" ? selected : "";
    return (
      <div className="flex flex-wrap gap-2">
        {["1", "2", "3", "4", "5"].map((score) => (
          <button
            key={score}
            type="button"
            onClick={() => onChange(score)}
            className={cn(
              "h-11 w-11 rounded-xl border text-sm font-semibold transition",
              value === score
                ? "border-primary-600 bg-primary-600 text-white"
                : "border-slate-200 bg-white text-slate-700 hover:border-primary-300"
            )}
          >
            {score}
          </button>
        ))}
        <span className="self-center text-xs text-slate-400">1 = low, 5 = high</span>
      </div>
    );
  }

  if (question.question_type === "yes_no") {
    const value = typeof selected === "string" ? selected : "";
    return (
      <div className="flex gap-2">
        {["Yes", "No"].map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              "rounded-xl border px-5 py-2.5 text-sm font-semibold transition",
              value === option
                ? "border-primary-600 bg-primary-50 text-primary-800"
                : "border-slate-200 bg-white text-slate-700 hover:border-primary-300"
            )}
          >
            {option}
          </button>
        ))}
      </div>
    );
  }

  const options = (question.options || []).map((option) => option.trim()).filter(Boolean);
  if (question.question_type === "multiple_choice") {
    const chosen = Array.isArray(selected) ? selected : [];
    return (
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option} className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-3 py-2.5 hover:border-primary-300">
            <input
              type="checkbox"
              checked={chosen.includes(option)}
              onChange={() => onToggle(option)}
              className="h-4 w-4 accent-primary-600"
            />
            <span className="text-sm text-slate-800">{option}</span>
          </label>
        ))}
      </div>
    );
  }

  const value = typeof selected === "string" ? selected : "";
  return (
    <div className="space-y-2">
      {options.map((option) => (
        <label key={option} className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-3 py-2.5 hover:border-primary-300">
          <input
            type="radio"
            name={question.id}
            checked={value === option}
            onChange={() => onChange(option)}
            className="h-4 w-4 accent-primary-600"
          />
          <span className="text-sm text-slate-800">{option}</span>
        </label>
      ))}
      {isChoiceQuestion(question.question_type) && options.length === 0 ? (
        <p className="text-sm text-slate-400">No options have been added for this question.</p>
      ) : null}
    </div>
  );
}
