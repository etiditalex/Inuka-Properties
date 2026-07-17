"use client";

import { openBookSiteVisitSmart } from "@/lib/leads/captureLead";
import { bookSiteVisitHref } from "@/lib/whatsapp";

type BookSiteVisitButtonProps = {
  propertyId?: number | null;
  propertyTitle?: string | null;
  source?: string;
  className?: string;
  children?: React.ReactNode;
  onNavigate?: () => void;
};

/**
 * Opens WhatsApp immediately when contact details are already known;
 * otherwise routes to the booking form to collect them.
 */
export default function BookSiteVisitButton({
  propertyId,
  propertyTitle,
  source = "whatsapp_click",
  className,
  children = "Book Site Visit",
  onNavigate,
}: BookSiteVisitButtonProps) {
  const fallbackHref = bookSiteVisitHref({ propertyId, source });

  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onNavigate?.();
    await openBookSiteVisitSmart({ propertyId, propertyTitle, source });
  };

  return (
    <a href={fallbackHref} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
