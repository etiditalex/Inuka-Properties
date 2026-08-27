import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { PropertyLead } from "@/lib/supabase/types";
import { uniquePropertyLeads } from "@/lib/leads/dedupe";

type DocWithAutoTable = jsPDF & {
  lastAutoTable?: { finalY: number };
};

const EXCLUDED_LEAD_NAMES = new Set(["alex etidit", "alex etidi"]);

function todayStamp() {
  return new Date().toISOString().split("T")[0];
}

function normalizeName(name: string) {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

/** Exclude test leads and collapse repeats by email / phone. */
export function prepareLeadsForExport(leads: PropertyLead[]): PropertyLead[] {
  return uniquePropertyLeads(
    leads.filter((lead) => !EXCLUDED_LEAD_NAMES.has(normalizeName(lead.name)))
  );
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
    Message: lead.message || "",
    Notes: lead.notes || "",
  }));
}

export function exportLeadsToExcel(leads: PropertyLead[]) {
  const rows = prepareLeadsForExport(leads);
  const workbook = XLSX.utils.book_new();
  const sheet = XLSX.utils.json_to_sheet(leadRows(rows));
  autoSizeColumns(sheet);
  XLSX.utils.book_append_sheet(workbook, sheet, "Leads");
  XLSX.writeFile(workbook, `IAPL-Property-Leads-${todayStamp()}.xlsx`);
}

export function exportLeadsToPdf(leads: PropertyLead[], filterLabel = "all") {
  const rows = prepareLeadsForExport(leads);
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
    `Total leads: ${rows.length}`,
  ];

  for (const line of metaLines) {
    doc.text(line, marginX, y);
    y += 5.5;
  }

  y += 4;

  autoTable(doc, {
    startY: y,
    head: [["Name", "Email", "Phone", "Property", "Source", "Status", "Message"]],
    body: rows.map((lead) => [
      lead.name,
      lead.email,
      lead.phone,
      lead.property_name || "General",
      lead.source.replace(/_/g, " "),
      lead.status,
      lead.message || "—",
    ]),
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [30, 90, 180], textColor: 255 },
    alternateRowStyles: { fillColor: [240, 245, 252] },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 48 },
      2: { cellWidth: 30 },
      3: { cellWidth: 40 },
      4: { cellWidth: 30 },
      5: { cellWidth: 24 },
      6: { cellWidth: 52 },
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
