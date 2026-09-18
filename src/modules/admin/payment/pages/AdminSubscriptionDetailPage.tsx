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
} from "../../../../design";
import { AppLocales, useTranslate } from "../../../../locales";
import {
  AdminState,
} from "../../components";
import { useAdminDetail } from "../../hooks/useAdminDetail";
import PaymentController from "../payment.controller";
import type { IAdminSubscription } from "../types";

const load = async (id: string) => {
  const result = await PaymentController.getSubscription(id);
  return { ...result, record: result.subscription };
};
const amount = (value: number, currency: string) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(value / 100);

export const AdminSubscriptionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const t = useTranslate();
  const { record, error } = useAdminDetail<IAdminSubscription>(id, load);
  const list = AppRoutes.client.protected.admin.SUBSCRIPTIONS;
  return (
    <div className="space-y-6">
      <DetailHeader
        breadcrumbs={[
          {
            label: t(AppLocales.Admin.Common.Detail.Admin),
            to: AppRoutes.client.protected.admin.HOME,
          },
          { label: t(AppLocales.Admin.Subscriptions.Title), to: list },
          {
            label:
              record?.product_name || t(AppLocales.Admin.Common.Detail.Details),
          },
        ]}
        title={record?.product_name || t(AppLocales.Admin.Subscriptions.Detail.Title)}
        description={record?.user_email || t(AppLocales.Admin.Subscriptions.Detail.Description)}
        backTo={list}
        icon={iconsLib.banknotes}
        statusBadge={record ? <StatusBadge status={record.status} /> : undefined}
        entityId={record?.id}
        timestamps={
          record
            ? {
                createdAt: record.started_at,
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
            title={t(AppLocales.Admin.Subscriptions.Detail.Plan)}
            icon={iconsLib.banknotes}
            accent
          >
            <DetailGrid columns={2}>
              <DetailField
                label={t(AppLocales.Admin.Subscriptions.Detail.Product)}
                value={record.product_name}
              />
              <DetailField
                label={t(AppLocales.Admin.Common.Detail.Status)}
                value={<StatusBadge status={record.status} />}
              />
              <DetailField
                label={t(AppLocales.Admin.Subscriptions.Table.Amount)}
                value={`${amount(record.unit_amount, record.currency)} / ${record.interval}`}
              />
              <DetailField
                label={t(AppLocales.Admin.Subscriptions.Detail.Quantity)}
                value={record.quantity}
              />
              <DetailField
                label={t(AppLocales.Admin.Subscriptions.Detail.SubscriptionId)}
                value={record.stripe_subscription_id}
                copyable
                mono
                className="sm:col-span-2"
              />
              <DetailField
                label={t(AppLocales.Admin.Transactions.Detail.User)}
                value={record.user_name || record.username}
              />
              <DetailField
                label={t(AppLocales.Admin.Common.Detail.Email)}
                value={record.user_email}
                copyable
                mono
              />
            </DetailGrid>
          </DetailSection>
          <DetailSection
            title={t(AppLocales.Admin.Subscriptions.Detail.Billing)}
            icon={iconsLib.banknotes}
          >
            <DetailGrid>
              <DetailField
                label={t(AppLocales.Admin.Subscriptions.Detail.PeriodStart)}
                value={
                  <DateTime
                    value={record.current_period_start}
                    format={DateTimeFormats.ADMIN}
                  />
                }
              />
              <DetailField
                label={t(AppLocales.Admin.Subscriptions.Table.PeriodEnd)}
                value={
                  <DateTime
                    value={record.current_period_end}
                    format={DateTimeFormats.ADMIN}
                  />
                }
              />
              <DetailField
                label={t(AppLocales.Admin.Subscriptions.Detail.StartedAt)}
                value={
                  <DateTime
                    value={record.started_at}
                    format={DateTimeFormats.ADMIN}
                  />
                }
              />
              <DetailField
                label={t(AppLocales.Admin.Subscriptions.Detail.PaymentMethod)}
                value={record.payment_method_display}
              />
              <DetailField
                label={t(AppLocales.Admin.Subscriptions.Table.Cancellation)}
                value={
                  record.cancel_at_period_end
                    ? t(AppLocales.Admin.Subscriptions.Scheduled)
                    : "—"
                }
              />
              <DetailField
                label={t(AppLocales.Admin.Common.Detail.Updated)}
                value={
                  <DateTime
                    value={record.updated_at}
                    format={DateTimeFormats.ADMIN}
                  />
                }
              />
            </DetailGrid>
          </DetailSection>
        </div>
      ) : null}
    </div>
  );
};
