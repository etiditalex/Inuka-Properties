"use client";

import { useMemo, useState } from "react";
import { Facebook, Instagram, Linkedin, Share2 } from "lucide-react";
import { SITE_ORIGIN } from "@/lib/site";
import { propertyDetailPath } from "@/lib/propertySeo";

type Platform = "facebook" | "instagram" | "tiktok" | "x" | "linkedin";

function shareText(title: string, location?: string) {
  const place = location?.trim();
  return place
    ? `${title} — ${place} | Inuka Afrika Properties`
    : `${title} | Inuka Afrika Properties`;
}

function openShareWindow(url: string) {
  window.open(url, "iapl-share", "noopener,noreferrer,width=640,height=640");
}

async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}

function XIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function TikTokIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

const PLATFORMS: {
  id: Platform;
  label: string;
  className: string;
  icon: (size: number) => JSX.Element;
}[] = [
  {
    id: "facebook",
    label: "Facebook",
    className: "bg-[#1877F2] text-white hover:opacity-90",
    icon: (size) => <Facebook size={size} />,
  },
  {
    id: "instagram",
    label: "Instagram",
    className: "bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white hover:opacity-90",
    icon: (size) => <Instagram size={size} />,
  },
  {
    id: "tiktok",
    label: "TikTok",
    className: "bg-neutral-900 text-white hover:opacity-90",
    icon: (size) => <TikTokIcon size={size} />,
  },
  {
    id: "x",
    label: "X",
    className: "bg-neutral-900 text-white hover:opacity-90",
    icon: (size) => <XIcon size={size} />,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    className: "bg-[#0A66C2] text-white hover:opacity-90",
    icon: (size) => <Linkedin size={size} />,
  },
];

export default function PropertyShareButtons({
  propertyId,
  title,
  location,
}: {
  propertyId: number;
  title: string;
  location?: string;
}) {
  const [status, setStatus] = useState<string | null>(null);
  const url = useMemo(() => `${SITE_ORIGIN.replace(/\/$/, "")}${propertyDetailPath(propertyId)}`, [propertyId]);
  const text = useMemo(() => shareText(title, location), [title, location]);
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);

  const showStatus = (message: string) => {
    setStatus(message);
    window.setTimeout(() => setStatus(null), 3200);
  };

  const share = async (platform: Platform) => {
    if (platform === "facebook") {
      openShareWindow(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`);
      return;
    }
    if (platform === "x") {
      openShareWindow(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`);
      return;
    }
    if (platform === "linkedin") {
      openShareWindow(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`);
      return;
    }

    const copied = await copyText(`${text}\n${url}`);
    const canNativeShare = typeof navigator.share === "function";

    if (canNativeShare) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (error) {
        if ((error as DOMException)?.name === "AbortError") return;
      }
    }

    if (platform === "instagram") {
      window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
      showStatus(copied ? "Link copied — paste it in Instagram." : "Open Instagram and paste this listing link.");
      return;
    }

    window.open("https://www.tiktok.com/", "_blank", "noopener,noreferrer");
    showStatus(copied ? "Link copied — paste it in TikTok." : "Open TikTok and paste this listing link.");
  };

  return (
    <div className="mb-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-dark-500 font-montserrat">
          <Share2 size={14} aria-hidden="true" />
          Share
        </span>
        {PLATFORMS.map((platform) => (
          <button
            key={platform.id}
            type="button"
            onClick={() => void share(platform.id)}
            aria-label={`Share this property on ${platform.label}`}
            title={`Share on ${platform.label}`}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full shadow-sm transition ${platform.className}`}
          >
            {platform.icon(16)}
          </button>
        ))}
      </div>
      {status && (
        <p className="mt-2 text-xs text-dark-600 font-montserrat" role="status">
          {status}
        </p>
      )}
    </div>
  );
}
