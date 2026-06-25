import type { Metadata } from "next";
import OpenTicketForm from "@/components/support/OpenTicketForm";

export const metadata: Metadata = {
  title: "Submit a Support Request",
  description:
    "Open a support ticket with Inuka Afrika Properties. Receive instant email confirmation when your request is received.",
  robots: { index: false, follow: false },
};

export default function SupportPage() {
  return <OpenTicketForm />;
}
