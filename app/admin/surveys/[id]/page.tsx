"use client";

import { useParams } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import SurveyEditor from "@/components/admin/surveys/SurveyEditor";

export default function EditSurveyPage() {
  const params = useParams();
  const id = String(params.id || "");
  return (
    <AdminShell title="Inuka Survey" subtitle="Update the form, then share it or review the results">
      <SurveyEditor surveyId={id} />
    </AdminShell>
  );
}
