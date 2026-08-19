import React, { useState } from "react";
import {
  AdminProductCycle,
  IAdminProduct,
  IAdminProductFormValues,
} from "../types";
import {
  AdminFormShell,
  FormActionRow,
  TextInput,
} from "../../../../design/components";

type ProductPriceMode = "paid" | "free";

interface AdminProductFormProps {
  mode: "create" | "edit";
  product?: IAdminProduct | null;
  isSubmitting: boolean;
  onSubmit: (values: IAdminProductFormValues) => void;
  onCancel: () => void;
}

const initialValues: IAdminProductFormValues = {
  name: "",
  description: "",
  price_unit_amount: 1000,
  currency: "usd",
  cycle: "month",
  active: true,
};

const buildInitialValues = (
  product?: IAdminProduct | null,
): IAdminProductFormValues => {
  if (!product) return initialValues;

  return {
    name: product.name || "",
    description: product.description || "",
    price_unit_amount: product.price_unit_amount,
    currency: product.currency || "usd",
    cycle: product.cycle || "",
    active: product.active,
  };
};

export const AdminProductForm: React.FC<AdminProductFormProps> = ({
  mode,
  product,
  isSubmitting,
  onSubmit,
  onCancel,
}) => {
  const [values, setValues] = useState<IAdminProductFormValues>(() =>
    buildInitialValues(product),
  );
  const [priceMode, setPriceMode] = useState<ProductPriceMode>(() =>
    product?.free || product?.price_unit_amount === 0 ? "free" : "paid",
  );

  const isFree = priceMode === "free";

  const updateValue = (
    field: keyof IAdminProductFormValues,
    value: string | number | boolean,
  ) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const updatePriceMode = (mode: ProductPriceMode) => {
    setPriceMode(mode);
    setValues((current) => ({
      ...current,
      price_unit_amount:
        mode === "free"
          ? 0
          : current.price_unit_amount > 0
            ? current.price_unit_amount
            : initialValues.price_unit_amount,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSubmit({
      name: values.name.trim(),
      description: values.description?.trim() || "",
      price_unit_amount: isFree ? 0 : Number(values.price_unit_amount),
      currency: values.currency,
      cycle: values.cycle || "",
      active: values.active,
    });
  };

  return (
    <AdminFormShell>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-16 md:grid-cols-2">
          <TextInput
            label="Product name"
            value={values.name}
            required
            onChange={(event) => updateValue("name", event.target.value)}
          />
          <div className="flex flex-col">
            <label className="mb-4 text-body-s font-medium text-base-content">
              Price type
            </label>
            <div className="grid gap-8 sm:grid-cols-2">
              {(["paid", "free"] as const).map((option) => (
                <label
                  key={option}
                  className="flex min-h-[52px] items-center gap-8 rounded-md border border-base-300 bg-base-100 px-12 text-body-s font-medium text-base-content"
                >
                  <input
                    type="radio"
                    name="price_type"
                    className="radio radio-sm border-base-content/40 checked:border-gold-500 checked:bg-gold-500"
                    checked={priceMode === option}
                    onChange={() => updatePriceMode(option)}
                  />
                  <span>{option === "paid" ? "Paid product" : "Free product"}</span>
                </label>
              ))}
            </div>
          </div>
          <TextInput
            label="Amount in cents"
            type="number"
            min={isFree ? 0 : 1}
            step={1}
            value={isFree ? 0 : values.price_unit_amount}
            required={!isFree}
            disabled={isFree}
            onChange={(event) =>
              updateValue("price_unit_amount", Number(event.target.value))
            }
          />
          <TextInput
            label="Description"
            value={values.description}
            onChange={(event) => updateValue("description", event.target.value)}
          />
          <div className="flex flex-col">
            <label className="mb-4 text-body-s font-medium text-base-content">
              Currency
            </label>
            <select
              className="select select-bordered h-[52px] rounded-md border-2 border-base-300 bg-base-100 px-16 text-body-m text-base-content focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
              value={values.currency}
              onChange={(event) => updateValue("currency", event.target.value)}
            >
              <option value="usd">USD</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="mb-4 text-body-s font-medium text-base-content">
              Billing cycle
            </label>
            <select
              className="select select-bordered h-[52px] rounded-md border-2 border-base-300 bg-base-100 px-16 text-body-m text-base-content focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
              value={values.cycle || ""}
              onChange={(event) =>
                updateValue("cycle", event.target.value as AdminProductCycle)
              }
            >
              <option value="">One-time</option>
              <option value="month">Monthly</option>
              <option value="year">Yearly</option>
            </select>
          </div>
          <label className="flex min-h-[52px] items-center gap-10 rounded-md border border-base-300 px-12 text-body-s font-medium text-base-content md:self-end">
            <input
              type="checkbox"
              className="toggle toggle-sm border-base-content/40 checked:border-gold-500 checked:bg-gold-500"
              checked={values.active}
              onChange={(event) => updateValue("active", event.target.checked)}
            />
            <span>Active</span>
          </label>
        </div>

        <FormActionRow
          submitLabel={mode === "create" ? "Create product" : "Save changes"}
          isSubmitting={isSubmitting}
          onCancel={onCancel}
        />
      </form>
    </AdminFormShell>
  );
};
