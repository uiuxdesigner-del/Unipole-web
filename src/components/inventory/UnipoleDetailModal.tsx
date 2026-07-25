"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { X, Share2, Bookmark, Send, CalendarCheck, MessageCircle, Plus } from "lucide-react";
import type { Unipole } from "@/types/unipole";
import { useLenis } from "@/hooks/useLenis";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { siteConfig } from "@/config/site";
import { STATUS_LABELS, STATUS_BADGE_CLASSES } from "@/lib/inventory";
import { UnipoleGallery } from "@/components/inventory/UnipoleGallery";
import { SpecificationGrid } from "@/components/inventory/SpecificationGrid";
import { AudiencePanel } from "@/components/inventory/AudiencePanel";
import { AvailabilityPanel } from "@/components/inventory/AvailabilityPanel";
import { LocationPanel } from "@/components/inventory/LocationPanel";

interface UnipoleDetailModalProps {
  unipole: Unipole;
  onClose: () => void;
}

type ActionFeedback = "quote" | "visit" | "campaign";

const ACTION_MESSAGES: Record<ActionFeedback, string> = {
  quote: "Quote request noted — the enquiry form will send this in a later phase.",
  visit: "Site-visit interest recorded — we'll follow up once enquiries are live.",
  campaign: "Campaign planning will be enabled in the next step.",
};

/**
 * Phase 3B-1: Request Quote / Schedule Site Visit / Add to Campaign are honest local-only
 * placeholders (inline feedback, no backend, no fabricated success). WhatsApp and Maps are
 * real actions (they just open a URL). Framer Motion only — no GSAP on this modal.
 */
export function UnipoleDetailModal({ unipole, onClose }: UnipoleDetailModalProps) {
  const reducedMotion = useReducedMotion();
  const { stop, start } = useLenis();
  const containerRef = useRef<HTMLDivElement>(null);
  const [actionFeedback, setActionFeedback] = useState<ActionFeedback | null>(null);
  const [shortlisted, setShortlisted] = useState(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  useFocusTrap(containerRef, true);

  useEffect(() => {
    stop();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      start();
      document.body.style.overflow = previousOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  useEffect(() => {
    return () => {
      document.querySelector<HTMLElement>(`[data-view-details-id="${unipole.id}"]`)?.focus();
    };
  }, [unipole.id]);

  const whatsappMessage = `Hi ADINN, I'm interested in ${unipole.title} (${unipole.mediaCode}) in ${unipole.area}, ${unipole.city}. Could you share more details?`;
  const whatsappUrl = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`;

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: unipole.title, text: unipole.mediaCode, url });
      } catch {
        // user cancelled the native share sheet — not an error
      }
      return;
    }
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        setShareFeedback("Link copied to clipboard.");
        return;
      } catch {
        // fall through to the unsupported message below
      }
    }
    setShareFeedback("Sharing isn't supported here — copy the link from the address bar.");
  };

  const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
  const modalVariants = reducedMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : { hidden: { opacity: 0, scale: 0.97, y: 12 }, visible: { opacity: 1, scale: 1, y: 0 } };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center lg:p-6">
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-brand-black/40"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        transition={{ duration: 0.25 }}
        onClick={onClose}
      />

      <motion.div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="unipole-modal-title"
        aria-describedby="unipole-modal-description"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative flex h-full w-full flex-col overflow-y-auto bg-brand-white lg:h-auto lg:max-h-[90vh] lg:w-[90vw] lg:max-w-[1280px] lg:flex-row lg:overflow-hidden lg:rounded-2xl lg:border lg:border-brand-border lg:shadow-[0_24px_60px_-20px_rgba(0,0,0,0.2)]"
      >
        <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            aria-label="Share this site"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-white/90 text-brand-black shadow-sm hover:text-brand-red"
          >
            <Share2 size={18} strokeWidth={1.75} aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => setShortlisted((value) => !value)}
            aria-pressed={shortlisted}
            aria-label={shortlisted ? "Remove from shortlist" : "Add to shortlist"}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-white/90 text-brand-black shadow-sm hover:text-brand-red"
          >
            <Bookmark
              size={18}
              strokeWidth={1.75}
              aria-hidden
              className={shortlisted ? "fill-brand-red text-brand-red" : undefined}
            />
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-white/90 text-brand-black shadow-sm hover:text-brand-red"
          >
            <X size={18} strokeWidth={1.75} aria-hidden />
          </button>
        </div>

        <div className="relative shrink-0 lg:w-[58%] lg:overflow-hidden">
          <UnipoleGallery unipole={unipole} />
        </div>

        <div className="flex flex-1 flex-col lg:w-[42%] lg:overflow-hidden">
          <div className="flex-1 p-6 lg:overflow-y-auto lg:p-8">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_BADGE_CLASSES[unipole.status]}`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
              {STATUS_LABELS[unipole.status]}
            </span>
            <p className="mt-3 text-xs font-medium uppercase tracking-wide text-brand-muted">
              {unipole.mediaCode}
            </p>
            <h2 id="unipole-modal-title" className="mt-1 text-2xl font-semibold text-brand-black">
              {unipole.title}
            </h2>
            <p id="unipole-modal-description" className="mt-2 text-sm text-brand-secondary">
              {unipole.description}
            </p>

            <div className="mt-6 border-t border-brand-border pt-6">
              <SpecificationGrid unipole={unipole} />
            </div>

            <div className="mt-6 border-t border-brand-border pt-6">
              <AudiencePanel unipole={unipole} />
            </div>

            <div className="mt-6 border-t border-brand-border pt-6">
              <AvailabilityPanel unipole={unipole} />
            </div>

            <div className="mt-6 border-t border-brand-border pt-6">
              <LocationPanel unipole={unipole} />
            </div>

            <div className="mt-6 rounded-xl bg-brand-soft p-4">
              <p className="text-sm font-semibold text-brand-black">Price on Request</p>
              <p className="mt-1 text-xs text-brand-muted">
                Final pricing may vary depending on campaign dates, availability, printing
                material, creative complexity, illumination and local approval requirements.
              </p>
            </div>

            {shareFeedback && (
              <p role="status" className="mt-3 text-xs text-brand-muted">
                {shareFeedback}
              </p>
            )}
          </div>

          <div className="sticky bottom-0 shrink-0 border-t border-brand-border bg-brand-white p-4 lg:static">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setActionFeedback("quote")}
                className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-full border border-brand-border-strong px-3 text-sm font-semibold text-brand-black transition-colors hover:border-brand-black"
              >
                <Send size={16} strokeWidth={1.75} aria-hidden />
                Request Quote
              </button>
              <button
                type="button"
                onClick={() => setActionFeedback("visit")}
                className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-full border border-brand-border-strong px-3 text-sm font-semibold text-brand-black transition-colors hover:border-brand-black"
              >
                <CalendarCheck size={16} strokeWidth={1.75} aria-hidden />
                Site Visit
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-full border border-brand-border-strong px-3 text-sm font-semibold text-brand-black transition-colors hover:border-brand-black"
              >
                <MessageCircle size={16} strokeWidth={1.75} aria-hidden />
                WhatsApp
              </a>
              <button
                type="button"
                onClick={() => setActionFeedback("campaign")}
                className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-full bg-brand-red px-3 text-sm font-semibold text-brand-white transition-transform hover:scale-[1.02]"
              >
                <Plus size={16} strokeWidth={1.75} aria-hidden />
                Add to Campaign
              </button>
            </div>
            {actionFeedback && (
              <p role="status" className="mt-2 text-xs text-brand-muted">
                {ACTION_MESSAGES[actionFeedback]}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
