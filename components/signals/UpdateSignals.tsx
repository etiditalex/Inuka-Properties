"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { getVisitorId } from "@/lib/properties/engagementClient";
import type { ContentSignal } from "@/lib/notifications/signals";

const CHOICE_KEY = "iapl-update-signals";
const SEEN_KEY = "iapl-update-signals-seen";

type Choice = "allowed" | "disallowed";

function readChoice(): Choice | null {
  try {
    const value = localStorage.getItem(CHOICE_KEY);
    return value === "allowed" || value === "disallowed" ? value : null;
  } catch {
    return null;
  }
}

function urlBase64ToUint8Array(value: string) {
  const padding = "=".repeat((4 - (value.length % 4)) % 4);
  const base64 = (value + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);
  return Uint8Array.from(raw, (char) => char.charCodeAt(0));
}

async function registerPush(visitorId: string) {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;
  const registration = await navigator.serviceWorker.register("/sw.js");
  const config = await fetch("/api/notifications/vapid").then((response) => response.json());
  if (!config.publicKey) {
    await fetch("/api/notifications/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorId, enabled: true }),
    });
    return;
  }

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(config.publicKey),
  });
  const json = subscription.toJSON();
  await fetch("/api/notifications/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ visitorId, enabled: true, subscription: json }),
  });
}

export default function UpdateSignals() {
  const router = useRouter();
  const [choice, setChoice] = useState<Choice | null>(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [signals, setSignals] = useState<ContentSignal[]>([]);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    setChoice(readChoice());
    setReady(true);
  }, []);

  useEffect(() => {
    if (choice !== "allowed") return;

    let cancelled = false;

    const check = async () => {
      const response = await fetch("/api/notifications/feed", { cache: "no-store" });
      const data = await response.json();
      const next = (data.signals || []) as ContentSignal[];
      if (cancelled) return;
      setSignals(next);

      const seen = localStorage.getItem(SEEN_KEY) || new Date().toISOString();
      const fresh = next.filter((signal) => new Date(signal.updatedAt).getTime() > new Date(seen).getTime());
      setUnread(fresh.length);
      if (!fresh.length || typeof Notification === "undefined" || Notification.permission !== "granted") return;

      const newest = fresh[0];
      const notice = new Notification(newest.title, { body: newest.summary || "There is an update on the website." });
      notice.onclick = () => {
        window.focus();
        router.push(newest.path);
      };
      localStorage.setItem(SEEN_KEY, newest.updatedAt);
      setUnread(0);
    };

    check().catch(() => undefined);
    const timer = window.setInterval(() => {
      check().catch(() => undefined);
    }, 45000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [choice, router]);

  const allow = async () => {
    localStorage.setItem(CHOICE_KEY, "allowed");
    if (!localStorage.getItem(SEEN_KEY)) localStorage.setItem(SEEN_KEY, new Date().toISOString());
    setChoice("allowed");
    setOpen(false);
    if ("Notification" in window) await Notification.requestPermission();
    await registerPush(getVisitorId()).catch(() => undefined);
  };

  const disallow = async () => {
    localStorage.setItem(CHOICE_KEY, "disallowed");
    setChoice("disallowed");
    setOpen(false);
    setUnread(0);
    await fetch("/api/notifications/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorId: getVisitorId(), enabled: false }),
    }).catch(() => undefined);
  };

  if (!ready) return null;

  return (
    <div className="fixed bottom-24 left-4 z-40 w-[min(22rem,calc(100vw-2rem))] font-montserrat">
      {choice === null ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary-700">Signals</p>
          <p className="mt-2 text-sm leading-relaxed text-neutral-800">
            Allow updates when a property, blog, or market research article changes. You can turn this off at any time.
          </p>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={allow}
              className="rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
            >
              Allow
            </button>
            <button
              type="button"
              onClick={disallow}
              className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
            >
              Disallow
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-start gap-2">
          {open ? (
            <div className="w-full rounded-2xl border border-neutral-200 bg-white p-4 shadow-xl">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-neutral-900">Update signals</p>
                <button
                  type="button"
                  onClick={choice === "allowed" ? disallow : allow}
                  className="text-xs font-semibold text-primary-700 hover:text-primary-800"
                >
                  {choice === "allowed" ? "Disallow" : "Allow"}
                </button>
              </div>
              {choice === "disallowed" ? (
                <p className="mt-3 text-sm text-neutral-600">Updates are off. Allow them if you want to hear about new plots and articles.</p>
              ) : signals.length === 0 ? (
                <p className="mt-3 text-sm text-neutral-600">You will be notified when a published listing or article changes.</p>
              ) : (
                <ul className="mt-3 max-h-64 space-y-2 overflow-auto">
                  {signals.slice(0, 6).map((signal) => (
                    <li key={signal.id}>
                      <button
                        type="button"
                        onClick={() => router.push(signal.path)}
                        className="w-full rounded-xl px-2 py-2 text-left hover:bg-neutral-50"
                      >
                        <span className="block text-xs font-semibold uppercase tracking-wide text-primary-700">
                          {signal.kind === "market-research" ? "Market research" : signal.kind === "property" ? "Property" : "Blog"}
                        </span>
                        <span className="mt-1 block text-sm font-medium text-neutral-900">{signal.title}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : null}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex items-center gap-2 rounded-full bg-primary-700 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-primary-800"
          >
            <Bell size={16} />
            Signals
            {unread > 0 ? (
              <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-primary-700">{unread}</span>
            ) : null}
          </button>
        </div>
      )}
    </div>
  );
}
