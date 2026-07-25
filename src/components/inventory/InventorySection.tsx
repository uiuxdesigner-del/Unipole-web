"use client";

import { useMemo, useState } from "react";
import { TextReveal } from "@/components/motion/TextReveal";
import { InventoryFilters } from "@/components/inventory/InventoryFilters";
import { UnipoleCard } from "@/components/inventory/UnipoleCard";
import { InventoryEmptyState } from "@/components/inventory/InventoryEmptyState";
import { unipoles } from "@/data/unipoles";
import { EMPTY_FILTERS, buildSearchIndex, filterUnipoles, getFilterOptions } from "@/lib/inventory";
import type { UnipoleFilters } from "@/types/unipole";

/**
 * Premium inventory catalogue: search + filters (data-driven from `src/data/unipoles.ts`,
 * never hand-listed) combine over a memoised search index, so typing/filtering never
 * re-normalizes the dataset. No GSAP/ScrollTrigger runs on filter interaction — only the
 * static header uses scroll-reveal, keeping search/filter changes free of scroll side effects.
 */
export function InventorySection() {
  const [filters, setFilters] = useState<UnipoleFilters>(EMPTY_FILTERS);

  const searchIndex = useMemo(() => buildSearchIndex(unipoles), []);
  const options = useMemo(() => getFilterOptions(unipoles), []);
  const results = useMemo(() => filterUnipoles(searchIndex, filters), [searchIndex, filters]);

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");
  const resultsLabel =
    results.length === 0
      ? "No matching sites"
      : `${results.length} ${results.length === 1 ? "site" : "sites"}`;

  const updateFilters = (patch: Partial<UnipoleFilters>) =>
    setFilters((previous) => ({ ...previous, ...patch }));
  const resetFilters = () => setFilters(EMPTY_FILTERS);

  return (
    <section id="inventory" className="relative bg-brand-white py-24 sm:py-32">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-brand-red">
            Available Locations
          </p>
          <TextReveal
            as="h2"
            text="Explore High-Impact Unipole Locations"
            className="mt-4 font-semibold leading-[1.02] tracking-tight text-brand-black"
            style={{ fontSize: "var(--text-h2)" }}
            start="top 90%"
          />
          <TextReveal
            as="p"
            text="Discover strategically positioned unipoles across major roads, junctions, highways and commercial destinations."
            className="mt-6 text-base text-brand-secondary sm:text-lg"
            start="top 90%"
          />
        </div>

        <InventoryFilters
          filters={filters}
          onChange={updateFilters}
          onReset={resetFilters}
          options={options}
          resultsLabel={resultsLabel}
          hasActiveFilters={hasActiveFilters}
        />

        {results.length === 0 ? (
          <InventoryEmptyState onReset={resetFilters} />
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((unipole) => (
              <UnipoleCard key={unipole.id} unipole={unipole} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
