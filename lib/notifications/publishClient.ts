import type { SignalKind } from "@/lib/notifications/signals";

export function publishContentSignal(input: {
  kind: SignalKind;
  title: string;
  summary?: string | null;
  path: string;
}) {
  return fetch("/api/notifications/publish", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  }).catch(() => undefined);
}
