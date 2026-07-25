export type CampaignIndustry =
  | "Real Estate"
  | "Automobile"
  | "Retail"
  | "Telecom"
  | "FMCG"
  | "Healthcare"
  | "Entertainment";

export interface Campaign {
  id: string;
  brand: string;
  category: CampaignIndustry;
  location: string;
  format: string;
  image: string;
  description?: string;
}

export interface CampaignPlanItem {
  siteId: string;
  title: string;
  city: string;
  area: string;
  addedAt: string;
}
