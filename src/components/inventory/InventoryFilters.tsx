import { Search, X, ChevronDown, RotateCcw } from "lucide-react";
import type { UnipoleFilters } from "@/types/unipole";
import { STATUS_LABELS, ILLUMINATION_LABELS, type InventoryFilterOptions } from "@/lib/inventory";

interface InventoryFiltersProps {
  filters: UnipoleFilters;
  onChange: (patch: Partial<UnipoleFilters>) => void;
  onReset: () => void;
  options: InventoryFilterOptions;
  resultsLabel: string;
  hasActiveFilters: boolean;
}

interface FilterSelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

function FilterSelect({ id, label, value, onChange, options }: FilterSelectProps) {
  return (
    <div className="relative shrink-0">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-w-[150px] appearance-none rounded-xl border border-brand-border bg-brand-white py-2.5 pl-3.5 pr-9 text-sm text-brand-black transition-colors hover:border-brand-border-strong focus:border-brand-black focus:outline-none lg:min-w-0"
      >
        <option value="">{label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        strokeWidth={1.75}
        aria-hidden
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted"
      />
    </div>
  );
}

/** Search input + city/area/size/illumination/availability selects + reset + results count. */
export function InventoryFilters({
  filters,
  onChange,
  onReset,
  options,
  resultsLabel,
  hasActiveFilters,
}: InventoryFiltersProps) {
  return (
    <div className="mt-10">
      <div className="relative">
        <label htmlFor="inventory-search" className="sr-only">
          Search unipole locations
        </label>
        <Search
          size={18}
          strokeWidth={1.75}
          aria-hidden
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted"
        />
        <input
          id="inventory-search"
          type="text"
          value={filters.search}
          onChange={(event) => onChange({ search: event.target.value })}
          placeholder="Search by title, media code, city, area, road or landmark"
          className="w-full rounded-xl border border-brand-border bg-brand-white py-3 pl-11 pr-11 text-sm text-brand-black placeholder:text-brand-muted focus:border-brand-black focus:outline-none"
        />
        {filters.search && (
          <button
            type="button"
            onClick={() => onChange({ search: "" })}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-brand-muted hover:text-brand-black"
          >
            <X size={16} strokeWidth={1.75} aria-hidden />
          </button>
        )}
      </div>

      <div className="-mx-5 mt-4 flex items-center gap-3 overflow-x-auto px-5 pb-1 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0">
        <FilterSelect
          id="filter-city"
          label="City"
          value={filters.city}
          onChange={(value) => onChange({ city: value })}
          options={options.cities.map((city) => ({ value: city, label: city }))}
        />
        <FilterSelect
          id="filter-area"
          label="Area"
          value={filters.area}
          onChange={(value) => onChange({ area: value })}
          options={options.areas.map((area) => ({ value: area, label: area }))}
        />
        <FilterSelect
          id="filter-size"
          label="Size"
          value={filters.size}
          onChange={(value) => onChange({ size: value })}
          options={options.sizes.map((size) => ({ value: size, label: size }))}
        />
        <FilterSelect
          id="filter-illumination"
          label="Illumination"
          value={filters.illumination}
          onChange={(value) => onChange({ illumination: value })}
          options={options.illuminations.map((value) => ({ value, label: ILLUMINATION_LABELS[value] }))}
        />
        <FilterSelect
          id="filter-availability"
          label="Availability"
          value={filters.availability}
          onChange={(value) => onChange({ availability: value })}
          options={options.statuses.map((value) => ({ value, label: STATUS_LABELS[value] }))}
        />

        <button
          type="button"
          onClick={onReset}
          disabled={!hasActiveFilters}
          className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-full border border-brand-border-strong px-4 text-sm font-semibold text-brand-black transition-colors hover:border-brand-black disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-brand-border-strong"
        >
          <RotateCcw size={16} strokeWidth={1.75} aria-hidden />
          Reset Filters
        </button>
      </div>

      <p role="status" aria-live="polite" className="mt-4 text-sm text-brand-muted">
        {resultsLabel}
      </p>
    </div>
  );
}
