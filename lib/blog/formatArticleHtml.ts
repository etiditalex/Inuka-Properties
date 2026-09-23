const LEAD =
  "mb-6 text-xl font-semibold leading-relaxed text-neutral-800 md:text-2xl";
const BODY = "mb-6 leading-relaxed text-neutral-700";
const H2 = "mt-8 mb-4 text-2xl font-bold text-neutral-900 md:text-3xl";
const H3 = "mt-6 mb-3 text-xl font-bold text-neutral-900";
const LIST = "mb-6 list-disc space-y-2 pl-6 leading-relaxed text-neutral-700";
const ORDERED = "mb-6 list-decimal space-y-2 pl-6 leading-relaxed text-neutral-700";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inlineFormat(text: string): string {
  return text
    .split(/(\*\*[^*]+\*\*)/g)
    .map((part) => {
      const bold = part.match(/^\*\*([^*]+)\*\*$/);
      if (bold) return `<strong>${escapeHtml(bold[1])}</strong>`;
      return escapeHtml(part);
    })
    .join("")
    .replace(/\n/g, "<br />");
}

function hasBlockMarkup(html: string): boolean {
  return /<(p|h[1-6]|ul|ol|blockquote|div|section)\b/i.test(html);
}

function isSectionHeading(block: string, next: string | undefined): boolean {
  const line = block.replace(/^#{1,3}\s+/, "").trim();
  if (!line || block.includes("\n")) return false;
  if (line.length < 8 || line.length > 90) return false;
  if (/[.!?:]$/.test(line)) return false;
  const words = line.split(/\s+/);
  if (words.length < 2 || words.length > 14) return false;
  if (!/^[A-Z0-9"“]/.test(line)) return false;
  return Boolean(next && next.length >= 40);
}

function paragraphClass(isFirst: boolean): string {
  return isFirst ? LEAD : BODY;
}

function blocksToHtml(blocks: string[]): string {
  let firstParagraph = true;
  return blocks
    .map((block, index) => {
      const next = blocks[index + 1];
      const heading = block.replace(/^#{1,3}\s+/, "").trim();
      if (/^#{1,3}\s+/.test(block) || isSectionHeading(block, next)) {
        return `<h2 class="${H2}">${inlineFormat(heading)}</h2>`;
      }
      const cls = paragraphClass(firstParagraph);
      firstParagraph = false;
      return `<p class="${cls}">${inlineFormat(block)}</p>`;
    })
    .join("\n");
}

function separateStuckWords(text: string): string {
  return text.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/,([^\s])/g, ", $1");
}

function plainTextToHtml(text: string): string {
  const normalized = separateStuckWords(text.replace(/\r\n/g, "\n").replace(/<br\s*\/?>/gi, "\n")).trim();
  let blocks = normalized
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  if (blocks.length <= 1) {
    const lines = normalized
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    if (lines.length > 1) blocks = lines;
  }

  return blocksToHtml(blocks);
}

function styleExistingHtml(html: string): string {
  let firstParagraph = true;
  return html.replace(/<(p|h1|h2|h3|ul|ol)(\s[^>]*)?>/gi, (match, tag: string, attrs = "") => {
    if (/\bclass\s*=/i.test(attrs)) return match;
    const name = tag.toLowerCase();
    let className = BODY;
    if (name === "p") {
      className = paragraphClass(firstParagraph);
      firstParagraph = false;
    } else if (name === "h1" || name === "h2") {
      className = H2;
    } else if (name === "h3") {
      className = H3;
    } else if (name === "ul") {
      className = LIST;
    } else if (name === "ol") {
      className = ORDERED;
    }
    const rendered = name === "h1" ? "h2" : name;
    return `<${rendered} class="${className}"${attrs}>`;
  });
}

/** Turn admin plain text or unstyled HTML into the same paragraph layout as the other articles. */
export function formatBlogArticleHtml(content: string): string {
  const source = content.replace(/\r\n/g, "\n").trim();
  if (!source) return "";

  if (!hasBlockMarkup(source)) {
    return plainTextToHtml(source);
  }

  const singleParagraph = source.match(/^<p[^>]*>([\s\S]*)<\/p>$/i);
  if (singleParagraph && !/<(p|h[1-6]|ul|ol|div)\b/i.test(singleParagraph[1])) {
    return plainTextToHtml(singleParagraph[1]);
  }

  return styleExistingHtml(source);
}
