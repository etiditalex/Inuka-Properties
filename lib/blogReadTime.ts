/** ~200 words per minute for excerpt-based estimates */
export function estimateReadMinutes(...parts: string[]): number {
  const text = parts.join(" ").trim();
  if (!text) return 1;
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}
