import type { Unipole, UnipoleFilters, UnipoleStatus, IlluminationType } from "@/types/unipole";

export const EMPTY_FILTERS: UnipoleFilters = {
  search: "",
  city: "",
  area: "",
  size: "",
  illumination: "",
  availability: "",
};

export const STATUS_LABELS: Record<UnipoleStatus, string> = {
  available: "Available",
  "temporarily-held": "Temporarily Held",
  booked: "Booked",
  upcoming: "Upcoming",
};

/** Restrained, readable badge fills — no bright/glowing colour. */
export const STATUS_BADGE_CLASSES: Record<UnipoleStatus, string> = {
  available: "bg-[#EAF3EB] text-[#2F5233]",
  "temporarily-held": "bg-[#FBF1E1] text-[#7A5A17]",
  booked: "bg-brand-soft text-brand-secondary",
  upcoming: "bg-[#EAEEF5] text-[#3D4A5C]",
};

export const ILLUMINATION_LABELS: Record<IlluminationType, string> = {
  "front-lit": "Front-lit",
  "back-lit": "Back-lit",
  "non-illuminated": "Non-illuminated",
};

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

export interface InventoryFilterOptions {
  cities: string[];
  areas: string[];
  sizes: string[];
  illuminations: IlluminationType[];
  statuses: UnipoleStatus[];
}

/** Filter option lists derived directly from the inventory data — never hand-maintained. */
export function getFilterOptions(unipoles: Unipole[]): InventoryFilterOptions {
  return {
    cities: uniqueSorted(unipoles.map((u) => u.city)),
    areas: uniqueSorted(unipoles.map((u) => u.area)),
    sizes: uniqueSorted(unipoles.map((u) => u.size)),
    illuminations: Array.from(new Set(unipoles.map((u) => u.illumination))),
    statuses: Array.from(new Set(unipoles.map((u) => u.status))),
  };
}

export interface InventorySearchEntry {
  unipole: Unipole;
  haystack: string;
}

/** Normalizes each record's searchable fields once, so filtering never re-normalizes per keystroke. */
export function buildSearchIndex(unipoles: Unipole[]): InventorySearchEntry[] {
  return unipoles.map((unipole) => ({
    unipole,
    haystack: normalize(
      [
        unipole.title,
        unipole.mediaCode,
        unipole.city,
        unipole.area,
        unipole.roadName,
        unipole.landmark,
        unipole.facing,
      ].join(" ")
    ),
  }));
}

export function filterUnipoles(index: InventorySearchEntry[], filters: UnipoleFilters): Unipole[] {
  const query = normalize(filters.search);
  return index
    .filter(({ haystack }) => query === "" || haystack.includes(query))
    .filter(({ unipole }) => !filters.city || unipole.city === filters.city)
    .filter(({ unipole }) => !filters.area || unipole.area === filters.area)
    .filter(({ unipole }) => !filters.size || unipole.size === filters.size)
    .filter(({ unipole }) => !filters.illumination || unipole.illumination === filters.illumination)
    .filter(({ unipole }) => !filters.availability || unipole.status === filters.availability)
    .map(({ unipole }) => unipole);
}
