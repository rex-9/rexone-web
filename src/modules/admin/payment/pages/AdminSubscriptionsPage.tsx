import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { iconsLib } from "../../../../assets";
import {
  DateTime,
  DateTimeFormats,
  Dropdown,
  SearchInput,
  StatusBadge,
  Badge,
  BadgeVariants,
  ComponentSizes,
} from "../../../../design";
import {
  SORT_ORDERS,
  useDocumentTitle,
  usePermissions,
  useSort,
} from "../../../../hooks";
import { useLoading } from "../../../../contexts";
import type { IApiPagination } from "../../../../models";
import { AppLocales, useTranslate } from "../../../../locales";
import {
  BILLING_INTERVALS,
  SUBSCRIPTION_STATUS,
} from "../../../payment/constants";
import {
  AdminPagination,
  AdminState,
  AdminTable,
  PageHeader,
  type IAdminTableColumn,
} from "../../components";
import {
  ADMIN_ACTIONS,
  ADMIN_PAGE_SIZE,
  ADMIN_RESOURCES,
} from "../../constants";
import {
  ADMIN_SUBSCRIPTION_SORT_KEYS,
  ADMIN_SUBSCRIPTION_TABLE_KEYS,
} from "../constants";
import PaymentController from "../payment.controller";
import type { IAdminSubscription } from "../types";

const money = (amount: number, currency: string) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);

export const AdminSubscriptionsPage: React.FC = () => {
  const t = useTranslate();
  useDocumentTitle(`${t(AppLocales.Admin.Subscriptions.Title)} | Admin`);
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const page = Number(params.get("page") || 1);
  const status = params.get("status") || "";
  const interval = params.get("interval") || "";
  const search = params.get("search") || "";
  const [searchInput, setSearchInput] = useState(search);
  const [records, setRecords] = useState<IAdminSubscription[]>([]);
  const [pagination, setPagination] = useState<IApiPagination | null>(null);
  const [error, setError] = useState("");
  const { isLoading, setLoading } = useLoading();
  const { can, isLoading: permissionsLoading } = usePermissions();
  const { sortBy, sortOrder, handleSort } = useSort({
    defaultSortBy: ADMIN_SUBSCRIPTION_SORT_KEYS.CREATED_AT,
    defaultSortOrder: SORT_ORDERS.DESC,
  });
  const update = useCallback(
    (values: Record<string, string | number>) =>
      setParams(
        (previous) => {
          const next = new URLSearchParams(previous);
          Object.entries(values).forEach(([key, value]) =>
            value && value !== 1
              ? next.set(key, String(value))
              : next.delete(key),
          );
          return next;
        },
        { replace: true },
      ),
    [setParams],
  );

  useEffect(() => {
    const timer = window.setTimeout(
      () =>
        searchInput !== search &&
        update({ search: searchInput.trim(), page: 1 }),
      300,
    );
    return () => window.clearTimeout(timer);
  }, [search, searchInput, update]);

  const loadSubscriptions = useCallback(async () => {
    if (
      permissionsLoading ||
      !can(ADMIN_ACTIONS.READ, ADMIN_RESOURCES.SUBSCRIPTIONS)
    )
      return;

    setError("");
    setLoading(true);

    try {
      const result = await PaymentController.getSubscriptions({
        page,
        limit: ADMIN_PAGE_SIZE,
        status: status || undefined,
        interval: interval || undefined,
        search: search || undefined,
        sort_by: sortBy,
        sort_order: sortOrder,
      });

      if (result.success) {
        setRecords(result.subscriptions);
        setPagination(result.pagination);
      } else {
        setError(
          result.error || t(AppLocales.Admin.Subscriptions.Errors.Load),
        );
      }
    } finally {
      setLoading(false);
    }
  }, [
    can,
    interval,
    page,
    permissionsLoading,
    search,
    setLoading,
    sortBy,
    sortOrder,
    status,
    t,
  ]);

  useEffect(() => {
    void loadSubscriptions();
  }, [loadSubscriptions]);

  const columns: IAdminTableColumn<IAdminSubscription>[] = useMemo(
    () => [
      {
        key: ADMIN_SUBSCRIPTION_TABLE_KEYS.SUBSCRIPTION,
        header: t(AppLocales.Admin.Subscriptions.Table.Subscription),
        render: (record) => (
          <div>
            <div className="font-semibold">{record.product_name || "—"}</div>
            <div className="font-mono text-xs opacity-60 flex items-center gap-1.5">
              <Badge
                variant={BadgeVariants.DEFAULT}
                size={ComponentSizes.XS}
                className="uppercase font-mono font-medium"
              >
                {record.provider}
              </Badge>
              <span>{record.provider_subscription_id}</span>
            </div>
          </div>
        ),
      },
      {
        key: ADMIN_SUBSCRIPTION_TABLE_KEYS.USER,
        header: t(AppLocales.Admin.Subscriptions.Table.User),
        render: (record) => (
          <div>
            <div className="font-medium">
              {record.user_name || record.username || "—"}
            </div>
            <div className="text-xs opacity-60">{record.user_email}</div>
          </div>
        ),
      },
      {
        key: ADMIN_SUBSCRIPTION_TABLE_KEYS.AMOUNT,
        header: t(AppLocales.Admin.Subscriptions.Table.Amount),
        sortKey: ADMIN_SUBSCRIPTION_SORT_KEYS.UNIT_AMOUNT,
        render: (record) => (
          <div className="font-semibold">
            {money(record.unit_amount, record.currency)}
            <span className="font-normal opacity-60"> / {record.interval}</span>
          </div>
        ),
      },
      {
        key: ADMIN_SUBSCRIPTION_TABLE_KEYS.STATUS,
        header: t(AppLocales.Admin.Common.Detail.Status),
        sortKey: ADMIN_SUBSCRIPTION_SORT_KEYS.STATUS,
        render: (record) => <StatusBadge status={record.status} />,
      },
      {
        key: ADMIN_SUBSCRIPTION_TABLE_KEYS.PERIOD,
        header: t(AppLocales.Admin.Subscriptions.Table.PeriodEnd),
        sortKey: ADMIN_SUBSCRIPTION_SORT_KEYS.CURRENT_PERIOD_END,
        render: (record) => (
          <DateTime
            value={record.current_period_end}
            format={DateTimeFormats.ADMIN}
          />
        ),
      },
      {
        key: ADMIN_SUBSCRIPTION_TABLE_KEYS.CANCELING,
        header: t(AppLocales.Admin.Subscriptions.Table.Cancellation),
        render: (record) =>
          record.cancel_at_period_end
            ? t(AppLocales.Admin.Subscriptions.Scheduled)
            : "—",
      },
    ],
    [t],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={t(AppLocales.Admin.Subscriptions.Title)}
        description={t(AppLocales.Admin.Subscriptions.Description)}
      />
      <div className="flex flex-col sm:flex-row gap-4 items-center rounded-xl border border-glass-border bg-glass-card p-4 shadow-glass-card backdrop-blur-md">
        <div className="w-full sm:w-64">
          <SearchInput
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            onClear={() => setSearchInput("")}
            placeholder={t(AppLocales.Admin.Subscriptions.Search)}
            searchableKeys={[
              t(AppLocales.Admin.Subscriptions.Table.User),
              t(AppLocales.Admin.Subscriptions.Detail.Product),
              t(AppLocales.Admin.Subscriptions.Detail.SubscriptionId),
            ]}
          />
        </div>
        <div className="w-full sm:w-48">
          <Dropdown
            value={status}
            onValueChange={(value) => update({ status: value, page: 1 })}
            options={[
              {
                value: "",
                label: t(AppLocales.Admin.Subscriptions.Filters.AllStatuses),
              },
              ...Object.values(SUBSCRIPTION_STATUS).map((value) => ({
                value,
                label: value.replace(/_/g, " "),
              })),
            ]}
          />
        </div>
        <div className="w-full sm:w-48">
          <Dropdown
            value={interval}
            onValueChange={(value) => update({ interval: value, page: 1 })}
            options={[
              {
                value: "",
                label: t(AppLocales.Admin.Subscriptions.Filters.AllIntervals),
              },
              ...Object.values(BILLING_INTERVALS).map((value) => ({
                value,
                label: value,
              })),
            ]}
          />
        </div>
      </div>
      {error ? (
        <AdminState
          icon={iconsLib.warning}
          title={t(AppLocales.Admin.Common.State.ErrorTitle)}
          message={error}
        />
      ) : !isLoading && records.length === 0 ? (
        <AdminState
          icon={iconsLib.banknotes}
          title={t(AppLocales.Admin.Common.State.EmptyTitle)}
          message={t(AppLocales.Admin.Common.State.EmptyDesc)}
        />
      ) : (
        <>
          <AdminTable
            records={records}
            columns={columns}
            getRowKey={(record) => record.id}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            onRowClick={(record) =>
              navigate(
                AppRoutes.withId(
                  AppRoutes.client.protected.admin.SUBSCRIPTION_DETAIL,
                  record.id,
                ),
              )
            }
          />
          <AdminPagination
            pagination={pagination}
            onPageChange={(value) => update({ page: value })}
          />
        </>
      )}
    </div>
  );
};
