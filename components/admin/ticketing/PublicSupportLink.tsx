"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";
import Link from "next/link";
import { getPublicSupportUrl } from "@/lib/ticketing/public-form";

export default function PublicSupportLink() {
  const [copied, setCopied] = useState(false);
  const url = getPublicSupportUrl();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* fallback */
    }
  };

  return (
    <div className="rounded-xl border border-primary-200 bg-gradient-to-br from-primary-50 to-white p-4 md:col-span-2">
      <h3 className="mb-1 flex items-center gap-2 text-sm font-bold text-slate-800">
        <ExternalLink className="h-4 w-4 text-primary-600" />
        Public support form
      </h3>
      <p className="mb-3 text-xs text-slate-600">
        Share this link with clients. Each submission is saved in Supabase{" "}
        <code className="text-[10px]">tickets</code> (source: <code className="text-[10px]">contact_form</code>)
        and appears in IAPL Ticketing instantly.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <code className="flex-1 truncate rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium text-slate-800">
          {url}
        </code>
        <button
          type="button"
          onClick={copy}
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-primary-700"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied!" : "Copy link"}
        </button>
        <Link
          href="/support"
          target="_blank"
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Preview <ExternalLink className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
