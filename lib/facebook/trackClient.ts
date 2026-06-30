import type { FacebookEventName, FacebookPixelEventPayload } from "./pixel";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

type TrackOptions = {
  /** Skip fbq call when the pixel script already fired this event (e.g. PageView on init). */
  skipFbq?: boolean;
  customData?: Record<string, unknown>;
};

export function trackFacebookEvent(
  eventName: FacebookEventName,
  meta: Omit<FacebookPixelEventPayload, "event_name"> = {},
  options: TrackOptions = {}
) {
  if (typeof window === "undefined") return;

  if (!options.skipFbq && window.fbq) {
    window.fbq("track", eventName, options.customData);
  }

  const body: FacebookPixelEventPayload = {
    event_name: eventName,
    property_id: meta.property_id ?? null,
    property_name: meta.property_name ?? null,
    page_path: meta.page_path ?? window.location.pathname,
    event_data: meta.event_data ?? options.customData ?? {},
  };

  fetch("/api/pixel-events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => {});
}
