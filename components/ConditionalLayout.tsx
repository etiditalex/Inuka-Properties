"use client";

import { usePathname } from "next/navigation";
import { isAdminPath } from "@/lib/admin/path";
import { SUPPORT_FORM_PATH } from "@/lib/ticketing/public-form";
import Header from "./Header";
import Footer from "./Footer";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isProjectShowcase = pathname === "/project-showcase";
  const isSupportForm = pathname === SUPPORT_FORM_PATH;
  const isAdmin = pathname ? isAdminPath(pathname) : false;
  const hideSiteChrome = isProjectShowcase || isAdmin || isSupportForm;

  return (
    <>
      {!hideSiteChrome && <Header />}
      <main className={hideSiteChrome ? "" : "min-h-screen"}>{children}</main>
      {!hideSiteChrome && <Footer />}
    </>
  );
}


