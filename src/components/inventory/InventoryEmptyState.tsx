import { SearchX } from "lucide-react";

interface InventoryEmptyStateProps {
  onReset: () => void;
}

export function InventoryEmptyState({ onReset }: InventoryEmptyStateProps) {
  return (
    <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-brand-border px-6 py-16 text-center">
      <SearchX size={32} strokeWidth={1.5} className="text-brand-muted" aria-hidden />
      <h3 className="text-xl font-semibold text-brand-black">No matching unipoles found</h3>
      <p className="max-w-sm text-sm text-brand-secondary">
        Try changing your search or removing one or more filters.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-2 inline-flex min-h-[44px] items-center justify-center rounded-full border border-brand-border-strong px-5 text-sm font-semibold text-brand-black transition-colors hover:border-brand-black"
      >
        Reset Filters
      </button>
    </div>
  );
}
