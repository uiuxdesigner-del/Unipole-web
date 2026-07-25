import type { Unipole } from "@/types/unipole";
import { ILLUMINATION_LABELS, DISPLAY_SIDES_LABELS } from "@/lib/inventory";

interface SpecificationGridProps {
  unipole: Unipole;
}

/** Only renders fields that have a value — never "undefined"/empty cells. */
export function SpecificationGrid({ unipole }: SpecificationGridProps) {
  const rows = [
    { label: "City", value: unipole.city },
    { label: "Area", value: unipole.area },
    { label: "State", value: unipole.state },
    { label: "Road", value: unipole.roadName },
    { label: "Landmark", value: unipole.landmark },
    { label: "Size", value: unipole.size },
    { label: "Width", value: unipole.width ? `${unipole.width} ft` : "" },
    { label: "Height", value: unipole.height ? `${unipole.height} ft` : "" },
    { label: "Total Area", value: unipole.totalSqFt ? `${unipole.totalSqFt} sq ft` : "" },
    { label: "Facing", value: unipole.facing },
    { label: "Traffic Direction", value: unipole.trafficDirection },
    { label: "Road Type", value: unipole.roadType },
    { label: "Illumination", value: ILLUMINATION_LABELS[unipole.illumination] },
    { label: "Display Sides", value: DISPLAY_SIDES_LABELS[unipole.displaySides] },
    { label: "Visibility Distance", value: unipole.visibilityDistance },
    { label: "Minimum Duration", value: unipole.minimumDuration },
  ].filter((row) => Boolean(row.value));

  if (rows.length === 0) return null;

  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-black">
        Specifications
      </h3>
      <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
        {rows.map((row) => (
          <div key={row.label} className="border-t border-brand-border pt-3">
            <dt className="text-xs font-medium uppercase tracking-wide text-brand-muted">
              {row.label}
            </dt>
            <dd className="mt-1 text-sm font-medium text-brand-black">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
