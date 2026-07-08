import * as XLSX from "xlsx";
import type { CompanyAsset, CompanySubscription } from "@/lib/supabase/types";

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

function downloadWorkbook(workbook: XLSX.WorkBook, filename: string) {
  XLSX.writeFile(workbook, filename);
}

function assetRows(assets: CompanyAsset[]) {
  return assets.map((a) => ({
    "Asset Name": a.name,
    Model: a.model,
    "Purchase Date": a.purchase_date,
    Department: a.department,
    "Cost (KES)": Number(a.cost),
    Condition: a.purchase_condition === "new" ? "New" : "Refurbished",
    "Serial Number": a.serial_number || "",
    Status: a.status.replace("_", " "),
    Notes: a.notes || "",
    Challenges: a.challenges || "",
    "Recorded At": a.created_at.split("T")[0],
  }));
}

function subscriptionRows(subscriptions: CompanySubscription[]) {
  return subscriptions.map((s) => ({
    Name: s.name,
    Type: s.subscription_type === "internet" ? "Internet" : "Software",
    Provider: s.provider || "",
    "Acquisition Date": s.acquisition_date,
    "Renewal Date": s.renewal_date || "",
    "Cost (KES)": Number(s.cost),
    "Billing Cycle": s.billing_cycle.replace("_", " "),
    Status: s.status,
    Notes: s.notes || "",
    Challenges: s.challenges || "",
    "Recorded At": s.created_at.split("T")[0],
  }));
}

export function exportAssetsToExcel(assets: CompanyAsset[]) {
  const workbook = XLSX.utils.book_new();
  const sheet = XLSX.utils.json_to_sheet(assetRows(assets));
  autoSizeColumns(sheet);
  XLSX.utils.book_append_sheet(workbook, sheet, "Assets");
  downloadWorkbook(workbook, `IAPL-Company-Assets-${todayStamp()}.xlsx`);
}

export function exportSubscriptionsToExcel(subscriptions: CompanySubscription[]) {
  const workbook = XLSX.utils.book_new();
  const sheet = XLSX.utils.json_to_sheet(subscriptionRows(subscriptions));
  autoSizeColumns(sheet);
  XLSX.utils.book_append_sheet(workbook, sheet, "Subscriptions");
  downloadWorkbook(workbook, `IAPL-Company-Subscriptions-${todayStamp()}.xlsx`);
}

export function exportFullInventoryToExcel(
  assets: CompanyAsset[],
  subscriptions: CompanySubscription[]
) {
  const workbook = XLSX.utils.book_new();

  const assetSheet = XLSX.utils.json_to_sheet(assetRows(assets));
  autoSizeColumns(assetSheet);
  XLSX.utils.book_append_sheet(workbook, assetSheet, "Assets");

  const subSheet = XLSX.utils.json_to_sheet(subscriptionRows(subscriptions));
  autoSizeColumns(subSheet);
  XLSX.utils.book_append_sheet(workbook, subSheet, "Subscriptions");

  downloadWorkbook(workbook, `IAPL-Company-Inventory-${todayStamp()}.xlsx`);
}
