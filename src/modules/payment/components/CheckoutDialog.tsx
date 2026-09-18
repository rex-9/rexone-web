import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Dialog } from "../../../design/components/overlay";
import { Button, Badge } from "../../../design/components";
import { TextInput } from "../../../design/components/form";
import {
  ButtonVariants,
  BadgeVariants,
  ComponentSizes,
} from "../../../design/constants";
import { iconsLib } from "../../../assets";
import { AppLocales } from "../../../locales/app_locales";
import { IProduct, ICouponValidationResult } from "../types";
import PaymentController from "../payment.controller";
import { useToast } from "../../../contexts/ToastContext";
import { useCountdown } from "../../../hooks";

interface ICheckoutDialogProps {
  product: IProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const formatMoney = (cents: number, currency: string = "usd") => {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
};

export const CheckoutDialog: React.FC<ICheckoutDialogProps> = ({
  product,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const { success, error: toastError } = useToast();
  const [couponCode, setCouponCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] =
    useState<ICouponValidationResult | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState<number>(3);

  // Cooldown countdown hook
  const cooldown = useCountdown(0);

  // Reset attempts when cooldown expires
  const prevCooldownActiveRef = useRef(cooldown.isActive);
  useEffect(() => {
    if (prevCooldownActiveRef.current && !cooldown.isActive) {
      setRemainingAttempts(3);
      setCouponError(null);
    }
    prevCooldownActiveRef.current = cooldown.isActive;
  }, [cooldown.isActive]);

  // Reset state when opening with a new product or closing
  useEffect(() => {
    if (isOpen) {
      setCouponCode("");
      setValidationResult(null);
      setCouponError(null);
      setIsSubmitting(false);
      setRemainingAttempts(3);
    }
  }, [isOpen, product?.id]);

  if (!product) return null;

  const handleCouponFailure = (result: {
    error?: string;
    remaining_attempts?: number;
    cooldown_remaining?: number;
  }) => {
    setValidationResult(null);
    if (result.cooldown_remaining && result.cooldown_remaining > 0) {
      const targetTimeMs = Date.now() + result.cooldown_remaining * 1000;
      cooldown.startAt(targetTimeMs);
      setRemainingAttempts(0);
      setCouponError(
        t(AppLocales.Payment.CheckoutDialog.TooManyAttempts, {
          seconds: result.cooldown_remaining,
        }),
      );
    } else if (result.remaining_attempts !== undefined) {
      setRemainingAttempts(result.remaining_attempts);
      setCouponError(
        result.error || t(AppLocales.Payment.CheckoutDialog.InvalidCode),
      );
    } else {
      setCouponError(
        result.error || t(AppLocales.Payment.CheckoutDialog.InvalidCode),
      );
    }
  };

  const handleApplyCoupon = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (cooldown.isActive) return;

    const cleanCode = couponCode.trim().toUpperCase();
    if (!cleanCode) return;

    setIsValidating(true);
    setCouponError(null);

    const result = await PaymentController.validateCoupon(cleanCode, product.id);
    setIsValidating(false);

    if (result.success && result.data) {
      setValidationResult(result.data);
      setCouponError(null);
      setRemainingAttempts(3);
      cooldown.clear();
    } else {
      handleCouponFailure(result);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setValidationResult(null);
    setCouponError(null);
  };

  const handleCheckout = async () => {
    const cleanCode = couponCode.trim().toUpperCase();
    let appliedCode: string | undefined;

    // If a coupon code is entered, validate before proceeding
    if (cleanCode) {
      if (validationResult?.valid && validationResult.coupon?.code === cleanCode) {
        appliedCode = validationResult.coupon.code;
      } else {
        // Auto-validate unapplied coupon before proceeding to prevent unintended full-price charges
        if (cooldown.isActive) return;

        setIsValidating(true);
        setCouponError(null);

        const valResult = await PaymentController.validateCoupon(
          cleanCode,
          product.id,
        );
        setIsValidating(false);

        if (valResult.success && valResult.data) {
          setValidationResult(valResult.data);
          setRemainingAttempts(3);
          cooldown.clear();
          appliedCode = valResult.data.coupon?.code || cleanCode;
        } else {
          handleCouponFailure(valResult);
          return; // STOP! Halt checkout on invalid coupon so user is not charged full price!
        }
      }
    }

    setIsSubmitting(true);
    const result = await PaymentController.createCheckout(
      product.id,
      appliedCode,
    );
    setIsSubmitting(false);

    if (result.success) {
      if (result.freeAccessGranted) {
        success(t(AppLocales.Payment.CheckoutDialog.FreeClaimed));
        onSuccess();
        onClose();
        return;
      }

      if (result.checkoutUrl) {
        success(t(AppLocales.Payment.CheckoutDialog.Redirecting));
        window.location.assign(result.checkoutUrl);
        return;
      }
    }

    toastError(result.error || t(AppLocales.Payment.Errors.CreateCheckout));
  };

  const isFreeGrant =
    product.free ||
    (validationResult?.valid && validationResult.final_amount === 0);

  const originalPriceDisplay = product.price;
  const finalPriceDisplay =
    validationResult && validationResult.final_amount !== undefined
      ? formatMoney(validationResult.final_amount, validationResult.currency || product.currency)
      : originalPriceDisplay;

  const displayedError = cooldown.isActive
    ? t(AppLocales.Payment.CheckoutDialog.TooManyAttempts, {
        seconds: cooldown.secondsLeft,
      })
    : couponError
    ? remainingAttempts < 3
      ? `${couponError} (${t(AppLocales.Payment.CheckoutDialog.AttemptsRemaining, {
          attempts: remainingAttempts,
        })})`
      : couponError
    : null;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={t(AppLocales.Payment.CheckoutDialog.Title)}
      className="max-w-lg"
    >
      <div className="space-y-6">
        {/* Product Summary */}
        <div className="bg-base-200/50 rounded-xl p-4 border border-base-300">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg text-base-content font-primary">
                {product.name}
              </h3>
              <p className="text-body-s text-base-content/70 mt-1">
                {product.description}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-base-content/60">
                {product.recurring
                  ? `${t(AppLocales.Payment.CheckoutDialog.Per)} ${product.period_label}`
                  : t(AppLocales.Payment.CheckoutDialog.OneTime)}
              </span>
            </div>
          </div>
        </div>

        {/* Promo / Referral Code Input */}
        <div className="space-y-2">
          <label className="text-body-s font-semibold text-base-content flex items-center gap-1.5">
            <iconsLib.tag className="w-4 h-4 text-primary" />
            {t(AppLocales.Payment.CheckoutDialog.PromoCode)}
          </label>

          {validationResult?.valid ? (
            <div className="flex items-center justify-between p-3 rounded-lg bg-success/10 border border-success/30">
              <div className="flex items-center gap-2">
                <Badge variant={BadgeVariants.SUCCESS} size={ComponentSizes.MD}>
                  ✓ {validationResult.coupon?.code}
                </Badge>
                <span className="text-xs font-medium text-success">
                  {validationResult.coupon?.title} (
                  {validationResult.coupon?.coupon_type === "percentage"
                    ? `${validationResult.coupon.amount}% ${t(AppLocales.Payment.CheckoutDialog.Off)}`
                    : `${formatMoney(validationResult.coupon?.amount || 0, validationResult.currency || product.currency)} ${t(AppLocales.Payment.CheckoutDialog.Off)}`}
                  )
                </span>
              </div>
              <button
                type="button"
                onClick={handleRemoveCoupon}
                className="text-xs text-error hover:underline flex items-center gap-1"
              >
                <iconsLib.close className="w-3.5 h-3.5" />
                {t(AppLocales.Payment.CheckoutDialog.Remove)}
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleApplyCoupon}
              className="flex items-center gap-2"
            >
              <div className="flex-1">
                <TextInput
                  placeholder={t(AppLocales.Payment.CheckoutDialog.PromoCodePlaceholder)}
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value.toUpperCase());
                    if (couponError) setCouponError(null);
                  }}
                  className="font-mono uppercase tracking-wider"
                  disabled={isValidating || isSubmitting || cooldown.isActive}
                />
              </div>
              <Button
                type="submit"
                variant={ButtonVariants.SECONDARY}
                size={ComponentSizes.MD}
                disabled={!couponCode.trim() || isValidating || isSubmitting || cooldown.isActive}
                className="px-5"
              >
                {isValidating
                  ? t(AppLocales.Payment.CheckoutDialog.Checking)
                  : t(AppLocales.Payment.CheckoutDialog.Apply)}
              </Button>
            </form>
          )}

          {displayedError && (
            <p className="text-xs text-error mt-1 flex items-center gap-1">
              <span>⚠️</span> {displayedError}
            </p>
          )}
        </div>

        {/* Price Breakdown */}
        <div className="border-t border-base-300 pt-4 space-y-2">
          <div className="flex justify-between text-body-s text-base-content/70">
            <span>{t(AppLocales.Payment.CheckoutDialog.Subtotal)}</span>
            <span className={validationResult?.valid ? "line-through opacity-60" : ""}>
              {originalPriceDisplay}
            </span>
          </div>

          {validationResult?.valid && (
            <div className="flex justify-between text-body-s text-success font-medium">
              <span>
                {t(AppLocales.Payment.CheckoutDialog.Discount)} (
                {validationResult.coupon?.code}
                )
              </span>
              <span>
                -
                {formatMoney(
                  validationResult.discount_amount || 0,
                  validationResult.currency || product.currency,
                )}
              </span>
            </div>
          )}

          <div className="border-t border-base-300 pt-2 flex justify-between items-baseline">
            <span className="font-bold text-base text-base-content">
              {t(AppLocales.Payment.CheckoutDialog.TotalDueToday)}
            </span>
            <div className="text-right">
              <span
                className={`text-2xl font-extrabold ${
                  isFreeGrant ? "text-success" : "text-primary"
                }`}
              >
                {isFreeGrant
                  ? `${t(AppLocales.Payment.CheckoutDialog.Free)} (${formatMoney(0, validationResult?.currency || product.currency)})`
                  : finalPriceDisplay}
              </span>
              {product.recurring && (
                <span className="text-xs text-base-content/60 ml-1">
                  /{product.period_label}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-2">
          <Button
            variant={ButtonVariants.PRIMARY}
            fullWidth
            size={ComponentSizes.LG}
            onClick={handleCheckout}
            disabled={
              isSubmitting ||
              isValidating ||
              (!!couponCode.trim() && !validationResult?.valid && cooldown.isActive)
            }
          >
            {isSubmitting
              ? t(AppLocales.Payment.CheckoutDialog.Processing)
              : isFreeGrant
              ? t(AppLocales.Payment.CheckoutDialog.ClaimFree)
              : t(AppLocales.Payment.CheckoutDialog.Proceed)}
          </Button>
          <Button
            variant={ButtonVariants.TERTIARY}
            fullWidth
            size={ComponentSizes.SM}
            onClick={onClose}
            disabled={isSubmitting}
          >
            {t(AppLocales.Common.Cancel)}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
