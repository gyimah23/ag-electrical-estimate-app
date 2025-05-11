
export interface MaterialItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  price: number;
}

export interface EstimateData {
  clientName: string;
  clientEmail: string;
  items: MaterialItem[];
  date: string;
  estimateNumber: string;
}
