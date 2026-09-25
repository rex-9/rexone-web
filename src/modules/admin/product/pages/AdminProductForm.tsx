// src/modules/admin/products/pages/AdminProductForm.tsx

import React, { useState } from "react";
import {
  AdminProductInterval,
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
import { Button, Image, NumberInput } from "../../../../design";
import { ButtonVariants, ComponentSizes } from "../../../../design/constants";
import { iconsLib } from "../../../../assets";
import { ADMIN_ACTIONS } from "../../constants";
import { PRODUCT_CURRENCY, PRODUCT_INTERVAL, PRODUCT_TYPE } from "../constants";
import {
  PAYMENT_CURRENCY_OPTIONS,
  getStripeMinimumAmount,
} from "../../../payment/constants";
import {
  formatPriceFeedback,
  getCurrencyDecimals,
  toMajorUnits,
  toSmallestUnits,
} from "../currency.utils";
import { useTranslate, AppLocales } from "../../../../locales";
import { AdminAssetSelectDialog } from "../../asset/components/AdminAssetSelectDialog";
import { ASSET_TYPES } from "../../asset/constants";

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
  unit_amount: 1000,
  currency: PRODUCT_CURRENCY.USD,
  interval: PRODUCT_INTERVAL.MONTH,
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
    unit_amount: product.unit_amount,
    currency: product.currency || PRODUCT_CURRENCY.USD,
    interval: product.interval || PRODUCT_INTERVAL.ONE_TIME,
    active: product.active,
  };
};

export const AdminProductForm: React.FC<IAdminProductFormProps> = ({
  mode,
  product,
  onSubmit,
  onCancel,
}) => {
  const t = useTranslate();
  const [values, setValues] = useState<IAdminProductFormValues>(() =>
    buildInitialValues(product),
  );
  const [priceMode, setPriceMode] = useState<ProductPriceMode>(() =>
    product?.free || product?.unit_amount === 0
      ? PRODUCT_TYPE.FREE
      : PRODUCT_TYPE.PREMIUM,
  );
  const isFree = priceMode === PRODUCT_TYPE.FREE;
  const [majorAmount, setMajorAmount] = useState<number>(() =>
    product?.free || product?.unit_amount === 0
      ? 0
      : toMajorUnits(
          product?.unit_amount ?? initialValues.unit_amount,
          product?.currency || PRODUCT_CURRENCY.USD,
        ),
  );
  const [descriptionError, setDescriptionError] = useState("");
  const [codeError, setCodeError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [thumbnailAssetId, setThumbnailAssetId] = useState<string | null>(
    product?.thumbnail_asset_id ?? null,
  );
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(
    product?.thumbnail_url ?? null,
  );
  const [isAssetPickerOpen, setIsAssetPickerOpen] = useState(false);

  const isEditMode = mode === ADMIN_ACTIONS.EDIT;
  const minLimit = getStripeMinimumAmount(values.currency);

  const updateValue = (
    field: keyof IAdminProductFormValues,
    value: string | number | boolean,
  ) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const updatePriceMode = (nextMode: ProductPriceMode) => {
    if (isEditMode) {
      return;
    }

    setPriceMode(nextMode);
    setPriceError("");
    const nextSmallest =
      nextMode === PRODUCT_TYPE.FREE
        ? 0
        : values.unit_amount >= minLimit
          ? values.unit_amount
          : Math.max(initialValues.unit_amount, minLimit);

    setMajorAmount(toMajorUnits(nextSmallest, values.currency));
    setValues((current) => ({
      ...current,
      unit_amount: nextSmallest,
      interval:
        nextMode === PRODUCT_TYPE.FREE
          ? PRODUCT_INTERVAL.ONE_TIME
          : current.interval || initialValues.interval,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const description = values.description.trim();
    if (!description) {
      setDescriptionError(
        t(AppLocales.Admin.Products.Form.DescriptionPlaceholder),
      );
      return;
    }

    const code = values.code?.trim();
    if (code && !/^[A-Za-z0-9]{10}$/.test(code)) {
      setCodeError(t(AppLocales.Admin.Products.Form.CodePlaceholder));
      return;
    }

    const smallestAmount = isFree
      ? 0
      : toSmallestUnits(majorAmount, values.currency);

    if (!isFree && smallestAmount < minLimit) {
      setPriceError(
        t(AppLocales.Admin.Products.Form.MinPriceError, {
          amount: minLimit,
          formatted: `${toMajorUnits(minLimit, values.currency)} ${values.currency.toUpperCase()}`,
        }),
      );
      return;
    }

    setDescriptionError("");
    setCodeError("");
    setPriceError("");

    onSubmit({
      code: code || undefined,
      name: values.name.trim(),
      description,
      unit_amount: smallestAmount,
      currency: values.currency,
      interval: isFree
        ? PRODUCT_INTERVAL.ONE_TIME
        : values.interval || PRODUCT_INTERVAL.ONE_TIME,
      active: values.active,
      thumbnail_asset_id: thumbnailAssetId,
    });
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      {/* Thumbnail Selection Card */}
      <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl border border-base-200 bg-base-100 mb-2">
        <div className="w-28 h-20 rounded-lg overflow-hidden border border-base-300 bg-base-200 shrink-0 flex items-center justify-center">
          <Image
            src={thumbnailUrl || ""}
            alt={values.name || "Product Thumbnail"}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 text-center sm:text-left space-y-1">
          <span className="text-sm font-semibold text-base-content block">
            {t(AppLocales.Admin.Products.Form.ThumbnailLabel)}
          </span>
          <span className="text-xs text-base-content/60 block">
            {t(AppLocales.Admin.Products.Form.ThumbnailHelper)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={ButtonVariants.SECONDARY}
            size={ComponentSizes.SM}
            onClick={() => setIsAssetPickerOpen(true)}
          >
            <iconsLib.photo className="w-4 h-4 mr-1.5" />
            {t(AppLocales.Admin.Products.Form.ChooseThumbnail)}
          </Button>
          {(thumbnailUrl || thumbnailAssetId) && (
            <Button
              variant={ButtonVariants.TERTIARY}
              size={ComponentSizes.SM}
              className="text-error hover:bg-error/10"
              onClick={() => {
                setThumbnailAssetId("");
                setThumbnailUrl(null);
              }}
            >
              <iconsLib.trash className="w-4 h-4 mr-1" />
              {t(AppLocales.Admin.Products.Form.RemoveThumbnail)}
            </Button>
          )}
        </div>
      </div>

      <AdminAssetSelectDialog
        isOpen={isAssetPickerOpen}
        onClose={() => setIsAssetPickerOpen(false)}
        assetType={ASSET_TYPES.THUMBNAIL}
        selectedAssetId={thumbnailAssetId}
        onSelect={(asset) => {
          setThumbnailAssetId(asset.id);
          setThumbnailUrl(asset.url);
        }}
      />
      <div className="grid gap-4 md:grid-cols-2">
        <TextInput
          label={t(AppLocales.Admin.Products.Form.NameLabel)}
          placeholder={t(AppLocales.Admin.Products.Form.NamePlaceholder)}
          value={values.name}
          required
          onChange={(event) => updateValue("name", event.target.value)}
        />

        <div className="flex flex-col">
          <TextInput
            label={t(AppLocales.Admin.Products.Form.CodeLabel)}
            placeholder={
              mode === ADMIN_ACTIONS.CREATE
                ? t(AppLocales.Admin.Products.Form.CodePlaceholder)
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
            {t(AppLocales.Admin.Products.Form.PriceLabel)}
          </label>
          <div className="grid gap-2 sm:grid-cols-2">
            {[PRODUCT_TYPE.PREMIUM, PRODUCT_TYPE.FREE].map((option) => {
              const isDisabled = isEditMode;

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
                    ? "Paid Product"
                    : "Free Product"}
                </Radio>
              );
            })}
          </div>
          {isEditMode && (
            <p className="mt-1 text-caption text-base-content opacity-60">
              🔒 Product pricing type ({isFree ? "Free" : "Paid"}) cannot be
              changed after creation.
            </p>
          )}
        </div>

        <div className="flex flex-col">
          <NumberInput
            label={t(AppLocales.Admin.Products.Form.PriceLabel)}
            min={isFree ? 0 : toMajorUnits(minLimit, values.currency)}
            step={getCurrencyDecimals(values.currency) === 0 ? 1 : 0.01}
            value={isFree ? 0 : majorAmount}
            required={!isFree}
            disabled={isFree}
            allowDecimals={getCurrencyDecimals(values.currency) > 0}
            error={priceError}
            helperText={
              isFree
                ? undefined
                : t(AppLocales.Admin.Products.Form.MinPriceHelper, {
                    amount: minLimit,
                    formatted: `${toMajorUnits(minLimit, values.currency)} ${values.currency.toUpperCase()}`,
                  })
            }
            onChange={(val) => {
              const nextMajor = val ?? 0;
              setMajorAmount(nextMajor);
              updateValue(
                "unit_amount",
                toSmallestUnits(nextMajor, values.currency),
              );
              if (priceError) setPriceError("");
            }}
          />
          {!isFree && (
            <div className="mt-1 text-xs text-base-content/70 font-mono">
              💡 {formatPriceFeedback(majorAmount, values.currency)}
            </div>
          )}
        </div>

        <TextInput
          label={t(AppLocales.Admin.Products.Form.DescriptionLabel)}
          placeholder={t(AppLocales.Admin.Products.Form.DescriptionPlaceholder)}
          value={values.description}
          required
          error={descriptionError}
          onChange={(event) => {
            updateValue("description", event.target.value);
            if (descriptionError) setDescriptionError("");
          }}
        />

        <Dropdown
          label={t(AppLocales.Admin.Products.Form.CurrencyLabel)}
          value={values.currency}
          disabled={isEditMode}
          onValueChange={(val) => {
            updateValue("currency", val);
            const nextMin = getStripeMinimumAmount(val);
            const currentSmallest = toSmallestUnits(majorAmount, val);
            if (currentSmallest < nextMin) {
              const defaultMajor = toMajorUnits(nextMin, val);
              setMajorAmount(defaultMajor);
              updateValue("unit_amount", nextMin);
            } else {
              updateValue("unit_amount", currentSmallest);
            }
            if (priceError) setPriceError("");
          }}
          options={PAYMENT_CURRENCY_OPTIONS.map((opt) => ({
            value: opt.value,
            label: opt.label,
          }))}
        />

        <div>
          <Dropdown
            label={t(AppLocales.Admin.Products.Form.IntervalLabel)}
            value={
              isFree
                ? PRODUCT_INTERVAL.ONE_TIME
                : values.interval || PRODUCT_INTERVAL.ONE_TIME
            }
            disabled={isFree}
            onValueChange={(val) =>
              updateValue("interval", val as AdminProductInterval)
            }
            options={[
              {
                value: PRODUCT_INTERVAL.ONE_TIME,
                label: t(AppLocales.Admin.Products.Form.IntervalOneTime),
              },
              {
                value: PRODUCT_INTERVAL.DAY,
                label: t(AppLocales.Admin.Products.Form.IntervalDaily),
              },
              {
                value: PRODUCT_INTERVAL.WEEK,
                label: t(AppLocales.Admin.Products.Form.IntervalWeekly),
              },
              {
                value: PRODUCT_INTERVAL.MONTH,
                label: t(AppLocales.Admin.Products.Form.IntervalMonthly),
              },
              {
                value: PRODUCT_INTERVAL.YEAR,
                label: t(AppLocales.Admin.Products.Form.IntervalYearly),
              },
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
          <span>{t(AppLocales.Admin.Products.Form.ActiveForPurchase)}</span>
        </Checkbox>
      </div>

      <FormActionRow
        cancelLabel={t(AppLocales.Admin.Common.Actions.Cancel)}
        submitLabel={
          mode === ADMIN_ACTIONS.CREATE
            ? t(AppLocales.Admin.Products.Form.CreateProduct)
            : t(AppLocales.Admin.Products.Form.SaveProduct)
        }
        onCancel={onCancel}
      />
    </FormContainer>
  );
};
