"use client";

import { useCallback, useState } from "react";

export function useWebsiteImport(endpoint: string, confirmMessage: string) {
  const [importing, setImporting] = useState(false);
  const [importMessage, setImportMessage] = useState("");

  const runImport = useCallback(
    async (onSuccess?: () => void | Promise<void>) => {
      if (!confirm(confirmMessage)) return;

      setImporting(true);
      setImportMessage("");

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          credentials: "include",
        });
        const data = await res.json();

        if (!res.ok) {
          setImportMessage(data.error || "Import failed");
          return;
        }

        setImportMessage(data.message || "Import completed.");
        await onSuccess?.();
      } catch {
        setImportMessage("Import failed. Please try again.");
      } finally {
        setImporting(false);
      }
    },
    [confirmMessage, endpoint]
  );

  return { importing, importMessage, setImportMessage, runImport };
}
