export function isMissingLandingPagesTable(error?: { message?: string; code?: string } | null) {
  const message = (error?.message || "").toLowerCase();
  const code = error?.code || "";
  return (
    code === "PGRST205" ||
    code === "42P01" ||
    message.includes("schema cache") ||
    (message.includes("landing_pages") &&
      (message.includes("does not exist") || message.includes("could not find")))
  );
}

export const LANDING_PAGES_SETUP_MESSAGE =
  "The landing_pages table is missing, or Supabase has not refreshed it yet. In the SQL Editor, run supabase/migrations/landing_pages.sql (it ends with a schema reload). Then refresh this page.";
