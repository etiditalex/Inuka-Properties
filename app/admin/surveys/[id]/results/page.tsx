"use client";

import { useParams } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import SurveyResults from "@/components/admin/surveys/SurveyResults";

export default function SurveyResultsPage() {
  const params = useParams();
  const id = String(params.id || "");
  return (
    <AdminShell title="Inuka Survey" subtitle="Charts, downloads, and email for this form">
      <SurveyResults surveyId={id} />
    </AdminShell>
  );
}
