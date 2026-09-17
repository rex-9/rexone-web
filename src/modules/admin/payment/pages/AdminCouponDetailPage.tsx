import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { iconsLib } from "../../../../assets";
import {
  Badge,
  Button,
  ConfirmDialog,
  DateTime,
  DateTimeFormats,
} from "../../../../design";
import {
  BadgeVariants,
  ButtonVariants,
  ComponentSizes,
} from "../../../../design/constants";
import { useLoading } from "../../../../contexts";
import { useDocumentTitle, usePermissions } from "../../../../hooks";
import { AppLocales } from "../../../../locales/app_locales";
import { AdminDetailHeader, AdminState } from "../../components";
import {
  ADMIN_ACTIONS,
  ADMIN_RESOURCES,
  ADMIN_VIEW_MODES,
} from "../../constants";
import PaymentController from "../payment.controller";
import type { ICoupon } from "../../../payment/types";
import { useToast } from "../../../../contexts/ToastContext";
import { AdminRedemptionsTable } from "../components";

const money = (amount: number, currency: string = "usd") =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);

export const AdminCouponDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  useDocumentTitle(t(AppLocales.Admin.Coupons.DetailTitle));
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();
  const { isLoading, setLoading } = useLoading();
  const { can } = usePermissions();

  const canReadRoles = can(ADMIN_ACTIONS.READ, ADMIN_RESOURCES.ROLES);

  const [coupon, setCoupon] = useState<ICoupon | null>(null);
  const [error, setError] = useState("");
  const [lifecycleTarget, setLifecycleTarget] = useState<
    | typeof ADMIN_ACTIONS.DISCARD
    | typeof ADMIN_ACTIONS.UNDISCARD
    | typeof ADMIN_ACTIONS.DESTROY
    | null
  >(null);

  const loadCouponData = useCallback(async () => {
    if (!id) return;
    setError("");
    setLoading(true);

    const couponRes = await PaymentController.getCoupon(id);

    if (couponRes.success && couponRes.coupon) {
      setCoupon(couponRes.coupon);
    } else {
      setError(couponRes.error || t(AppLocales.Admin.Coupons.Errors.LoadOne));
    }
    setLoading(false);
  }, [id, setLoading, t]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadCouponData();
  }, [loadCouponData]);

  const handleExecuteLifecycleAction = async () => {
    if (!coupon || !lifecycleTarget) return;

    setLoading(true);
    if (lifecycleTarget === ADMIN_ACTIONS.DISCARD) {
      const result = await PaymentController.discardCoupon(coupon.id);
      if (result.success) {
        success(t(AppLocales.Admin.Coupons.Toasts.DiscardSuccess));
        setLifecycleTarget(null);
        void loadCouponData();
      } else {
        toastError(result.error || t(AppLocales.Admin.Coupons.Errors.Discard));
      }
    } else if (lifecycleTarget === ADMIN_ACTIONS.UNDISCARD) {
      const result = await PaymentController.undiscardCoupon(coupon.id);
      if (result.success) {
        success(t(AppLocales.Admin.Coupons.Toasts.RestoreSuccess));
        setLifecycleTarget(null);
        void loadCouponData();
      } else {
        toastError(result.error || t(AppLocales.Admin.Coupons.Errors.Restore));
      }
    } else {
      const result = await PaymentController.destroyCoupon(coupon.id);
      if (result.success) {
        success(t(AppLocales.Admin.Coupons.Toasts.DestroySuccess));
        setLifecycleTarget(null);
        navigate(
          `${AppRoutes.client.protected.admin.COUPONS}?view=${ADMIN_VIEW_MODES.DISCARDED}`,
        );
      } else {
        toastError(result.error || t(AppLocales.Admin.Coupons.Errors.Destroy));
      }
    }
    setLoading(false);
  };

  const listPath = coupon?.discarded_at
    ? `${AppRoutes.client.protected.admin.COUPONS}?view=${ADMIN_VIEW_MODES.DISCARDED}`
    : AppRoutes.client.protected.admin.COUPONS;

  return (
    <div className="space-y-6 pb-12">
      <AdminDetailHeader
        breadcrumbs={[
          {
            label: t(AppLocales.Admin.Common.Detail.Admin),
            to: AppRoutes.client.protected.admin.HOME,
          },
          {
            label: t(AppLocales.Admin.Coupons.Title),
            to: listPath,
          },
          {
            label: coupon?.code || t(AppLocales.Admin.Common.Detail.Details),
          },
        ]}
        title={
          coupon
            ? `${t(AppLocales.Admin.Coupons.DetailTitle)}: ${coupon.code}`
            : t(AppLocales.Admin.Coupons.DetailTitle)
        }
        description={coupon?.title || t(AppLocales.Admin.Coupons.DetailDescription)}
        backTo={listPath}
        action={
          coupon?.discarded_at ? (
            can(ADMIN_ACTIONS.DELETE, ADMIN_RESOURCES.PAYMENT_COUPONS) && (
              <div className="flex items-center gap-3">
                <Button
                  variant={ButtonVariants.SECONDARY}
                  size={ComponentSizes.MD}
                  onClick={() => setLifecycleTarget(ADMIN_ACTIONS.UNDISCARD)}
                >
                  <iconsLib.arrowPath className="w-4 h-4 mr-1.5 text-success" />
                  {t(AppLocales.Admin.Common.Actions.Restore)}
                </Button>
                <Button
                  variant={ButtonVariants.SECONDARY}
                  className="text-error border-error/30 hover:bg-error/10"
                  size={ComponentSizes.MD}
                  onClick={() => setLifecycleTarget(ADMIN_ACTIONS.DESTROY)}
                >
                  <iconsLib.trash className="w-4 h-4 mr-1.5" />
                  {t(AppLocales.Admin.Common.Actions.Destroy)}
                </Button>
              </div>
            )
          ) : (
            can(ADMIN_ACTIONS.DELETE, ADMIN_RESOURCES.PAYMENT_COUPONS) && (
              <Button
                variant={ButtonVariants.SECONDARY}
                className="text-error border-error/30 hover:bg-error/10"
                size={ComponentSizes.MD}
                onClick={() => setLifecycleTarget(ADMIN_ACTIONS.DISCARD)}
              >
                <iconsLib.trash className="w-4 h-4 mr-1.5" />
                {t(AppLocales.Admin.Common.Actions.Discard)}
              </Button>
            )
          )
        }
      />

      {error ? (
        <AdminState
          icon={iconsLib.warning}
          title={t(AppLocales.Admin.Coupons.Errors.LoadOne)}
          message={error}
        />
      ) : coupon ? (
        <div className="space-y-6">
          {/* Top Stat Cards */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-base-100 p-5 rounded-xl border border-base-300">
              <span className="text-xs text-base-content/60 block mb-1">
                {t(AppLocales.Admin.Coupons.Table.Discount)}
              </span>
              <span className="text-2xl font-extrabold text-success">
                {coupon.coupon_type === "percentage"
                  ? `${coupon.amount}% ${t(AppLocales.Admin.Coupons.Table.Off)}`
                  : `${money(coupon.amount, coupon.currency || "usd")} ${t(AppLocales.Admin.Coupons.Table.Off)}`}
              </span>
            </div>

            <div className="bg-base-100 p-5 rounded-xl border border-base-300">
              <span className="text-xs text-base-content/60 block mb-1">
                {t(AppLocales.Admin.Coupons.Detail.TotalRedemptions)}
              </span>
              <span className="text-2xl font-extrabold text-base-content">
                {coupon.used_count}
                <span className="text-sm font-normal text-base-content/60 ml-1">
                  / {coupon.max_usage === 0 ? "∞" : coupon.max_usage}
                </span>
              </span>
              <div className="w-full bg-base-200 rounded-full h-1.5 mt-2">
                <div
                  className="bg-primary h-1.5 rounded-full"
                  style={{
                    width: coupon.max_usage === 0
                      ? "100%"
                      : `${Math.min(100, (coupon.used_count / coupon.max_usage) * 100)}%`,
                  }}
                />
              </div>
            </div>

            <div className="bg-base-100 p-5 rounded-xl border border-base-300">
              <span className="text-xs text-base-content/60 block mb-1">
                {t(AppLocales.Admin.Coupons.Form.MaxPerUserLabel)}
              </span>
              <span className="text-2xl font-extrabold text-base-content">
                {coupon.max_usage_per_user}
              </span>
            </div>

            <div className="bg-base-100 p-5 rounded-xl border border-base-300">
              <span className="text-xs text-base-content/60 block mb-1">
                {t(AppLocales.Admin.Products.Table.Status)}
              </span>
              <div className="mt-1">
                {coupon.discarded_at ? (
                  <Badge variant={BadgeVariants.ERROR} size={ComponentSizes.MD}>
                    {t(AppLocales.Admin.Coupons.Tabs.RecycleBin)}
                  </Badge>
                ) : coupon.exhausted ? (
                  <Badge variant={BadgeVariants.WARNING} size={ComponentSizes.MD}>
                    {t(AppLocales.Admin.Coupons.Detail.RemainingUsage)}: 0
                  </Badge>
                ) : coupon.expired ? (
                  <Badge variant={BadgeVariants.WARNING} size={ComponentSizes.MD}>
                    {t(AppLocales.Admin.Coupons.Table.Expires)}
                  </Badge>
                ) : (
                  <Badge variant={BadgeVariants.SUCCESS} size={ComponentSizes.MD}>
                    {t(AppLocales.Admin.Coupons.Tabs.Active)}
                  </Badge>
                )}
              </div>
              <div className="text-xs text-base-content/50 mt-2">
                {coupon.expires_at ? (
                  <DateTime value={coupon.expires_at} format={DateTimeFormats.DATE} />
                ) : (
                  t(AppLocales.Admin.Coupons.Table.Never)
                )}
              </div>
            </div>
          </div>

          {/* Targeting restrictions summary */}
          <div className="bg-base-100 p-5 rounded-xl border border-base-300 space-y-3">
            <h4 className="font-bold text-sm text-base-content">
              {t(AppLocales.Admin.Coupons.Detail.TargetingRestrictions)}
            </h4>
            <div className={`grid ${canReadRoles ? "grid-cols-3" : "grid-cols-2"} gap-4 text-xs`}>
              {canReadRoles && (
                <div>
                  <span className="text-base-content/60 block mb-1">
                    {t(AppLocales.Admin.Coupons.Detail.TargetRoles)}
                  </span>
                  {coupon.target_role_ids.length > 0 ? (
                    <span className="font-semibold">
                      {t(AppLocales.Admin.Coupons.Detail.RestrictedCount, { count: coupon.target_role_ids.length })}
                    </span>
                  ) : (
                    <span className="text-base-content/50">{t(AppLocales.Admin.Coupons.Detail.TargetingAllRoles)}</span>
                  )}
                </div>
              )}
              <div>
                <span className="text-base-content/60 block mb-1">
                  {t(AppLocales.Admin.Coupons.Detail.TargetProducts)}
                </span>
                {coupon.target_product_ids.length > 0 ? (
                  <span className="font-semibold">
                    {t(AppLocales.Admin.Coupons.Detail.RestrictedCount, { count: coupon.target_product_ids.length })}
                  </span>
                ) : (
                  <span className="text-base-content/50">{t(AppLocales.Admin.Coupons.Detail.TargetingAllProducts)}</span>
                )}
              </div>
              <div>
                <span className="text-base-content/60 block mb-1">
                  {t(AppLocales.Admin.Coupons.Detail.TargetUsers)}
                </span>
                {coupon.target_user_emails && coupon.target_user_emails.length > 0 ? (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {coupon.target_user_emails.map((email) => (
                      <span key={email} className="badge badge-sm badge-outline font-mono text-xs">
                        {email}
                      </span>
                    ))}
                  </div>
                ) : coupon.target_user_ids.length > 0 ? (
                  <span className="font-semibold">
                    {t(AppLocales.Admin.Coupons.Detail.RestrictedCount, { count: coupon.target_user_ids.length })}
                  </span>
                ) : (
                  <span className="text-base-content/50">{t(AppLocales.Admin.Coupons.Detail.TargetingAllUsers)}</span>
                )}
              </div>
            </div>
          </div>

          {/* Redemptions Table */}
          <div className="bg-base-100 p-6 rounded-xl border border-base-300 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-base text-base-content font-primary">
                {t(AppLocales.Admin.Coupons.Detail.RedemptionHistory)} ({coupon.used_count})
              </h3>
            </div>

            <AdminRedemptionsTable couponId={coupon.id} hideCouponColumn />
          </div>
        </div>
      ) : null}

      <ConfirmDialog
        isOpen={Boolean(lifecycleTarget)}
        onClose={() => setLifecycleTarget(null)}
        onConfirm={() => void handleExecuteLifecycleAction()}
        title={
          lifecycleTarget === ADMIN_ACTIONS.DISCARD
            ? t(AppLocales.Admin.Common.Confirm.DiscardTitle)
            : lifecycleTarget === ADMIN_ACTIONS.UNDISCARD
              ? t(AppLocales.Admin.Common.Confirm.RestoreTitle)
              : t(AppLocales.Admin.Common.Confirm.DestroyTitle)
        }
        message={
          lifecycleTarget === ADMIN_ACTIONS.DISCARD
            ? t(AppLocales.Admin.Common.Confirm.DiscardMessage)
            : lifecycleTarget === ADMIN_ACTIONS.UNDISCARD
              ? t(AppLocales.Admin.Common.Confirm.RestoreMessage)
              : t(AppLocales.Admin.Common.Confirm.DestroyMessage)
        }
        confirmLabel={
          lifecycleTarget === ADMIN_ACTIONS.DISCARD
            ? t(AppLocales.Admin.Common.Actions.Discard)
            : lifecycleTarget === ADMIN_ACTIONS.UNDISCARD
              ? t(AppLocales.Admin.Common.Actions.Restore)
              : t(AppLocales.Admin.Common.Actions.Destroy)
        }
        cancelLabel={t(AppLocales.Admin.Common.Actions.Cancel)}
        isDestructive={
          lifecycleTarget === ADMIN_ACTIONS.DISCARD ||
          lifecycleTarget === ADMIN_ACTIONS.DESTROY
        }
        isLoading={isLoading}
      />
    </div>
  );
};
export default AdminCouponDetailPage;

