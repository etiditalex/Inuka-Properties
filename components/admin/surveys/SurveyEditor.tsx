"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, BarChart3, Plus, Trash2 } from "lucide-react";
import AdminButton from "@/components/admin/AdminButton";
import { AdminInput, AdminSelect, AdminTextarea, AdminToggle } from "@/components/admin/AdminForm";
import SurveyShareBar from "@/components/admin/surveys/SurveyShareBar";
import { adminPath } from "@/lib/admin/path";
import { slugify } from "@/lib/admin/utils";
import { createClient } from "@/lib/supabase/client";
import type { Survey, SurveyQuestionType, SurveyStatus } from "@/lib/supabase/types";
import { QUESTION_TYPE_OPTIONS, SURVEY_STATUS_OPTIONS, normalizeOptions, normalizeQuestion, toDatetimeLocalValue } from "@/lib/surveys/model";

type DraftQuestion = {
  id: string;
  prompt: string;
  help_text: string;
  question_type: SurveyQuestionType;
  options: string[];
  required: boolean;
};

function blankQuestion(): DraftQuestion {
  return {
    id: crypto.randomUUID(),
    prompt: "",
    help_text: "",
    question_type: "short_text",
    options: ["", ""],
    required: false,
  };
}

function validateDraft(title: string, questions: DraftQuestion[]) {
  if (!title.trim()) return "Add a title for the survey.";
  if (!questions.length) return "Add at least one question.";
  for (const [index, question] of questions.entries()) {
    if (!question.prompt.trim()) return `Question ${index + 1} needs a question.`;
    if (question.question_type === "single_choice" || question.question_type === "multiple_choice") {
      const options = question.options.map((option) => option.trim()).filter(Boolean);
      if (options.length < 2) return `Question ${index + 1} needs at least two options.`;
      const unique = new Set(options.map((option) => option.toLowerCase()));
      if (unique.size !== options.length) return `Question ${index + 1} has duplicate options.`;
    }
  }
  return "";
}

export default function SurveyEditor({ surveyId }: { surveyId?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(Boolean(surveyId));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [missingTable, setMissingTable] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [collectIdentity, setCollectIdentity] = useState(true);
  const [status, setStatus] = useState<SurveyStatus>("draft");
  const [expiresAt, setExpiresAt] = useState("");
  const [thankYou, setThankYou] = useState("Thank you. Your response has been recorded.");
  const [questions, setQuestions] = useState<DraftQuestion[]>([blankQuestion()]);
  const [savedSlug, setSavedSlug] = useState("");
  const [persistedId, setPersistedId] = useState(surveyId);

  useEffect(() => {
    if (!surveyId) return;
    const supabase = createClient();
    supabase
      .from("surveys")
      .select("*")
      .eq("id", surveyId)
      .single()
      .then(async ({ data, error: surveyError }) => {
        if (surveyError || !data) {
          setError(surveyError?.message || "Survey not found.");
          setMissingTable(Boolean(surveyError?.message?.toLowerCase().includes("surveys")));
          setLoading(false);
          return;
        }
        const survey = data as Survey;
        const { data: questionRows, error: questionError } = await supabase
          .from("survey_questions")
          .select("*")
          .eq("survey_id", surveyId)
          .order("sort_order", { ascending: true });
        if (questionError) {
          setError(questionError.message);
          setLoading(false);
          return;
        }
        setTitle(survey.title);
        setDescription(survey.description || "");
        setSlug(survey.slug);
        setSavedSlug(survey.slug);
        setSlugTouched(true);
        setCollectIdentity(survey.collect_identity);
        setStatus(survey.status);
        setExpiresAt(toDatetimeLocalValue(survey.expires_at));
        setThankYou(survey.thank_you_message);
        const loaded = ((questionRows || []) as Parameters<typeof normalizeQuestion>[0][]).map(normalizeQuestion);
        setQuestions(
          loaded.length
            ? loaded.map((question) => ({
                id: question.id,
                prompt: question.prompt,
                help_text: question.help_text || "",
                question_type: question.question_type,
                options: normalizeOptions(question.options).length ? normalizeOptions(question.options) : ["", ""],
                required: question.required,
              }))
            : [blankQuestion()]
        );
        setLoading(false);
      });
  }, [surveyId]);

  const updateQuestion = (id: string, patch: Partial<DraftQuestion>) => {
    setQuestions((current) => current.map((question) => (question.id === id ? { ...question, ...patch } : question)));
  };

  const moveQuestion = (index: number, direction: -1 | 1) => {
    const next = index + direction;
    if (next < 0 || next >= questions.length) return;
    setQuestions((current) => {
      const copy = [...current];
      const [item] = copy.splice(index, 1);
      copy.splice(next, 0, item);
      return copy;
    });
  };

  const handleTitle = (value: string) => {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value) || "survey");
  };

  const handleSave = async () => {
    const validation = validateDraft(title, questions);
    const expiryTime = expiresAt ? new Date(expiresAt).getTime() : NaN;
    const expiryError = !expiresAt
      ? "Set an expiry date and time for this survey."
      : Number.isNaN(expiryTime)
        ? "Enter a valid expiry date."
        : status === "open" && expiryTime <= Date.now()
          ? "The expiry date must be in the future before the survey can open."
          : "";
    if (validation || expiryError) {
      setError(validation || expiryError);
      setMessage("");
      return;
    }
    const nextSlug = slugify(slug) || slugify(title) || "survey";
    setSaving(true);
    setError("");
    setMessage("");
    const supabase = createClient();
    const payload = {
      title: title.trim(),
      description: description.trim() || null,
      slug: nextSlug,
      collect_identity: collectIdentity,
      status,
      expires_at: new Date(expiresAt).toISOString(),
      thank_you_message: thankYou.trim() || "Thank you. Your response has been recorded.",
    };

    let id = persistedId;
    let finalSlug = nextSlug;
    if (!id) {
      let insertSlug = nextSlug;
      let inserted: Survey | null = null;
      let insertError: { message: string; code?: string } | null = null;
      for (let attempt = 0; attempt < 3 && !inserted; attempt++) {
        const result = await supabase.from("surveys").insert({ ...payload, slug: insertSlug }).select("*").single();
        if (!result.error && result.data) {
          inserted = result.data as Survey;
          break;
        }
        insertError = result.error;
        if (result.error?.code === "23505") {
          insertSlug = `${nextSlug}-${Math.random().toString(36).slice(2, 6)}`;
          continue;
        }
        break;
      }
      if (!inserted) {
        setSaving(false);
        setError(insertError?.message || "Could not create the survey.");
        setMissingTable(Boolean(insertError?.message?.toLowerCase().includes("surveys")));
        return;
      }
      id = inserted.id;
      finalSlug = inserted.slug;
      setPersistedId(id);
      setSlug(inserted.slug);
    } else {
      const { error: updateError } = await supabase.from("surveys").update(payload).eq("id", id);
      if (updateError) {
        setSaving(false);
        setError(updateError.message);
        return;
      }
    }

    const rows = questions.map((question, index) => ({
      id: question.id,
      survey_id: id,
      prompt: question.prompt.trim(),
      help_text: question.help_text.trim() || null,
      question_type: question.question_type,
      options:
        question.question_type === "single_choice" || question.question_type === "multiple_choice"
          ? question.options.map((option) => option.trim()).filter(Boolean)
          : [],
      required: question.required,
      sort_order: index,
    }));

    const keep = new Set(rows.map((row) => row.id));
    const { data: existingRows, error: existingError } = await supabase
      .from("survey_questions")
      .select("id")
      .eq("survey_id", id);
    if (existingError) {
      setSaving(false);
      setError(existingError.message);
      return;
    }
    const remove = (existingRows || []).map((row) => row.id as string).filter((rowId) => !keep.has(rowId));
    if (remove.length) {
      const { error: deleteError } = await supabase.from("survey_questions").delete().in("id", remove);
      if (deleteError) {
        setSaving(false);
        setError(deleteError.message);
        return;
      }
    }

    const { error: upsertError } = await supabase.from("survey_questions").upsert(rows);
    setSaving(false);
    if (upsertError) {
      setError(upsertError.message);
      return;
    }

    setSavedSlug(finalSlug);
    if (status === "open" && expiryTime > Date.now()) {
      await supabase
        .from("survey_report_recipients")
        .update({ final_sent_at: null, updated_at: new Date().toISOString() })
        .eq("survey_id", id);
    }
    let savedMessage = "Survey saved.";
    if (status === "closed" || expiryTime <= Date.now()) {
      const report = await fetch(`/api/admin/surveys/${id}/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ finalize: true }),
      });
      const reportData = await report.json().catch(() => ({}));
      if (report.ok && reportData.sent > 0 && reportData.message) {
        savedMessage = `Survey saved. ${reportData.message}`;
      }
    }
    setMessage(savedMessage);
    if (!surveyId) router.replace(adminPath(`surveys/${id}`));
  };

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href={adminPath("surveys")} className="text-sm font-medium text-primary-700 hover:underline">
          Back to surveys
        </Link>
        {surveyId ? (
          <Link href={adminPath(`surveys/${surveyId}/results`)}>
            <AdminButton variant="outline" size="sm">
              <BarChart3 size={14} /> View results
            </AdminButton>
          </Link>
        ) : null}
      </div>

      {missingTable ? (
        <div className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
          The survey tables are not in the database yet. Run <span className="font-semibold">supabase/migrations/inuka_surveys.sql</span> in the Supabase SQL editor, then reload this page.
        </div>
      ) : null}
      {error ? <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
      {message ? <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div> : null}

      <section className="space-y-4 rounded-2xl border border-dark-200/60 bg-white p-5 shadow-sm">
        <AdminInput label="Survey title" value={title} onChange={(event) => handleTitle(event.target.value)} placeholder="Buyer interest survey" />
        <AdminTextarea
          label="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={3}
          placeholder="Tell people what this survey is for"
        />
        <div className="grid gap-4 md:grid-cols-2">
          <AdminInput
            label="Link name"
            value={slug}
            hint={slugTouched && savedSlug && slugify(slug) !== savedSlug ? "Changing this breaks any link you already shared." : "Used in the public link."}
            onChange={(event) => {
              setSlugTouched(true);
              setSlug(event.target.value);
            }}
            onBlur={() => setSlug(slugify(slug) || "survey")}
          />
          <AdminSelect
            label="Status"
            value={status}
            options={SURVEY_STATUS_OPTIONS}
            onChange={(event) => setStatus(event.target.value as SurveyStatus)}
          />
        </div>
        <AdminInput
          label="Expiry date"
          type="datetime-local"
          value={expiresAt}
          onChange={(event) => setExpiresAt(event.target.value)}
          hint="Responses stop at this date and time. Required before the survey can be saved."
        />
        <AdminTextarea
          label="Thank-you message"
          value={thankYou}
          onChange={(event) => setThankYou(event.target.value)}
          rows={2}
        />
        <AdminToggle
          label={collectIdentity ? "Collect names and emails" : "Anonymous responses"}
          description={
            collectIdentity
              ? "Each response asks for a name and email address."
              : "New responses will not store a name or email. Earlier responses keep whatever was already collected."
          }
          checked={collectIdentity}
          onChange={setCollectIdentity}
        />
        {savedSlug ? (
          <div className="rounded-xl bg-dark-50 p-4">
            <p className="mb-2 text-sm font-medium text-dark-800">Share this form</p>
            {status !== "open" ? (
              <p className="mb-3 text-xs text-dark-500">
                {status === "draft"
                  ? "Set the status to Open before sending the link. Preview is available while it is a draft."
                  : "This survey is closed. The link tells people responses are no longer accepted."}
              </p>
            ) : null}
            <SurveyShareBar slug={savedSlug} title={title || "Inuka Survey"} status={status} />
          </div>
        ) : null}
      </section>

      <div className="space-y-4">
        {questions.map((question, index) => {
          const choice = question.question_type === "single_choice" || question.question_type === "multiple_choice";
          return (
            <section key={question.id} className="rounded-2xl border border-dark-200/60 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-dark-400">Question {index + 1}</p>
                <div className="flex gap-1">
                  <AdminButton variant="ghost" size="sm" aria-label="Move question up" onClick={() => moveQuestion(index, -1)} disabled={index === 0}>
                    <ArrowUp size={14} />
                  </AdminButton>
                  <AdminButton variant="ghost" size="sm" aria-label="Move question down" onClick={() => moveQuestion(index, 1)} disabled={index === questions.length - 1}>
                    <ArrowDown size={14} />
                  </AdminButton>
                  <AdminButton
                    variant="ghost"
                    size="sm"
                    aria-label="Remove question"
                    onClick={() => {
                      if (questions.length === 1) return;
                      if (!confirm("Remove this question?")) return;
                      setQuestions((current) => current.filter((item) => item.id !== question.id));
                    }}
                  >
                    <Trash2 size={14} className="text-red-500" />
                  </AdminButton>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-[1fr_220px]">
                <AdminInput
                  label="Question"
                  value={question.prompt}
                  onChange={(event) => updateQuestion(question.id, { prompt: event.target.value })}
                  placeholder="What would you like to ask?"
                />
                <AdminSelect
                  label="Answer type"
                  value={question.question_type}
                  options={QUESTION_TYPE_OPTIONS}
                  onChange={(event) => updateQuestion(question.id, { question_type: event.target.value as SurveyQuestionType })}
                />
              </div>
              <div className="mt-4">
                <AdminInput
                  label="Help text"
                  value={question.help_text}
                  onChange={(event) => updateQuestion(question.id, { help_text: event.target.value })}
                  placeholder="Optional note under the question"
                />
              </div>
              {choice ? (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-dark-700">Options</p>
                  {question.options.map((option, optionIndex) => (
                    <div key={`${question.id}-${optionIndex}`} className="flex gap-2">
                      <input
                        value={option}
                        onChange={(event) => {
                          const options = [...question.options];
                          options[optionIndex] = event.target.value;
                          updateQuestion(question.id, { options });
                        }}
                        placeholder={`Option ${optionIndex + 1}`}
                        className="w-full rounded-xl border border-dark-200 bg-white px-4 py-2.5 text-sm text-dark-900 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                      />
                      <AdminButton
                        variant="ghost"
                        size="sm"
                        disabled={question.options.length <= 2}
                        onClick={() =>
                          updateQuestion(question.id, {
                            options: question.options.filter((_, current) => current !== optionIndex),
                          })
                        }
                      >
                        <Trash2 size={14} />
                      </AdminButton>
                    </div>
                  ))}
                  <AdminButton
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuestion(question.id, { options: [...question.options, ""] })}
                  >
                    <Plus size={14} /> Add option
                  </AdminButton>
                </div>
              ) : null}
              {question.question_type === "rating" ? (
                <p className="mt-3 text-xs text-dark-400">Respondents pick a score from 1 to 5.</p>
              ) : null}
              {question.question_type === "yes_no" ? (
                <p className="mt-3 text-xs text-dark-400">Respondents choose Yes or No.</p>
              ) : null}
              <div className="mt-4">
                <AdminToggle
                  label="Required"
                  checked={question.required}
                  onChange={(checked) => updateQuestion(question.id, { required: checked })}
                />
              </div>
            </section>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <AdminButton
          variant="secondary"
          onClick={() => setQuestions((current) => [...current, blankQuestion()])}
        >
          <Plus size={16} /> Add question
        </AdminButton>
        <AdminButton onClick={handleSave} loading={saving}>
          Save survey
        </AdminButton>
      </div>
    </div>
  );
}
