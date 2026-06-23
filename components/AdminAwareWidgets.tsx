"use client";

import { usePathname } from "next/navigation";
import { isAdminPath } from "@/lib/admin/path";
import Chatbot from "./Chatbot";
import CookieBanner from "./CookieBanner";
import SmsFloatWidget from "./SmsFloatWidget";

export default function AdminAwareWidgets() {
  const pathname = usePathname();
  if (pathname && isAdminPath(pathname)) return null;

  return (
    <>
      <SmsFloatWidget />
      <Chatbot />
      <CookieBanner />
    </>
  );
}
