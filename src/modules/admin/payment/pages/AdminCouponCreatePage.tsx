import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { iconsLib } from "../../../../assets";
import {
  Button,
  Dropdown,
} from "../../../../design";
import {
  ButtonVariants,
  ComponentSizes,
} from "../../../../design/constants";
import { TextInput, TextArea, Checkbox } from "../../../../design/components/form";
import { useLoading } from "../../../../contexts";
import { useDocumentTitle, usePermissions } from "../../../../hooks";
import { AppLocales } from "../../../../locales/app_locales";
import { PageHeader } from "../../components";
import { ADMIN_ACTIONS, ADMIN_RESOURCES } from "../../constants";
import PaymentController from "../payment.controller";
import ClientPaymentController from "../../../payment/payment.controller";
import RoleController from "../../role/role.controller";
import type { IProduct } from "../../../payment/types";
import type { IAdminRole } from "../../role/types";
import { useToast } from "../../../../contexts/ToastContext";
import {
  COUPON_TYPES,
  MAX_PERCENTAGE_DISCOUNT,
  PAYMENT_CURRENCIES,
  PAYMENT_CURRENCY_OPTIONS,
  type TCouponType,
} from "../../../payment/constants";

export const AdminCouponCreatePage: React.FC = () => {
  const { t } = useTranslation();
  useDocumentTitle(t(AppLocales.Admin.Coupons.CreateTitle));
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();
  const { isLoading, setLoading } = useLoading();
  const { can, isLoading: permissionsLoading } = usePermissions();

  const canReadRoles = can(ADMIN_ACTIONS.READ, ADMIN_RESOURCES.ROLES);

  const [isBatch, setIsBatch] = useState(false);

  // Form Fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [batchCount, setBatchCount] = useState(10);
  const [batchPrefix, setBatchPrefix] = useState("PROMO");
  const [couponType, setCouponType] = useState<TCouponType>(COUPON_TYPES.PERCENTAGE);
  const [amount, setAmount] = useState<number>(20);
  const [currency, setCurrency] = useState<string>(PAYMENT_CURRENCIES.USD);
  const [maxUsage, setMaxUsage] = useState<number>(0);
  const [maxUsagePerUser, setMaxUsagePerUser] = useState<number>(1);
  const [expiresAt, setExpiresAt] = useState("");

  // Targeting
  const [roles, setRoles] = useState<IAdminRole[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [targetUserEmailsInput, setTargetUserEmailsInput] = useState("");

  useEffect(() => {
    const fetchDependencies = async () => {
      const rolePromise = canReadRoles
        ? RoleController.getRoles({ limit: 100 })
        : Promise.resolve({ success: false, roles: [] });
      const prodPromise = ClientPaymentController.getProducts({ limit: 100 });

      const [roleRes, prodRes] = await Promise.all([rolePromise, prodPromise]);
      if (roleRes.success) setRoles(roleRes.roles);
      if (prodRes.success) setProducts(prodRes.products);
    };
    void fetchDependencies();
  }, [canReadRoles]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toastError(t(AppLocales.Admin.Coupons.Form.TitleLabel));
      return;
    }

    if (!isBatch) {
      const cleanCode = code.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
      if (!cleanCode) {
        toastError(t(AppLocales.Admin.Coupons.Form.CodeLabel));
        return;
      }
      if (cleanCode.length < 6) {
        toastError(t(AppLocales.Admin.Coupons.Form.CodeInvalid));
        return;
      }
    }

    if (amount <= 0) {
      toastError(t(AppLocales.Admin.Coupons.Form.AmountLabel));
      return;
    }

    if (couponType === COUPON_TYPES.PERCENTAGE && amount > MAX_PERCENTAGE_DISCOUNT) {
      toastError(t(AppLocales.Admin.Coupons.Form.PercentagePlaceholder));
      return;
    }

    if (maxUsage > 0 && maxUsagePerUser > maxUsage) {
      toastError(t(AppLocales.Admin.Coupons.Form.MaxPerUserExceedsMax));
      return;
    }

    setLoading(true);

    const parsedTargetUsers = targetUserEmailsInput
      .split(/[,;\n\s]+/)
      .map((entry) => entry.trim())
      .filter((entry) => entry.length > 0);

    const targetUserEmails = parsedTargetUsers.filter((entry) => entry.includes("@"));
    const targetUserIds = parsedTargetUsers.filter((entry) => !entry.includes("@"));

    // Minor units for fixed discounts (e.g. $10 -> 1000 cents), or raw integer percentage
    const finalAmount = couponType === COUPON_TYPES.PERCENTAGE ? Math.round(amount) : Math.round(amount * 100);

    const basePayload = {
      title: title.trim(),
      description: description.trim() || undefined,
      coupon_type: couponType,
      amount: finalAmount,
      currency: currency || undefined,
      max_usage: maxUsage >= 0 ? maxUsage : 0,
      max_usage_per_user: maxUsagePerUser > 0 ? maxUsagePerUser : 1,
      expires_at: expiresAt ? new Date(expiresAt).toISOString() : undefined,
      target_role_ids: canReadRoles ? selectedRoleIds : [],
      target_product_ids: selectedProductIds,
      target_user_ids: targetUserIds.length > 0 ? targetUserIds : undefined,
      target_user_emails: targetUserEmails.length > 0 ? targetUserEmails : undefined,
    };

    if (isBatch) {
      const cleanPrefix = batchPrefix.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
      const result = await PaymentController.createBatchCoupons({
        count: batchCount,
        prefix: cleanPrefix,
        coupon: basePayload,
      });
      setLoading(false);

      if (result.success) {
        success(t(AppLocales.Admin.Coupons.Toasts.BatchCreateSuccess));
        navigate(AppRoutes.client.protected.admin.COUPONS);
      } else {
        toastError(result.error || t(AppLocales.Admin.Coupons.Errors.Create));
      }
    } else {
      const cleanCode = code.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
      const result = await PaymentController.createCoupon({
        ...basePayload,
        code: cleanCode,
      });
      setLoading(false);

      if (result.success) {
        success(t(AppLocales.Admin.Coupons.Toasts.CreateSuccess));
        navigate(AppRoutes.client.protected.admin.COUPONS);
      } else {
        toastError(result.error || t(AppLocales.Admin.Coupons.Errors.Create));
      }
    }
  };

  const toggleRoleSelection = (roleId: string) => {
    setSelectedRoleIds((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId],
    );
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  if (!permissionsLoading && !can(ADMIN_ACTIONS.CREATE, ADMIN_RESOURCES.PAYMENT_COUPONS)) {
    return (
      <div className="text-center py-12 text-error">
        {t(AppLocales.Admin.Coupons.Errors.Create)}
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={t(AppLocales.Admin.Coupons.CreateTitle)}
        description={t(AppLocales.Admin.Coupons.CreateDescription)}
        action={
          <Button
            variant={ButtonVariants.TERTIARY}
            size={ComponentSizes.MD}
            onClick={() => navigate(AppRoutes.client.protected.admin.COUPONS)}
          >
            <iconsLib.arrowLeft className="w-4 h-4 mr-1.5" />
            {t(AppLocales.Admin.Coupons.Title)}
          </Button>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Creation Mode Toggle */}
        <div className="bg-base-100 p-4 rounded-xl border border-base-300 flex items-center justify-between">
          <div>
            <span className="font-semibold text-base-content block">
              {t(AppLocales.Admin.Coupons.Form.TypeLabel)}
            </span>
            <span className="text-xs text-base-content/60">
              {t(AppLocales.Admin.Coupons.Form.BatchHelper)}
            </span>
          </div>
          <div className="flex bg-base-200 p-1 rounded-lg gap-1">
            <Button
              type="button"
              variant={!isBatch ? ButtonVariants.PRIMARY : ButtonVariants.TERTIARY}
              size={ComponentSizes.SM}
              onClick={() => setIsBatch(false)}
            >
              {t(AppLocales.Admin.Coupons.Form.SingleMode)}
            </Button>
            <Button
              type="button"
              variant={isBatch ? ButtonVariants.PRIMARY : ButtonVariants.TERTIARY}
              size={ComponentSizes.SM}
              onClick={() => setIsBatch(true)}
            >
              {t(AppLocales.Admin.Coupons.Form.BatchMode)}
            </Button>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-base-100 p-6 rounded-xl border border-base-300 space-y-4">
          <h3 className="font-bold text-base text-base-content font-primary">
            {t(AppLocales.Admin.Coupons.DetailTitle)}
          </h3>

          <div>
            <TextInput
              label={`${t(AppLocales.Admin.Coupons.Form.TitleLabel)} *`}
              placeholder={t(AppLocales.Admin.Coupons.Form.TitlePlaceholder)}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <TextArea
              label={t(AppLocales.Admin.Coupons.Form.DescriptionLabel)}
              placeholder={t(AppLocales.Admin.Coupons.Form.DescriptionPlaceholder)}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          {!isBatch ? (
            <div>
              <TextInput
                label={`${t(AppLocales.Admin.Coupons.Form.CodeLabel)} *`}
                placeholder={t(AppLocales.Admin.Coupons.Form.CodePlaceholder)}
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
                helperText={t(AppLocales.Admin.Coupons.Form.CodeHelper)}
                className="font-mono uppercase tracking-wider"
                required
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <TextInput
                  label={t(AppLocales.Admin.Coupons.Form.BatchPrefixLabel)}
                  placeholder={t(AppLocales.Admin.Coupons.Form.BatchPrefixPlaceholder)}
                  value={batchPrefix}
                  onChange={(e) => setBatchPrefix(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
                  helperText={t(AppLocales.Admin.Coupons.Form.BatchHelper)}
                  className="font-mono uppercase"
                />
              </div>
              <div>
                <TextInput
                  label={t(AppLocales.Admin.Coupons.Form.BatchCountLabel)}
                  type="number"
                  min={1}
                  max={500}
                  value={batchCount}
                  onChange={(e) => setBatchCount(Number(e.target.value))}
                  required
                />
              </div>
            </div>
          )}
        </div>

        {/* Discount Configuration */}
        <div className="bg-base-100 p-6 rounded-xl border border-base-300 space-y-4">
          <h3 className="font-bold text-base text-base-content font-primary">
            {t(AppLocales.Admin.Coupons.Table.Discount)}
          </h3>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-body-s font-medium mb-1 block">
                {t(AppLocales.Admin.Coupons.Form.TypeLabel)}
              </label>
              <Dropdown
                value={couponType}
                onValueChange={(val) => setCouponType(val as TCouponType)}
                options={[
                  { value: COUPON_TYPES.PERCENTAGE, label: t(AppLocales.Admin.Coupons.Form.TypePercentage) },
                  { value: COUPON_TYPES.FIXED, label: t(AppLocales.Admin.Coupons.Form.TypeFixed) },
                ]}
              />
            </div>

            <div>
              <TextInput
                label={`${t(AppLocales.Admin.Coupons.Form.AmountLabel)} *`}
                type="number"
                min={1}
                max={couponType === COUPON_TYPES.PERCENTAGE ? MAX_PERCENTAGE_DISCOUNT : 100000}
                step={couponType === COUPON_TYPES.PERCENTAGE ? 1 : 0.01}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                required
              />
            </div>

            <div>
              <label className="text-body-s font-medium mb-1 block">
                {t(AppLocales.Admin.Coupons.Form.CurrencyLabel)}
              </label>
              <Dropdown
                value={currency}
                onValueChange={(val) => setCurrency(val)}
                options={[...PAYMENT_CURRENCY_OPTIONS]}
              />
            </div>
          </div>
        </div>

        {/* Usage Limits & Expiration */}
        <div className="bg-base-100 p-6 rounded-xl border border-base-300 space-y-4">
          <h3 className="font-bold text-base text-base-content font-primary">
            {t(AppLocales.Admin.Coupons.Table.Usage)}
          </h3>

          <div className="grid grid-cols-3 gap-4 items-start">
            <div>
              <TextInput
                label={t(AppLocales.Admin.Coupons.Form.MaxUsageLabel)}
                type="number"
                min={0}
                value={maxUsage}
                onChange={(e) => setMaxUsage(Number(e.target.value))}
                placeholder={t(AppLocales.Admin.Coupons.Form.MaxUsagePlaceholder)}
                tooltip={t(AppLocales.Admin.Coupons.Form.MaxUsageTooltip)}
              />
            </div>

            <div>
              <TextInput
                label={t(AppLocales.Admin.Coupons.Form.MaxPerUserLabel)}
                type="number"
                min={1}
                value={maxUsagePerUser}
                onChange={(e) => setMaxUsagePerUser(Number(e.target.value))}
                placeholder={t(AppLocales.Admin.Coupons.Form.MaxPerUserPlaceholder)}
              />
            </div>

            <div>
              <TextInput
                label={t(AppLocales.Admin.Coupons.Form.ExpiresLabel)}
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Targeting Restrictions (Roles & Products) */}
        <div className="bg-base-100 p-6 rounded-xl border border-base-300 space-y-4">
          <div>
            <h3 className="font-bold text-base text-base-content font-primary">
              {t(AppLocales.Admin.Coupons.Detail.TargetingRestrictions)}
            </h3>
            <p className="text-xs text-base-content/60">
              {t(AppLocales.Admin.Coupons.Detail.TargetingAllRoles)}
            </p>
          </div>

          {/* Role restrictions */}
          {canReadRoles && (
            <div>
              <label className="text-body-s font-semibold text-base-content block mb-2">
                {t(AppLocales.Admin.Coupons.Detail.TargetRoles)}
              </label>
              <div className="flex flex-wrap gap-3">
                {roles.map((role) => (
                  <label
                    key={role.id}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer text-xs font-medium transition-colors ${
                      selectedRoleIds.includes(role.id)
                        ? "bg-primary/10 border-primary text-primary"
                        : "border-base-300 hover:bg-base-200"
                    }`}
                  >
                    <Checkbox
                      checked={selectedRoleIds.includes(role.id)}
                      onChange={() => toggleRoleSelection(role.id)}
                    />
                    <span>{role.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Product restrictions */}
          <div>
            <label className="text-body-s font-semibold text-base-content block mb-2">
              {t(AppLocales.Admin.Coupons.Detail.TargetProducts)}
            </label>
            <div className="grid grid-cols-2 gap-3">
              {products.map((prod) => (
                <label
                  key={prod.id}
                  className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer text-xs font-medium transition-colors ${
                    selectedProductIds.includes(prod.id)
                      ? "bg-primary/10 border-primary text-primary"
                      : "border-base-300 hover:bg-base-200"
                  }`}
                >
                  <Checkbox
                    checked={selectedProductIds.includes(prod.id)}
                    onChange={() => toggleProductSelection(prod.id)}
                  />
                  <div className="truncate">
                    <span className="font-bold block truncate">{prod.name}</span>
                    <span className="text-base-content/60">
                      {prod.price} {prod.recurring ? `/${prod.period_label}` : ""}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* User restrictions */}
          <div>
            <TextArea
              label={t(AppLocales.Admin.Coupons.Detail.TargetUsers)}
              placeholder={t(AppLocales.Admin.Coupons.Form.TargetUsersPlaceholder)}
              value={targetUserEmailsInput}
              onChange={(e) => setTargetUserEmailsInput(e.target.value)}
              helperText={t(AppLocales.Admin.Coupons.Form.TargetUsersHelper)}
              rows={2}
            />
          </div>
        </div>

        {/* Action Row */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant={ButtonVariants.TERTIARY}
            size={ComponentSizes.MD}
            onClick={() => navigate(AppRoutes.client.protected.admin.COUPONS)}
            disabled={isLoading}
          >
            {t(AppLocales.Admin.Common.Actions.Cancel)}
          </Button>
          <Button
            type="submit"
            variant={ButtonVariants.PRIMARY}
            size={ComponentSizes.MD}
            disabled={isLoading}
          >
            {isBatch
              ? t(AppLocales.Admin.Coupons.Form.SubmitBatch)
              : t(AppLocales.Admin.Coupons.Form.SubmitSingle)}
          </Button>
        </div>
      </form>
    </div>
  );
};
export default AdminCouponCreatePage;

