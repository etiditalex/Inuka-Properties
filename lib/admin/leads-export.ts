import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { PropertyLead } from "@/lib/supabase/types";
import { formatAdminDate } from "@/lib/admin/utils";

type DocWithAutoTable = jsPDF & {
  lastAutoTable?: { finalY: number };
};

function todayStamp() {
  return new Date().toISOString().split("T")[0];
}

function autoSizeColumns(sheet: XLSX.WorkSheet) {
  const range = XLSX.utils.decode_range(sheet["!ref"] || "A1");
  const widths: number[] = [];

  for (let col = range.s.c; col <= range.e.c; col++) {
    let max = 10;
    for (let row = range.s.r; row <= range.e.r; row++) {
      const cell = sheet[XLSX.utils.encode_cell({ r: row, c: col })];
      const value = cell?.v != null ? String(cell.v) : "";
      max = Math.max(max, Math.min(value.length + 2, 48));
    }
    widths.push(max);
  }

  sheet["!cols"] = widths.map((wch) => ({ wch }));
}

function leadRows(leads: PropertyLead[]) {
  return leads.map((lead) => ({
    Name: lead.name,
    Email: lead.email,
    Phone: lead.phone,
    Property: lead.property_name || "General",
    Source: lead.source.replace(/_/g, " "),
    Status: lead.status,
    "Preferred Date": lead.preferred_date || "",
    "Preferred Time": lead.preferred_time || "",
    Message: lead.message || "",
    Notes: lead.notes || "",
    "Created At": lead.created_at.split("T")[0],
  }));
}

export function exportLeadsToExcel(leads: PropertyLead[]) {
  const workbook = XLSX.utils.book_new();
  const sheet = XLSX.utils.json_to_sheet(leadRows(leads));
  autoSizeColumns(sheet);
  XLSX.utils.book_append_sheet(workbook, sheet, "Leads");
  XLSX.writeFile(workbook, `IAPL-Property-Leads-${todayStamp()}.xlsx`);
}

export function exportLeadsToPdf(leads: PropertyLead[], filterLabel = "all") {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" }) as DocWithAutoTable;
  const marginX = 14;
  let y = 16;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(20, 40, 80);
  doc.text("INUKA AFRIKA PROPERTIES LTD", marginX, y);
  y += 8;

  doc.setFontSize(12);
  doc.setTextColor(30, 80, 160);
  doc.text("Property Leads Report", marginX, y);
  y += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(50, 50, 50);

  const metaLines = [
    `Status filter: ${filterLabel}`,
    `Total leads: ${leads.length}`,
    `Generated: ${formatAdminDate(new Date().toISOString())}`,
  ];

  for (const line of metaLines) {
    doc.text(line, marginX, y);
    y += 5.5;
  }

  y += 4;

  autoTable(doc, {
    startY: y,
    head: [["Name", "Email", "Phone", "Property", "Source", "Status", "Preferred Visit", "Date"]],
    body: leads.map((lead) => [
      lead.name,
      lead.email,
      lead.phone,
      lead.property_name || "General",
      lead.source.replace(/_/g, " "),
      lead.status,
      [lead.preferred_date, lead.preferred_time].filter(Boolean).join(" ") || "—",
      formatAdminDate(lead.created_at),
    ]),
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [30, 90, 180], textColor: 255 },
    alternateRowStyles: { fillColor: [240, 245, 252] },
    columnStyles: {
      0: { cellWidth: 28 },
      1: { cellWidth: 42 },
      2: { cellWidth: 28 },
      3: { cellWidth: 36 },
      4: { cellWidth: 28 },
      5: { cellWidth: 22 },
      6: { cellWidth: 32 },
      7: { cellWidth: 28 },
    },
    margin: { left: marginX, right: marginX },
  });

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

  doc.save(`IAPL-Property-Leads-${todayStamp()}.pdf`);
}
