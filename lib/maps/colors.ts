import type { PlotStatus } from "@/lib/maps/types";

export const PLOT_STYLE: Record<PlotStatus, { fill: string; opacity: number; label: string }> = {
  available: { fill: "#45B649", opacity: 0.65, label: "Available" },
  reserved: { fill: "#FFD600", opacity: 0.75, label: "Reserved" },
  sold: { fill: "#E53935", opacity: 0.75, label: "Sold" },
  on_hold: { fill: "#8795A1", opacity: 0.65, label: "On hold" },
};

export const PLOT_LINE = "#2c2c2c";
export const SELECTED_LINE = "#111827";

export function formatKes(amount: number): string {
  return `KES ${amount.toLocaleString("en-KE")}`;
}

export function statusLabel(status: PlotStatus): string {
  return PLOT_STYLE[status].label;
}
