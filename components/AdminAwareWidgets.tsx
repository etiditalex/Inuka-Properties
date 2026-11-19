"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { isAdminPath } from "@/lib/admin/path";
import { isLandingPagePath } from "@/lib/landing-pages/path";
import { SUPPORT_FORM_PATH } from "@/lib/ticketing/public-form";
import CookieBanner from "./CookieBanner";

const EmailFloatWidget = dynamic(() => import("./EmailFloatWidget"), { ssr: false });
const Chatbot = dynamic(() => import("./Chatbot"), { ssr: false });

function useAfterIdle() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const enable = () => {
      if (!cancelled) setReady(true);
    };

    const timeoutId = window.setTimeout(enable, 20000);
    const events = ["pointerdown", "keydown", "touchstart", "scroll"] as const;
    events.forEach((event) =>
      window.addEventListener(event, enable, { once: true, passive: true })
    );

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
      events.forEach((event) => window.removeEventListener(event, enable));
    };
  }, []);

  return ready;
}

export default function AdminAwareWidgets() {
  const pathname = usePathname();
  const widgetsReady = useAfterIdle();
  if (pathname && isAdminPath(pathname)) return null;
  if (pathname === SUPPORT_FORM_PATH) return null;
  if (pathname === "/survey" || pathname?.startsWith("/survey/")) return null;
  if (isLandingPagePath(pathname)) {
    return <CookieBanner />;
  }

  return (
    <>
      {widgetsReady ? (
        <>
          <EmailFloatWidget />
          <Chatbot />
        </>
      ) : null}
      <CookieBanner />
    </>
  );
}
