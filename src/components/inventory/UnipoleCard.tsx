"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin, Ruler, Sun, ArrowUpRight, Plus, ImageOff } from "lucide-react";
import type { Unipole } from "@/types/unipole";
import { STATUS_LABELS, STATUS_BADGE_CLASSES, ILLUMINATION_LABELS } from "@/lib/inventory";

interface UnipoleCardProps {
  unipole: Unipole;
}

/**
 * Phase 3A: "View Details" and "Add to Campaign" are honest placeholders — the detail modal
 * and campaign-plan drawer are Phase 3B. Clicking either shows a small inline note instead of
 * pretending to open a modal or save a real selection.
 */
export function UnipoleCard({ unipole }: UnipoleCardProps) {
  const [feedback, setFeedback] = useState<"details" | "campaign" | null>(null);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-brand-border bg-brand-white transition-all duration-300 hover:border-[#D5D5D0] motion-safe:hover:-translate-y-0.5">
      <div className="relative aspect-4/3 w-full overflow-hidden bg-brand-soft">
        {unipole.isPlaceholderData ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-brand-muted">
            <ImageOff size={28} strokeWidth={1.5} aria-hidden />
            <span className="text-xs">Photography coming soon</span>
          </div>
        ) : (
          <Image
            src={unipole.dayImage}
            alt={`${unipole.title} unipole site`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
          />
        )}
        <span
          className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_BADGE_CLASSES[unipole.status]}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
          {STATUS_LABELS[unipole.status]}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <span className="text-xs font-medium uppercase tracking-wide text-brand-muted">
          {unipole.mediaCode}
        </span>
        <h3 className="text-lg font-semibold text-brand-black">{unipole.title}</h3>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-brand-secondary">
          <span className="inline-flex items-center gap-1.5">
            <MapPin size={16} strokeWidth={1.75} aria-hidden />
            {unipole.area}, {unipole.city}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Ruler size={16} strokeWidth={1.75} aria-hidden />
            {unipole.size}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Sun size={16} strokeWidth={1.75} aria-hidden />
            {ILLUMINATION_LABELS[unipole.illumination]}
          </span>
        </div>

        <p className="text-xs text-brand-muted">{unipole.facing}</p>

        <p className="mt-1 text-sm font-semibold text-brand-black">Price on Request</p>

        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => setFeedback("details")}
            className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-full border border-brand-border-strong px-4 text-sm font-semibold text-brand-black transition-colors hover:border-brand-black"
          >
            View Details
            <ArrowUpRight
              size={18}
              strokeWidth={1.75}
              aria-hidden
              className="transition-transform duration-300 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5 group-hover:text-brand-red"
            />
          </button>
          <button
            type="button"
            onClick={() => setFeedback("campaign")}
            className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-full bg-brand-red px-4 text-sm font-semibold text-brand-white transition-transform hover:scale-[1.02]"
          >
            <Plus size={18} strokeWidth={1.75} aria-hidden />
            Add to Campaign
          </button>
        </div>

        {feedback && (
          <p role="status" className="text-xs text-brand-muted">
            {feedback === "details"
              ? "Full site details arrive in the next phase."
              : "Noted — campaign planning arrives in the next phase."}
          </p>
        )}
      </div>
    </article>
  );
}
