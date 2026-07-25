"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import clsx from "clsx";
import { siteConfig } from "@/config/site";
import { useLenis } from "@/hooks/useLenis";

interface MobileNavigationProps {
  open: boolean;
  onClose: () => void;
  activeHref: string;
}

/** Full-screen animated mobile menu. Locks Lenis + body scroll while open. */
export function MobileNavigation({ open, onClose, activeHref }: MobileNavigationProps) {
  const { stop, start } = useLenis();

  useEffect(() => {
    if (!open) return;

    stop();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      start();
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose, stop, start]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className="fixed inset-0 z-[60] flex flex-col bg-brand-white text-brand-black lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="flex h-16 items-center justify-between px-5 sm:px-8">
            <span className="text-lg font-semibold tracking-[0.18em]">ADINN</span>
            <button
              type="button"
              aria-label="Close menu"
              onClick={onClose}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-border"
            >
              <X size={24} aria-hidden />
            </button>
          </div>

          <nav
            className="flex flex-1 flex-col justify-center gap-2 px-8"
            aria-label="Mobile primary"
          >
            {siteConfig.nav.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.08 * index, ease: "easeOut" }}
              >
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={clsx(
                    "block py-3 text-3xl font-semibold tracking-tight transition-colors",
                    activeHref === item.href ? "text-brand-red" : "text-brand-black hover:text-brand-red"
                  )}
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </nav>

          <div className="px-8 pb-10">
            <Link
              href="#enquiry"
              onClick={onClose}
              className="flex min-h-[44px] w-full items-center justify-center rounded-full bg-brand-red px-5 py-3 text-base font-semibold text-brand-white"
            >
              Get a Quote
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
