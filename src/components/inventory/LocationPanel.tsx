import { MapPin, ExternalLink } from "lucide-react";
import type { Unipole } from "@/types/unipole";

interface LocationPanelProps {
  unipole: Unipole;
}

export function LocationPanel({ unipole }: LocationPanelProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-black">Location</h3>
      <div className="mt-4 flex items-start gap-2 text-sm text-brand-secondary">
        <MapPin size={16} strokeWidth={1.75} aria-hidden className="mt-0.5 shrink-0" />
        <span>
          {unipole.roadName}, {unipole.area}, {unipole.city} — near {unipole.landmark}.{" "}
          {unipole.trafficDirection}.
        </span>
      </div>
      {unipole.mapUrl ? (
        <a
          href={unipole.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-brand-black underline-offset-4 hover:text-brand-red hover:underline"
        >
          Open in Google Maps
          <ExternalLink size={14} strokeWidth={1.75} aria-hidden />
        </a>
      ) : (
        <p className="mt-3 text-sm text-brand-muted">Map link not available for this site yet.</p>
      )}
    </div>
  );
}
