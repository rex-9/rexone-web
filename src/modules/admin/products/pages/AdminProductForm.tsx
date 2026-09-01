// src/modules/admin/products/pages/AdminProductForm.tsx

import React, { useState } from "react";
import {
  AdminProductCycle,
  IAdminProduct,
  IAdminProductFormValues,
} from "../types";
import { ProductPriceMode } from "../productForm.utils";
import {
  Checkbox,
  Dropdown,
  FormActionRow,
  FormContainer,
  Radio,
  TextInput,
} from "../../components";
import { ADMIN_ACTIONS, ADMIN_COMMON_LABELS } from "../../constants";
import { PRODUCT_CURRENCY, PRODUCT_CYCLE, PRODUCT_TYPE } from "../constants";

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
  PRODUCT_CODE: "Product code",
  SAVE_CHANGES: "Save changes",
} as const;

const ADMIN_PRODUCT_FORM_VALIDATION_MESSAGES = {
  DESCRIPTION_REQUIRED: "Description is required.",
  CODE_INVALID:
    "Product code must be exactly 10 alphanumeric characters without special characters.",
} as const;

interface IAdminProductFormProps {
  mode: typeof ADMIN_ACTIONS.CREATE | typeof ADMIN_ACTIONS.EDIT;
  product?: IAdminProduct | null;
  onSubmit: (values: IAdminProductFormValues) => void;
  onCancel: () => void;
}

const initialValues: IAdminProductFormValues = {
  code: "",
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
    code: product.code || "",
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
  const [codeError, setCodeError] = useState("");

  const isInitiallyFree =
    mode === ADMIN_ACTIONS.EDIT &&
    (product?.free || product?.price_unit_amount === 0);
  const isFree = priceMode === PRODUCT_TYPE.FREE;

  const updateValue = (
    field: keyof IAdminProductFormValues,
    value: string | number | boolean,
  ) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const updatePriceMode = (nextMode: ProductPriceMode) => {
    if (isInitiallyFree && nextMode === PRODUCT_TYPE.PREMIUM) {
      return;
    }

    setPriceMode(nextMode);
    setValues((current) => ({
      ...current,
      price_unit_amount:
        nextMode === PRODUCT_TYPE.FREE
          ? 0
          : current.price_unit_amount > 0
            ? current.price_unit_amount
            : initialValues.price_unit_amount,
      cycle:
        nextMode === PRODUCT_TYPE.FREE
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

    const code = values.code?.trim();
    if (code && !/^[A-Za-z0-9]{10}$/.test(code)) {
      setCodeError(ADMIN_PRODUCT_FORM_VALIDATION_MESSAGES.CODE_INVALID);
      return;
    }

    setDescriptionError("");
    setCodeError("");

    onSubmit({
      code: code || undefined,
      name: values.name.trim(),
      description,
      price_unit_amount: isFree ? 0 : Number(values.price_unit_amount),
      currency: values.currency,
      cycle: isFree
        ? PRODUCT_CYCLE.ONE_TIME
        : values.cycle || PRODUCT_CYCLE.ONE_TIME,
      active: values.active,
    });
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
          <TextInput
            label={ADMIN_PRODUCT_FORM_LABELS.PRODUCT_CODE}
            placeholder={
              mode === ADMIN_ACTIONS.CREATE
                ? "Leave blank to auto-generate"
                : "e.g. A1b2C3d4E5"
            }
            value={values.code || ""}
            maxLength={10}
            disabled={mode === ADMIN_ACTIONS.EDIT}
            error={codeError}
            onChange={(event) => {
              updateValue("code", event.target.value);
              if (codeError) setCodeError("");
            }}
          />
          <p className="mt-1 text-caption text-base-content opacity-60">
            {mode === ADMIN_ACTIONS.CREATE
              ? "Optional 10-character alphanumeric code. Auto-generated if left blank."
              : "🔒 Product code is permanent and cannot be modified."}
          </p>
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-body-s font-medium text-base-content">
            {ADMIN_PRODUCT_FORM_LABELS.PRICE_TYPE}
          </label>
          <div className="grid gap-2 sm:grid-cols-2">
            {[PRODUCT_TYPE.PREMIUM, PRODUCT_TYPE.FREE].map((option) => {
              const isDisabled =
                isInitiallyFree && option === PRODUCT_TYPE.PREMIUM;

              return (
                <Radio
                  key={option}
                  name="price_type"
                  checked={priceMode === option}
                  disabled={isDisabled}
                  onChange={() => updatePriceMode(option)}
                  containerClassName={
                    isDisabled
                      ? "min-h-10 bg-base-200 opacity-50 cursor-not-allowed"
                      : "min-h-10 bg-base-100"
                  }
                >
                  {option === PRODUCT_TYPE.PREMIUM
                    ? ADMIN_PRODUCT_FORM_LABELS.PAID_PRODUCT
                    : ADMIN_PRODUCT_FORM_LABELS.FREE_PRODUCT}
                </Radio>
              );
            })}
          </div>
          {isInitiallyFree && (
            <p className="mt-1 text-caption text-base-content opacity-60">
              Free products cannot be converted to premium products.
            </p>
          )}
          {!isInitiallyFree && mode === ADMIN_ACTIONS.EDIT && isFree && (
            <p className="mt-1 text-caption text-amber-500 font-medium">
              ⚠️ Converting this product to Free is permanent and will detach
              payment provider handling... such as Stripe.
            </p>
          )}
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

        <Dropdown
          label={ADMIN_PRODUCT_FORM_LABELS.CURRENCY}
          value={values.currency}
          onValueChange={(val) => updateValue("currency", val)}
          options={[{ value: PRODUCT_CURRENCY.USD, label: "USD" }]}
        />

        <div>
          <Dropdown
            label={ADMIN_PRODUCT_FORM_LABELS.BILLING_CYCLE}
            value={
              isFree
                ? PRODUCT_CYCLE.ONE_TIME
                : values.cycle || PRODUCT_CYCLE.ONE_TIME
            }
            disabled={isFree}
            onValueChange={(val) =>
              updateValue("cycle", val as AdminProductCycle)
            }
            options={[
              { value: PRODUCT_CYCLE.ONE_TIME, label: "One-time" },
              { value: PRODUCT_CYCLE.MONTH, label: "Monthly" },
              { value: PRODUCT_CYCLE.YEAR, label: "Yearly" },
            ]}
          />
          {isFree && (
            <p className="mt-1 text-caption text-base-content opacity-60">
              Free products are always one-time and cannot be recurring.
            </p>
          )}
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
