import type { Unipole } from "@/types/unipole";

interface AudiencePanelProps {
  unipole: Unipole;
}

/** Only the audience data present in the record — no invented traffic counts, impressions or reach. */
export function AudiencePanel({ unipole }: AudiencePanelProps) {
  const { audience } = unipole;

  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-black">
        Audience &amp; Visibility
      </h3>
      <p className="mt-4 text-sm text-brand-secondary">{audience.primaryAudience}</p>

      <dl className="mt-4 flex flex-col gap-3 text-sm">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-brand-muted">
            Traffic Profile
          </dt>
          <dd className="mt-1 text-brand-black">{audience.trafficProfile}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-brand-muted">
            Peak Hours
          </dt>
          <dd className="mt-1 text-brand-black">{audience.peakHours}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-brand-muted">
            Nearby Activity
          </dt>
          <dd className="mt-1 text-brand-black">{audience.nearbyCommercialActivity}</dd>
        </div>
      </dl>

      {unipole.features.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {unipole.features.map((feature) => (
            <li
              key={feature}
              className="rounded-full border border-brand-border px-3 py-1 text-xs text-brand-secondary"
            >
              {feature}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
