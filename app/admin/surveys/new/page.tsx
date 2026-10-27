"use client";

import AdminShell from "@/components/admin/AdminShell";
import SurveyEditor from "@/components/admin/surveys/SurveyEditor";

export default function NewSurveyPage() {
  return (
    <AdminShell title="Inuka Survey" subtitle="Build a form, then share the link for people to fill in">
      <SurveyEditor />
    </AdminShell>
  );
}
