"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink, Mail } from "lucide-react";
import AdminButton from "@/components/admin/AdminButton";
import type { SurveyStatus } from "@/lib/supabase/types";

export function surveyPublicUrl(slug: string) {
  if (typeof window === "undefined") return `/survey/${slug}`;
  return `${window.location.origin}/survey/${slug}`;
}

export default function SurveyShareBar({
  slug,
  title,
  status,
}: {
  slug: string;
  title: string;
  status: SurveyStatus;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(surveyPublicUrl(slug));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const shareByEmail = () => {
    const url = surveyPublicUrl(slug);
    const subject = encodeURIComponent(title);
    const body = encodeURIComponent(`Please fill in this Inuka Survey:\n\n${title}\n${url}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <AdminButton variant="outline" size="sm" onClick={copy}>
        {copied ? <Check size={14} /> : <Copy size={14} />}
        {copied ? "Link copied" : "Copy link"}
      </AdminButton>
      <AdminButton variant="outline" size="sm" onClick={shareByEmail}>
        <Mail size={14} /> Share form
      </AdminButton>
      <AdminButton
        variant="ghost"
        size="sm"
        onClick={() => {
          const path = status === "draft" ? `/survey/${slug}?preview=1` : `/survey/${slug}`;
          window.open(path, "_blank", "noopener,noreferrer");
        }}
      >
        <ExternalLink size={14} />
        {status === "open" ? "Open form" : status === "draft" ? "Preview" : "View closed form"}
      </AdminButton>
    </div>
  );
}
