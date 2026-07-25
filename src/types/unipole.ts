export type UnipoleStatus =
  | "available"
  | "temporarily-held"
  | "booked"
  | "upcoming";

export type PricingMode = "on-request" | "estimated-range";

export type IlluminationType = "front-lit" | "back-lit" | "non-illuminated";

export type DisplaySides = "single" | "double" | "triple";

export interface UnipolePricingBreakdown {
  mediaRental?: string;
  printing?: string;
  installation?: string;
  lighting?: string;
  localApprovals?: string;
  gst?: string;
}

export interface UnipoleAudience {
  primaryAudience: string;
  trafficProfile: string;
  peakHours: string;
  nearbyCommercialActivity: string;
}

export interface Unipole {
  id: string;
  mediaCode: string;
  title: string;
  state: string;
  city: string;
  area: string;
  roadName: string;
  landmark: string;
  description: string;
  size: string;
  width: number;
  height: number;
  totalSqFt: number;
  facing: string;
  trafficDirection: string;
  roadType: string;
  illumination: IlluminationType;
  displaySides: DisplaySides;
  visibilityDistance: string;
  minimumDuration: string;
  status: UnipoleStatus;
  availableFrom: string;
  pricingMode: PricingMode;
  estimatedPrice?: string;
  pricingBreakdown?: UnipolePricingBreakdown;
  pricingNote: string;
  audience: UnipoleAudience;
  images: string[];
  dayImage: string;
  nightImage: string;
  mapUrl: string;
  features: string[];
  /** True when the record contains unverified/editable placeholder data. */
  isPlaceholderData?: boolean;
}

export interface UnipoleFilters {
  search: string;
  city: string;
  area: string;
  size: string;
  illumination: string;
  availability: string;
}
