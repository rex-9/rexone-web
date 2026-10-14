import React from "react";
import { useParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { iconsLib } from "../../../../assets";
import {
  DateTime,
  DateTimeFormats,
  DetailField,
  DetailGrid,
  DetailHeader,
  DetailSection,
  StatusBadge,
  Badge,
  BadgeVariants,
  ComponentSizes,
} from "../../../../design";
import { AppLocales, useTranslate } from "../../../../locales";
import {
  AdminState,
} from "../../components";
import { useAdminDetail } from "../../hooks/useAdminDetail";
import PaymentController from "../payment.controller";
import type { IAdminPurchase } from "../types";

const load = async (id: string) => {
  const result = await PaymentController.getPurchase(id);
  return { ...result, record: result.purchase };
};
const amount = (value: number, currency: string) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(value / 100);

export const AdminPurchaseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const t = useTranslate();
  const { record, error } = useAdminDetail<IAdminPurchase>(id, load);
  const list = AppRoutes.client.protected.admin.PURCHASES;

  const paymentIdentifierLabel = (provider?: string) => {
    switch (provider) {
      case "app_store":
        return t(AppLocales.Admin.Purchases.Detail.TransactionId);
      case "google_play":
        return t(AppLocales.Admin.Purchases.Detail.OrderId);
      default:
        return t(AppLocales.Admin.Purchases.Detail.PaymentIntent);
    }
  };

  return (
    <div className="space-y-6">
      <DetailHeader
        breadcrumbs={[
          {
            label: t(AppLocales.Admin.Common.Detail.Admin),
            to: AppRoutes.client.protected.admin.HOME,
          },
          { label: t(AppLocales.Admin.Purchases.Title), to: list },
          {
            label:
              record?.product_name || t(AppLocales.Admin.Common.Detail.Details),
          },
        ]}
        title={record?.product_name || t(AppLocales.Admin.Purchases.Detail.Title)}
        description={record?.user_email || t(AppLocales.Admin.Purchases.Detail.Description)}
        backTo={list}
        icon={iconsLib.banknotes}
        statusBadge={record ? <StatusBadge status={record.status} /> : undefined}
        entityId={record?.id}
        timestamps={
          record
            ? {
                createdAt: record.created_at,
              }
            : undefined
        }
      />
      {error ? (
        <AdminState
          title={t(AppLocales.Admin.Common.State.ErrorTitle)}
          message={error}
        />
      ) : record ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <DetailSection
            title={t(AppLocales.Admin.Purchases.Detail.Purchase)}
            icon={iconsLib.banknotes}
            accent
          >
            <DetailGrid columns={2}>
              <DetailField
                label={t(AppLocales.Admin.Purchases.Table.Amount)}
                value={amount(record.unit_amount, record.currency)}
              />
              <DetailField
                label={t(AppLocales.Admin.Common.Detail.Status)}
                value={<StatusBadge status={record.status} />}
              />
              <DetailField
                label={t(AppLocales.Admin.Purchases.Detail.Product)}
                value={record.product_name}
              />
              <DetailField
                label={t(AppLocales.Admin.Purchases.Detail.ProductCode)}
                value={record.product_code}
                copyable
                mono
              />
              <DetailField
                label={t(AppLocales.Admin.Common.Detail.Created)}
                value={
                  <DateTime
                    value={record.created_at}
                    format={DateTimeFormats.ADMIN}
                  />
                }
              />
              <DetailField
                label={t(AppLocales.Admin.Purchases.Detail.PaidAt)}
                value={
                  record.paid_at ? (
                    <DateTime
                      value={record.paid_at}
                      format={DateTimeFormats.ADMIN}
                    />
                  ) : (
                    "—"
                  )
                }
              />
            </DetailGrid>
          </DetailSection>
          <DetailSection
            title={t(AppLocales.Admin.Purchases.Detail.Payment)}
            icon={iconsLib.banknotes}
          >
            <DetailGrid>
              <DetailField
                label={t(AppLocales.Admin.Purchases.Detail.User)}
                value={record.user_name || record.username}
              />
              <DetailField
                label={t(AppLocales.Admin.Common.Detail.Email)}
                value={record.user_email}
              />
              <DetailField
                label={t(AppLocales.Admin.Purchases.Detail.PaymentMethod)}
                value={record.payment_method_display}
              />
              <DetailField
                label={paymentIdentifierLabel(record.provider)}
                value={record.provider_payment_id}
                copyable
                mono
                className="sm:col-span-2"
              />
              {record.provider_charge_id && (
                <DetailField
                  label={t(AppLocales.Admin.Purchases.Detail.Charge)}
                  value={record.provider_charge_id}
                  copyable
                  mono
                />
              )}
              <DetailField
                label={t(AppLocales.Admin.Common.Detail.Provider)}
                value={
                  <Badge
                    variant={BadgeVariants.DEFAULT}
                    size={ComponentSizes.XS}
                    className="uppercase font-mono font-medium"
                  >
                    {record.provider}
                  </Badge>
                }
              />
            </DetailGrid>
          </DetailSection>
          {record.coupon && (
            <DetailSection
              title={t(AppLocales.Admin.Coupons.Detail.AppliedCouponTitle)}
              icon={iconsLib.tag}
              className="lg:col-span-2"
            >
              <DetailGrid columns={4}>
                <DetailField
                  label={t(AppLocales.Admin.Coupons.Detail.CouponCode)}
                  value={
                    <Badge
                      variant={BadgeVariants.PRIMARY}
                      size={ComponentSizes.XS}
                      className="font-mono font-semibold"
                    >
                      {record.coupon.code}
                    </Badge>
                  }
                  copyable
                />
                <DetailField
                  label={t(AppLocales.Admin.Coupons.Detail.OriginalPrice)}
                  value={amount(record.coupon.original_amount, record.coupon.currency)}
                />
                <DetailField
                  label={t(AppLocales.Admin.Coupons.Detail.DiscountDeducted)}
                  value={
                    <span className="text-success font-semibold">
                      -{amount(record.coupon.discount_amount, record.coupon.currency)}
                    </span>
                  }
                />
                <DetailField
                  label={t(AppLocales.Admin.Coupons.Detail.NetAmountCharged)}
                  value={
                    <span className="font-bold text-base-content">
                      {amount(record.coupon.final_amount, record.coupon.currency)}
                    </span>
                  }
                />
              </DetailGrid>
            </DetailSection>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default AdminPurchaseDetailPage;
