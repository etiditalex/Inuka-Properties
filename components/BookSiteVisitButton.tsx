"use client";

import { useBookSiteVisit } from "@/components/BookSiteVisitContext";

type BookSiteVisitButtonProps = {
  propertyId?: number | null;
  propertyTitle?: string | null;
  source?: string;
  className?: string;
  children?: React.ReactNode;
  onNavigate?: () => void;
};

/** Opens the site-visit booking popup. */
export default function BookSiteVisitButton({
  propertyId,
  propertyTitle,
  source = "whatsapp_click",
  className,
  children = "Book Site Visit",
  onNavigate,
}: BookSiteVisitButtonProps) {
  const { openBookSiteVisit } = useBookSiteVisit();

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        onNavigate?.();
        openBookSiteVisit({ propertyId, propertyTitle, source });
      }}
    >
      {children}
    </button>
  );
}
