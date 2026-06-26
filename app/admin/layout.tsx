import type { Metadata } from "next";
import { AdminShellProvider } from "@/components/admin/AdminShellContext";

export const metadata: Metadata = {
  title: "Console",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShellProvider>{children}</AdminShellProvider>;
}
