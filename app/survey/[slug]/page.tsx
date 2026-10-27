import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PublicSurveyForm from "@/components/survey/PublicSurveyForm";
import { isSupabaseServerConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { Survey, SurveyQuestion } from "@/lib/supabase/types";
import { isSurveyExpired, normalizeQuestion } from "@/lib/surveys/model";

export const dynamic = "force-dynamic";

type LoadResult =
  | { error: "unavailable" }
  | { error: "missing" }
  | { survey: Survey; questions: SurveyQuestion[] };

async function loadSurvey(slug: string): Promise<LoadResult> {
  if (!isSupabaseServerConfigured()) return { error: "unavailable" };
  const supabase = await createClient();
  const { data, error } = await supabase.from("surveys").select("*").eq("slug", slug).maybeSingle();
  if (error) return { error: "unavailable" };
  if (!data) return { error: "missing" };
  const { data: questions, error: questionError } = await supabase
    .from("survey_questions")
    .select("*")
    .eq("survey_id", data.id)
    .order("sort_order", { ascending: true });
  if (questionError) return { error: "unavailable" };
  return {
    survey: data as Survey,
    questions: ((questions || []) as SurveyQuestion[]).map(normalizeQuestion),
  };
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const loaded = await loadSurvey(params.slug);
  return {
    title: "survey" in loaded ? loaded.survey.title : "Survey",
    robots: { index: false, follow: false },
  };
}

function Unavailable() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <h1 className="font-montserrat text-2xl font-bold text-slate-900">Survey unavailable</h1>
      <p className="mt-2 text-slate-600">This form cannot be opened right now. Please try again later.</p>
    </div>
  );
}

export default async function PublicSurveyPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { preview?: string };
}) {
  const loaded = await loadSurvey(params.slug);
  if ("error" in loaded) {
    if (loaded.error === "missing") notFound();
    return <Unavailable />;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const preview = searchParams.preview === "1" && Boolean(user);
  if (loaded.survey.status === "draft" && !preview) notFound();

  const mode =
    loaded.survey.status === "draft"
      ? "preview"
      : loaded.survey.status === "closed"
        ? "closed"
        : isSurveyExpired(loaded.survey)
          ? "expired"
          : "open";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-primary-50/40 px-4 py-12 md:py-16">
      <div className="mx-auto max-w-3xl">
        <PublicSurveyForm survey={loaded.survey} questions={loaded.questions} mode={mode} />
      </div>
    </div>
  );
}
