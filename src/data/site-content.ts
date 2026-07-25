export interface WhyUnipoleBenefit {
  title: string;
  description: string;
}

export const whyUnipoleBenefits: WhyUnipoleBenefit[] = [
  {
    title: "Maximum Height — Maximum Attention",
    description:
      "Standing high above its surroundings, a unipole captures attention from a long distance and rises above roadside visual clutter.",
  },
  {
    title: "24×7 Brand Visibility",
    description:
      "Illuminated displays keep campaigns visible during both daytime and nighttime.",
  },
  {
    title: "Builds Brand Credibility",
    description:
      "A large-format outdoor presence makes a business appear established, confident and trustworthy.",
  },
  {
    title: "Prime High-Traffic Locations",
    description:
      "Strategic placement along major roads, highways, junctions and commercial areas reaches daily commuters and pedestrians.",
  },
  {
    title: "Strong and Lasting Brand Recall",
    description:
      "Repeated exposure along frequently travelled routes keeps the brand top-of-mind.",
  },
  {
    title: "Drives Business Growth",
    description:
      "Consistent visibility creates awareness, builds trust and supports stronger business opportunities.",
  },
];

export interface LocationCategory {
  title: string;
  description: string;
}

export const locationCategories: LocationCategory[] = [
  {
    title: "Main Roads",
    description: "Steady daily exposure along well-travelled arterial roads within city limits.",
  },
  {
    title: "Highways",
    description: "Long-distance visibility for intercity and freight traffic on national and state highways.",
  },
  {
    title: "City Junctions",
    description: "High-dwell-time visibility where traffic slows or stops at major intersections.",
  },
  {
    title: "Commercial Centres",
    description: "Placements near retail, business and market hubs with strong footfall and vehicle traffic.",
  },
  {
    title: "City Entry Points",
    description: "First-impression visibility for traffic entering a city from surrounding regions.",
  },
  {
    title: "High-Traffic Areas",
    description: "Locations chosen for consistently high daily vehicular and pedestrian volume.",
  },
];

export interface UnipoleFeature {
  title: string;
  description: string;
}

export const unipoleFeatures: UnipoleFeature[] = [
  { title: "Elevated display", description: "Mounted above sightlines for uninterrupted exposure." },
  { title: "Single-pole engineering", description: "Structurally efficient design built for durability." },
  { title: "Long-distance visibility", description: "Visible well before commuters reach the site." },
  { title: "Large-format communication", description: "Enough scale to command attention instantly." },
  { title: "High-traffic positioning", description: "Placed where daily audiences are guaranteed." },
];

export interface InstallationStage {
  step: number;
  title: string;
}

export const installationStages: InstallationStage[] = [
  { step: 1, title: "Site identification" },
  { step: 2, title: "Structural planning" },
  { step: 3, title: "Foundation preparation" },
  { step: 4, title: "Pole installation" },
  { step: 5, title: "Frame erection" },
  { step: 6, title: "Lighting installation" },
  { step: 7, title: "Campaign mounting" },
  { step: 8, title: "Final quality inspection" },
];

export const growthJourneySteps = [
  "Visibility",
  "Awareness",
  "Trust",
  "Business Opportunities",
] as const;

export const growthJourneyPoints = [
  "Increases brand awareness",
  "Attracts new customers",
  "Supports store visits",
  "Improves brand credibility",
  "Creates an advantage over competitors",
];

export interface HowItWorksStep {
  step: number;
  title: string;
}

export const howItWorksSteps: HowItWorksStep[] = [
  { step: 1, title: "Select preferred locations" },
  { step: 2, title: "Review site details" },
  { step: 3, title: "Choose tentative campaign dates" },
  { step: 4, title: "Request a proposal" },
  { step: 5, title: "ADINN executes and monitors the campaign" },
];

export const industriesServed = [
  "Real Estate",
  "Jewellery",
  "Automobile",
  "Retail",
  "Textile and Fashion",
  "Healthcare",
  "Education",
  "Banking and Finance",
  "FMCG",
  "Entertainment",
] as const;
