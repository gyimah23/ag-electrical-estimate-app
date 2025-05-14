

export interface MaterialItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  price: number;
  brand?: string;
  isCable: boolean;
}

export interface EstimateData {
  clientName: string;
  clientEmail: string;
  items: MaterialItem[];
  date: string;
  estimateNumber: string;
  currency: string;
}

export type CableStandard = "Nexans" | "RR" | "Reroy" | "CABSTAR" | "TROPICAL CABLES" | "Other";

export type CurrencyType = "$" | "€" | "£" | "¥" | "₹" | "₣" | "GHS";

