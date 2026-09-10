"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import BookSiteVisitModal from "@/components/BookSiteVisitModal";
import { isAdminPath } from "@/lib/admin/path";
import { getPropertyIdFromPathname, getPropertySeo } from "@/lib/propertySeo";
import { SUPPORT_FORM_PATH } from "@/lib/ticketing/public-form";

export const BOOK_VISIT_HASH = "#book-site-visit";

export type BookSiteVisitOptions = {
  propertyId?: number | null;
  propertyTitle?: string | null;
  source?: string;
};

type BookSiteVisitContextValue = {
  openBookSiteVisit: (options?: BookSiteVisitOptions) => void;
};

const BookSiteVisitContext = createContext<BookSiteVisitContextValue | null>(null);

function shouldAutoOpenBooking(): boolean {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  return params.has("book-visit") || window.location.hash === BOOK_VISIT_HASH;
}

function clearBookingQuery() {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  url.searchParams.delete("book-visit");
  url.hash = "";
  const next = `${url.pathname}${url.search}`;
  window.history.replaceState({}, "", next || "/");
}

export function BookSiteVisitProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<BookSiteVisitOptions>({});

  const pagePropertyId = getPropertyIdFromPathname(pathname);
  const pagePropertyTitle = pagePropertyId ? getPropertySeo(pagePropertyId)?.title : null;
  const hideModal = Boolean(
    pathname && (isAdminPath(pathname) || pathname === SUPPORT_FORM_PATH)
  );

  const openBookSiteVisit = useCallback((next?: BookSiteVisitOptions) => {
    setOptions(next ?? {});
    setIsOpen(true);
  }, []);

  useEffect(() => {
    if (hideModal || !shouldAutoOpenBooking()) return;
    const params = new URLSearchParams(window.location.search);
    openBookSiteVisit({
      source: params.get("source") || "book_visit_redirect",
    });
    clearBookingQuery();
  }, [hideModal, openBookSiteVisit, pathname]);

  const value = useMemo(() => ({ openBookSiteVisit }), [openBookSiteVisit]);

  return (
    <BookSiteVisitContext.Provider value={value}>
      {children}
      {!hideModal && (
        <BookSiteVisitModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          propertyId={options.propertyId ?? pagePropertyId}
          propertyTitle={options.propertyTitle ?? pagePropertyTitle}
          source={
            options.source ||
            (options.propertyId || pagePropertyId ? "header_property" : "header")
          }
        />
      )}
    </BookSiteVisitContext.Provider>
  );
}

export function useBookSiteVisit() {
  const context = useContext(BookSiteVisitContext);
  if (!context) {
    throw new Error("useBookSiteVisit must be used within BookSiteVisitProvider");
  }
  return context;
}
