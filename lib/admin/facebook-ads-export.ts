import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { formatAdminDate } from "@/lib/admin/utils";
import { FACEBOOK_PIXEL_ID } from "@/lib/facebook/pixel";

export type FacebookAdsExportLead = {
  name: string;
  email: string;
  phone: string;
  property_name: string | null;
  status: string;
  created_at: string;
};

export type FacebookAdsExportInput = {
  propertyTitle: string;
  propertyLocation?: string;
  propertyPrice?: string;
  days: number;
  stats: Record<string, number>;
  totalEvents: number;
  leads: FacebookAdsExportLead[];
};

type DocWithAutoTable = jsPDF & {
  lastAutoTable?: { finalY: number };
};

const EVENT_ROWS: { key: string; label: string }[] = [
  { key: "PageView", label: "Page views" },
  { key: "ViewContent", label: "Property views" },
  { key: "Contact", label: "Contact clicks" },
  { key: "Schedule", label: "Site visit clicks" },
  { key: "Lead", label: "Form leads (pixel)" },
];

function todayStamp() {
  return new Date().toISOString().split("T")[0];
}

function rangeLabel(days: number) {
  return `Last ${days} days`;
}

export function exportFacebookAdsToPdf(input: FacebookAdsExportInput) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" }) as DocWithAutoTable;
  const marginX = 14;
  let y = 16;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(20, 40, 80);
  doc.text("INUKA AFRIKA PROPERTIES LTD", marginX, y);
  y += 8;

  doc.setFontSize(12);
  doc.setTextColor(30, 80, 160);
  doc.text("Facebook Ads Results Report", marginX, y);
  y += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(50, 50, 50);

  const metaLines = [
    `Campaign property: ${input.propertyTitle}`,
    input.propertyLocation || input.propertyPrice
      ? `Details: ${[input.propertyLocation, input.propertyPrice].filter(Boolean).join(" · ")}`
      : null,
    `Pixel ID: ${FACEBOOK_PIXEL_ID}`,
    `Date range: ${rangeLabel(input.days)}`,
    `Generated: ${formatAdminDate(new Date().toISOString())}`,
    `Total pixel events: ${input.totalEvents}`,
    `Captured leads: ${input.leads.length}`,
  ].filter(Boolean) as string[];

  for (const line of metaLines) {
    doc.text(line, marginX, y);
    y += 5.5;
  }

  y += 4;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(20, 40, 80);
  doc.text("Campaign metrics", marginX, y);
  y += 2;

  autoTable(doc, {
    startY: y,
    head: [["Metric", "Count"]],
    body: EVENT_ROWS.map(({ key, label }) => [label, String(input.stats[key] ?? 0)]),
    styles: { fontSize: 9, cellPadding: 2.5 },
    headStyles: { fillColor: [30, 90, 180], textColor: 255 },
    alternateRowStyles: { fillColor: [240, 245, 252] },
    margin: { left: marginX, right: marginX },
  });

  y = (doc.lastAutoTable?.finalY ?? y) + 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(20, 40, 80);
  doc.text("Facebook ad leads", marginX, y);
  y += 2;

  if (!input.leads.length) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("No leads from Facebook ads in this date range.", marginX, y + 6);
  } else {
    autoTable(doc, {
      startY: y,
      head: [["Name", "Email", "Phone", "Status", "Date"]],
      body: input.leads.map((lead) => [
        lead.name,
        lead.email,
        lead.phone,
        lead.status,
        formatAdminDate(lead.created_at),
      ]),
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [30, 90, 180], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 245, 252] },
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 50 },
        2: { cellWidth: 32 },
        3: { cellWidth: 24 },
        4: { cellWidth: 28 },
      },
      margin: { left: marginX, right: marginX },
    });
  }

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(140, 140, 140);
    doc.text(
      `Page ${i} of ${pageCount} · Confidential · Inuka Afrika Properties Ltd`,
      marginX,
      doc.internal.pageSize.getHeight() - 8
    );
  }

  const safeTitle = input.propertyTitle.replace(/[^\w\-]+/g, "-").replace(/-+/g, "-");
  doc.save(`IAPL-Facebook-Ads-${safeTitle}-${input.days}d-${todayStamp()}.pdf`);
}
