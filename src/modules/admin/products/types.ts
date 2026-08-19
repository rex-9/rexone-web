export type AdminProductCycle = "" | "month" | "year";

export interface IAdminProduct {
  id: string;
  name: string;
  description?: string | null;
  price: string;
  price_unit_amount: number;
  currency: string;
  cycle: AdminProductCycle | null;
  period_label: string;
  recurring: boolean;
  free: boolean;
  active: boolean;
  stripe_product_id: string;
  stripe_price_id: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface IAdminProductFormValues {
  name: string;
  description?: string;
  price_unit_amount: number;
  currency: string;
  cycle?: AdminProductCycle;
  active: boolean;
}

export interface IAdminProductListParams {
  page?: number;
  limit?: number;
}
