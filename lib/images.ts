/** Normalize property gallery URLs from DB or static data */
export function parseGalleryUrls(
  gallery: unknown,
  fallbackImage?: string | null
): string[] {
  let urls: string[] = [];

  if (Array.isArray(gallery)) {
    urls = gallery.filter((u): u is string => typeof u === "string" && u.trim().length > 0);
  } else if (typeof gallery === "string" && gallery.trim()) {
    try {
      const parsed = JSON.parse(gallery) as unknown;
      if (Array.isArray(parsed)) {
        urls = parsed.filter((u): u is string => typeof u === "string" && u.trim().length > 0);
      }
    } catch {
      // not JSON — ignore
    }
  }

  if (!urls.length && fallbackImage?.trim()) {
    urls = [fallbackImage.trim()];
  }

  return urls;
}

export function isSupabaseStorageUrl(src: string): boolean {
  return src.includes(".supabase.co/storage/");
}

/** Use unoptimized Next/Image for hosts not in next.config or Supabase storage */
export function shouldUseUnoptimizedImage(src: string): boolean {
  if (!src) return true;
  if (isSupabaseStorageUrl(src)) return true;
  if (src.startsWith("/")) return false;
  try {
    const host = new URL(src).hostname;
    const optimizedHosts = [
      "res.cloudinary.com",
      "images.unsplash.com",
      "lh3.googleusercontent.com",
    ];
    return !optimizedHosts.includes(host);
  } catch {
    return true;
  }
}

export function propertyImageProps(src: string) {
  return {
    src,
    unoptimized: shouldUseUnoptimizedImage(src),
  } as const;
}
