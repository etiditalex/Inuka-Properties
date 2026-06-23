"use client";

import { usePathname } from "next/navigation";
import { isAdminPath } from "@/lib/admin/path";
import EmailFloatWidget from "./EmailFloatWidget";
import Chatbot from "./Chatbot";
import CookieBanner from "./CookieBanner";

export default function AdminAwareWidgets() {
  const pathname = usePathname();
  if (pathname && isAdminPath(pathname)) return null;

  return (
    <>
      <EmailFloatWidget />
      <Chatbot />
      <CookieBanner />
    </>
  );
}
