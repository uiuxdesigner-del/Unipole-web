"use client";

import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { unipoles } from "@/data/unipoles";
import { findUnipoleById } from "@/lib/inventory";
import { useUnipoleModalState } from "@/hooks/useUnipoleModal";
import { UnipoleDetailModal } from "@/components/inventory/UnipoleDetailModal";

/**
 * Reads `?site=<id>` and renders the detail modal for a valid match. An invalid/unknown id is
 * stripped from the URL safely via the same `close()` used for user-initiated closes — never
 * renders a broken modal, never crashes. Rendered inside a `<Suspense>` boundary in page.tsx
 * since `useUnipoleModalState` reads `useSearchParams`.
 */
export function UnipoleDetailModalController() {
  const { activeId, close } = useUnipoleModalState();
  const unipole = activeId ? findUnipoleById(unipoles, activeId) : undefined;

  useEffect(() => {
    if (activeId && !unipole) close();
  }, [activeId, unipole, close]);

  return (
    <AnimatePresence>
      {unipole && <UnipoleDetailModal key={unipole.id} unipole={unipole} onClose={close} />}
    </AnimatePresence>
  );
}
