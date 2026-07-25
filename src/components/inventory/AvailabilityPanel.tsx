"use client";

import { useId, useState } from "react";
import type { Unipole } from "@/types/unipole";
import { STATUS_LABELS } from "@/lib/inventory";

const DURATION_OPTIONS = [
  { value: "7", label: "7 days" },
  { value: "15", label: "15 days" },
  { value: "30", label: "30 days" },
  { value: "custom", label: "Custom enquiry" },
];

interface AvailabilityPanelProps {
  unipole: Unipole;
}

/**
 * Tentative start date + duration are local UI state only — nothing is reserved and nothing
 * is sent anywhere. Resets automatically each time the modal opens for a different site
 * (the parent modal is keyed by unipole.id, remounting this component).
 */
export function AvailabilityPanel({ unipole }: AvailabilityPanelProps) {
  const [startDate, setStartDate] = useState("");
  const [duration, setDuration] = useState("");
  const dateId = useId();
  const durationId = useId();

  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-black">
        Availability
      </h3>
      <p className="mt-4 text-sm text-brand-secondary">
        Currently <span className="font-medium text-brand-black">{STATUS_LABELS[unipole.status]}</span>
        {unipole.availableFrom ? ` · available from ${unipole.availableFrom}` : ""}
      </p>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={dateId} className="text-xs font-medium uppercase tracking-wide text-brand-muted">
            Tentative Start Date
          </label>
          <input
            id={dateId}
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            className="mt-1.5 w-full rounded-xl border border-brand-border px-3 py-2.5 text-sm text-brand-black focus:border-brand-black focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor={durationId} className="text-xs font-medium uppercase tracking-wide text-brand-muted">
            Campaign Duration
          </label>
          <select
            id={durationId}
            value={duration}
            onChange={(event) => setDuration(event.target.value)}
            className="mt-1.5 w-full rounded-xl border border-brand-border bg-brand-white px-3 py-2.5 text-sm text-brand-black focus:border-brand-black focus:outline-none"
          >
            <option value="">Select duration</option>
            {DURATION_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="mt-3 text-xs text-brand-muted">
        Selecting a date does not reserve this site — final scheduling is confirmed with our
        team.
      </p>
    </div>
  );
}
