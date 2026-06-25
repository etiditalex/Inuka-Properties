"use client";

import AdminShell from "@/components/admin/AdminShell";
import TicketingDashboard from "@/components/admin/ticketing/TicketingDashboard";

export default function AdminTicketingPage() {
  return (
    <AdminShell
      title="IAPL Ticketing"
      subtitle="Help desk and internal request management"
      contentClassName="!p-4"
    >
      <TicketingDashboard />
    </AdminShell>
  );
}
