"use client";

import { usePathname } from "next/navigation";
import { isAdminPath } from "@/lib/admin/path";
import Header from "./Header";
import Footer from "./Footer";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isProjectShowcase = pathname === "/project-showcase";
  const isAdmin = pathname ? isAdminPath(pathname) : false;
  const hideSiteChrome = isProjectShowcase || isAdmin;

  return (
    <>
      {!hideSiteChrome && <Header />}
      <main className={hideSiteChrome ? "" : "min-h-screen"}>{children}</main>
      {!hideSiteChrome && <Footer />}
    </>
  );
}


