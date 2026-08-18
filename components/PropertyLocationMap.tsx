import { ExternalLink, MapPin } from "lucide-react";
import { buildMapEmbedSrc, buildOpenMapsHref } from "@/lib/maps";

type PropertyLocationMapProps = {
  mapLink?: string | null;
  location?: string;
  title?: string;
  heightClass?: string;
  showOpenLink?: boolean;
};

export default function PropertyLocationMap({
  mapLink,
  location,
  title,
  heightClass = "h-72 md:h-96",
  showOpenLink = true,
}: PropertyLocationMapProps) {
  const embedSrc = buildMapEmbedSrc(mapLink, location);
  const openHref = buildOpenMapsHref(mapLink, location);
  if (!embedSrc) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-dark-100 bg-white shadow-lg">
      <div className={`relative w-full ${heightClass}`}>
        <iframe
          title={title ? `${title} map location` : "Property map location"}
          src={embedSrc}
          className="h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      {showOpenLink && openHref && (
        <a
          href={openHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 border-t border-dark-100 px-4 py-3 text-sm font-semibold text-primary-700 transition hover:bg-primary-50 font-montserrat"
        >
          <MapPin size={16} />
          Open in Google Maps
          <ExternalLink size={14} />
        </a>
      )}
    </div>
  );
}
