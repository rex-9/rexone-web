import { IAdminProductFormValues } from "./types";

export type ProductPriceMode = "paid" | "free";

export const buildProductPayload = (
  values: IAdminProductFormValues,
  priceMode: ProductPriceMode,
): IAdminProductFormValues => ({
  name: values.name.trim(),
  description: values.description?.trim() || "",
  price_unit_amount:
    priceMode === "free" ? 0 : Number(values.price_unit_amount),
  currency: values.currency,
  cycle: priceMode === "free" ? "" : values.cycle || "",
  active: values.active,
});
