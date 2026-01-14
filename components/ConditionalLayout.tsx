"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isProjectShowcase = pathname === "/project-showcase";

  return (
    <>
      {!isProjectShowcase && <Header />}
      <main className={isProjectShowcase ? "" : "min-h-screen"}>{children}</main>
      {!isProjectShowcase && <Footer />}
    </>
  );
}


