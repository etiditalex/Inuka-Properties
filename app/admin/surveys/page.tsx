"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BarChart3, ClipboardList, Pencil, Plus, Trash2 } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import AdminButton from "@/components/admin/AdminButton";
import SurveyShareBar from "@/components/admin/surveys/SurveyShareBar";
import { adminPath } from "@/lib/admin/path";
import { cn, formatAdminDate } from "@/lib/admin/utils";
import { createClient } from "@/lib/supabase/client";
import type { Survey, SurveyStatus } from "@/lib/supabase/types";

type SurveyRow = Survey & { response_count: number };

const statusStyles: Record<SurveyStatus, string> = {
  draft: "bg-dark-100 text-dark-600",
  open: "bg-emerald-50 text-emerald-700",
  closed: "bg-amber-50 text-amber-800",
};

function responseCount(row: Survey & { survey_responses?: { count: number }[] | { count: number } }) {
  const value = row.survey_responses;
  if (Array.isArray(value)) return value[0]?.count || 0;
  if (value && typeof value.count === "number") return value.count;
  return 0;
}

export default function AdminSurveysPage() {
  const [surveys, setSurveys] = useState<SurveyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [missingTable, setMissingTable] = useState(false);

  const load = async () => {
    const supabase = createClient();
    const { data, error: loadError } = await supabase
      .from("surveys")
      .select("*, survey_responses(count)")
      .order("updated_at", { ascending: false });
    if (loadError) {
      setError(loadError.message);
      setMissingTable(loadError.message.toLowerCase().includes("survey"));
      setSurveys([]);
      setLoading(false);
      return;
    }
    setError("");
    setMissingTable(false);
    setSurveys(
      ((data || []) as (Survey & { survey_responses?: { count: number }[] | { count: number } })[]).map((row) => ({
        ...row,
        response_count: responseCount(row),
      }))
    );
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (survey: SurveyRow) => {
    if (!confirm(`Delete “${survey.title}” and all of its responses?`)) return;
    const supabase = createClient();
    const { error: deleteError } = await supabase.from("surveys").delete().eq("id", survey.id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    load();
  };

  return (
    <AdminShell
      title="Inuka Survey"
      subtitle="Create a form, share it, and review responses with charts"
    >
      <div className="mb-6 flex justify-end">
        <Link href={adminPath("surveys/new")}>
          <AdminButton>
            <Plus size={16} /> New survey
          </AdminButton>
        </Link>
      </div>

      {missingTable ? (
        <div className="mb-6 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
          The survey tables are not in the database yet. Run <span className="font-semibold">supabase/migrations/inuka_surveys.sql</span> in the Supabase SQL editor, then reload this page.
        </div>
      ) : null}
      {error && !missingTable ? (
        <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
        </div>
      ) : surveys.length === 0 && !missingTable ? (
        <div className="rounded-2xl border border-dashed border-dark-200 bg-white px-6 py-16 text-center">
          <ClipboardList className="mx-auto text-primary-600" size={28} />
          <h2 className="mt-3 font-montserrat text-lg font-bold text-dark-900">No surveys yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-dark-500">
            Build a form, choose whether to collect names and emails or keep it anonymous, then share the link.
          </p>
          <Link href={adminPath("surveys/new")} className="mt-5 inline-block">
            <AdminButton>
              <Plus size={16} /> Create a survey
            </AdminButton>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {surveys.map((survey) => (
            <article key={survey.id} className="rounded-2xl border border-dark-200/60 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-montserrat text-lg font-bold text-dark-900">{survey.title}</h2>
                    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize", statusStyles[survey.status])}>
                      {survey.status}
                    </span>
                    <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary-800">
                      {survey.collect_identity ? "Names and emails" : "Anonymous"}
                    </span>
                  </div>
                  {survey.description ? <p className="mt-2 line-clamp-2 text-sm text-dark-500">{survey.description}</p> : null}
                  <p className="mt-2 text-xs text-dark-400">
                    {survey.response_count} response{survey.response_count === 1 ? "" : "s"} · Updated {formatAdminDate(survey.updated_at)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link href={adminPath(`surveys/${survey.id}`)}>
                    <AdminButton variant="outline" size="sm">
                      <Pencil size={14} /> Edit
                    </AdminButton>
                  </Link>
                  <Link href={adminPath(`surveys/${survey.id}/results`)}>
                    <AdminButton variant="secondary" size="sm">
                      <BarChart3 size={14} /> Results
                    </AdminButton>
                  </Link>
                  <AdminButton variant="ghost" size="sm" onClick={() => handleDelete(survey)}>
                    <Trash2 size={14} className="text-red-500" />
                  </AdminButton>
                </div>
              </div>
              <div className="mt-4">
                <SurveyShareBar slug={survey.slug} title={survey.title} status={survey.status} />
              </div>
            </article>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
