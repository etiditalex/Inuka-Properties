"use client";

import { usePathname } from "next/navigation";
import { isAdminPath } from "@/lib/admin/path";
import { isLandingPagePath } from "@/lib/landing-pages/path";
import { SUPPORT_FORM_PATH } from "@/lib/ticketing/public-form";
import EmailFloatWidget from "./EmailFloatWidget";
import Chatbot from "./Chatbot";
import CookieBanner from "./CookieBanner";

export default function AdminAwareWidgets() {
  const pathname = usePathname();
  if (pathname && isAdminPath(pathname)) return null;
  if (pathname === SUPPORT_FORM_PATH) return null;
  if (isLandingPagePath(pathname)) {
    return <CookieBanner />;
  }

  return (
    <>
      <EmailFloatWidget />
      <Chatbot />
      <CookieBanner />
    </>
  );
}
