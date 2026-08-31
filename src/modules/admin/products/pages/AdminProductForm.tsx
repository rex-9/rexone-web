import React, { useState } from "react";
import {
  AdminProductCycle,
  IAdminProduct,
  IAdminProductFormValues,
} from "../types";
import { ProductPriceMode } from "../productForm.utils";
import { Checkbox, FormActionRow, FormContainer, Radio, TextInput } from "../../components";
import { ADMIN_ACTIONS, ADMIN_COMMON_LABELS } from "../../constants";
import {
  PRODUCT_CURRENCY,
  PRODUCT_CYCLE,
  PRODUCT_TYPE,
} from "../constants";

const ADMIN_PRODUCT_FORM_LABELS = {
  ACTIVE: "Active",
  AMOUNT_IN_CENTS: "Amount in cents",
  BILLING_CYCLE: "Billing cycle",
  CREATE_PRODUCT: "Create product",
  CURRENCY: "Currency",
  DESCRIPTION: "Description",
  FREE_PRODUCT: "Free product",
  PAID_PRODUCT: "Paid product",
  PRICE_TYPE: "Price type",
  PRODUCT_NAME: "Product name",
  SAVE_CHANGES: "Save changes",
} as const;

const ADMIN_PRODUCT_FORM_VALIDATION_MESSAGES = {
  DESCRIPTION_REQUIRED: "Description is required.",
} as const;

interface IAdminProductFormProps {
  mode: typeof ADMIN_ACTIONS.CREATE | typeof ADMIN_ACTIONS.EDIT;
  product?: IAdminProduct | null;
  onSubmit: (values: IAdminProductFormValues) => void;
  onCancel: () => void;
}

const initialValues: IAdminProductFormValues = {
  name: "",
  description: "",
  price_unit_amount: 1000,
  currency: PRODUCT_CURRENCY.USD,
  cycle: PRODUCT_CYCLE.MONTH,
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
    currency: product.currency || PRODUCT_CURRENCY.USD,
    cycle: product.cycle || PRODUCT_CYCLE.ONE_TIME,
    active: product.active,
  };
};

export const AdminProductForm: React.FC<IAdminProductFormProps> = ({
  mode,
  product,
  onSubmit,
  onCancel,
}) => {
  const [values, setValues] = useState<IAdminProductFormValues>(() =>
    buildInitialValues(product),
  );
  const [priceMode, setPriceMode] = useState<ProductPriceMode>(() =>
    product?.free || product?.price_unit_amount === 0
      ? PRODUCT_TYPE.FREE
      : PRODUCT_TYPE.PREMIUM,
  );
  const [descriptionError, setDescriptionError] = useState("");

  const isFree = priceMode === PRODUCT_TYPE.FREE;

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
        mode === PRODUCT_TYPE.FREE
          ? 0
          : current.price_unit_amount > 0
            ? current.price_unit_amount
            : initialValues.price_unit_amount,
      cycle:
        mode === PRODUCT_TYPE.FREE
          ? PRODUCT_CYCLE.ONE_TIME
          : current.cycle || initialValues.cycle,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const description = values.description.trim();

    if (!description) {
      setDescriptionError(
        ADMIN_PRODUCT_FORM_VALIDATION_MESSAGES.DESCRIPTION_REQUIRED,
      );
      return;
    }

    setDescriptionError("");
    if(isFree){
      onSubmit({
      name: values.name.trim(),
      description,
      price_unit_amount: isFree ? 0 : Number(values.price_unit_amount),
      currency: values.currency,
      active: values.active,
    });
    }else{
      onSubmit({
      name: values.name.trim(),
      description,
      price_unit_amount: isFree ? 0 : Number(values.price_unit_amount),
      currency: values.currency,
      cycle: isFree
        ? PRODUCT_CYCLE.ONE_TIME
        : values.cycle || PRODUCT_CYCLE.ONE_TIME,
      active: values.active,
    });
    }
    
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <TextInput
          label={ADMIN_PRODUCT_FORM_LABELS.PRODUCT_NAME}
          value={values.name}
          required
          onChange={(event) => updateValue("name", event.target.value)}
        />
        <div className="flex flex-col">
          <label className="mb-1 text-body-s font-medium text-base-content">
            {ADMIN_PRODUCT_FORM_LABELS.PRICE_TYPE}
          </label>
          <div className="grid gap-2 sm:grid-cols-2">
            {[PRODUCT_TYPE.PREMIUM, PRODUCT_TYPE.FREE].map((option) => (
              <Radio
                key={option}
                name="price_type"
                checked={priceMode === option}
                onChange={() => updatePriceMode(option)}
                containerClassName="min-h-10 bg-base-100"
              >
                {option === PRODUCT_TYPE.PREMIUM
                  ? ADMIN_PRODUCT_FORM_LABELS.PAID_PRODUCT
                  : ADMIN_PRODUCT_FORM_LABELS.FREE_PRODUCT}
              </Radio>
            ))}
          </div>
        </div>
        <TextInput
          label={ADMIN_PRODUCT_FORM_LABELS.AMOUNT_IN_CENTS}
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
          label={ADMIN_PRODUCT_FORM_LABELS.DESCRIPTION}
          value={values.description}
          required
          error={descriptionError}
          onChange={(event) => {
            updateValue("description", event.target.value);
            if (descriptionError) setDescriptionError("");
          }}
        />
        <div className="flex flex-col">
          <label className="mb-1 text-body-s font-medium text-base-content">
            {ADMIN_PRODUCT_FORM_LABELS.CURRENCY}
          </label>
          <select
            className="select select-bordered h-10 w-full rounded-md border-2 border-base-300 bg-base-100 px-3 text-body-m text-base-content focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
            value={values.currency}
            onChange={(event) => updateValue("currency", event.target.value)}
          >
            <option value={PRODUCT_CURRENCY.USD}>USD</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-body-s font-medium text-base-content">
            {ADMIN_PRODUCT_FORM_LABELS.BILLING_CYCLE}
          </label>
          <select
            className="select select-bordered h-10 w-full rounded-md border-2 border-base-300 bg-base-100 px-3 text-body-m text-base-content disabled:cursor-not-allowed disabled:opacity-50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
            value={
              isFree
                ? PRODUCT_CYCLE.ONE_TIME
                : values.cycle || PRODUCT_CYCLE.ONE_TIME
            }
            disabled={isFree}
            onChange={(event) =>
              updateValue("cycle", event.target.value as AdminProductCycle)
            }
          >
            <option value={PRODUCT_CYCLE.ONE_TIME}>One-time</option>
            <option value={PRODUCT_CYCLE.MONTH}>Monthly</option>
            <option value={PRODUCT_CYCLE.YEAR}>Yearly</option>
          </select>
        </div>
        <Checkbox
          checked={values.active}
          onChange={(event) => updateValue("active", event.target.checked)}
          containerClassName="min-h-10 md:self-end"
        >
          <span>{ADMIN_PRODUCT_FORM_LABELS.ACTIVE}</span>
        </Checkbox>
      </div>

      <FormActionRow
        cancelLabel={ADMIN_COMMON_LABELS.CANCEL}
        submitLabel={
          mode === ADMIN_ACTIONS.CREATE
            ? ADMIN_PRODUCT_FORM_LABELS.CREATE_PRODUCT
            : ADMIN_PRODUCT_FORM_LABELS.SAVE_CHANGES
        }
        onCancel={onCancel}
      />
    </FormContainer>
  );
};
