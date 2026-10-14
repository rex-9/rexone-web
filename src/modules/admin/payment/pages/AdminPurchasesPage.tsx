import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { iconsLib } from "../../../../assets";
import {
  DateTime,
  DateTimeFormats,
  Dropdown,
  DropdownSizes,
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
  ADMIN_ACTIONS,
  ADMIN_PAGE_SIZE,
  ADMIN_RESOURCES,
} from "../../constants";
import {
  AdminPagination,
  AdminState,
  AdminTable,
  PageHeader,
  type IAdminTableColumn,
} from "../../components";
import PaymentController from "../payment.controller";
import {
  ADMIN_PURCHASE_SORT_KEYS,
  ADMIN_PURCHASE_TABLE_KEYS,
} from "../constants";
import type { IAdminPurchase } from "../types";
import { PURCHASE_STATUS } from "../../../payment/constants";

const money = (amount: number, currency: string) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);

export const AdminPurchasesPage: React.FC = () => {
  const t = useTranslate();
  useDocumentTitle(`${t(AppLocales.Admin.Purchases.Title)} | Admin`);
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const page = Number(params.get("page") || 1);
  const status = params.get("status") || "";
  const search = params.get("search") || "";
  const [searchInput, setSearchInput] = useState(search);
  const [records, setRecords] = useState<IAdminPurchase[]>([]);
  const [pagination, setPagination] = useState<IApiPagination | null>(null);
  const [error, setError] = useState("");
  const { isLoading, setLoading } = useLoading();
  const { can, isLoading: permissionsLoading } = usePermissions();
  const { sortBy, sortOrder, handleSort } = useSort({
    defaultSortBy: ADMIN_PURCHASE_SORT_KEYS.CREATED_AT,
    defaultSortOrder: SORT_ORDERS.DESC,
  });

  const update = useCallback(
    (values: Record<string, string | number>) => {
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
      );
    },
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

  const loadPurchases = useCallback(async () => {
    if (
      permissionsLoading ||
      !can(ADMIN_ACTIONS.READ, ADMIN_RESOURCES.PURCHASES)
    )
      return;

    setError("");
    setLoading(true);

    try {
      const result = await PaymentController.getPurchases({
        page,
        limit: ADMIN_PAGE_SIZE,
        status: status || undefined,
        search: search || undefined,
        sort_by: sortBy,
        sort_order: sortOrder,
      });

      if (result.success) {
        setRecords(result.purchases);
        setPagination(result.pagination);
      } else {
        setError(
          result.error || t(AppLocales.Admin.Purchases.Errors.Load),
        );
      }
    } finally {
      setLoading(false);
    }
  }, [
    can,
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
    void loadPurchases();
  }, [loadPurchases]);

  const columns: IAdminTableColumn<IAdminPurchase>[] = useMemo(
    () => [
      {
        key: ADMIN_PURCHASE_TABLE_KEYS.PURCHASE,
        header: t(AppLocales.Admin.Purchases.Table.Purchase),
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
              <span>{record.provider_payment_id}</span>
            </div>
          </div>
        ),
      },
      {
        key: ADMIN_PURCHASE_TABLE_KEYS.USER,
        header: t(AppLocales.Admin.Purchases.Table.User),
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
        key: ADMIN_PURCHASE_TABLE_KEYS.AMOUNT,
        header: t(AppLocales.Admin.Purchases.Table.Amount),
        sortKey: ADMIN_PURCHASE_SORT_KEYS.UNIT_AMOUNT,
        render: (record) => (
          <span className="font-semibold">
            {money(record.unit_amount, record.currency)}
          </span>
        ),
      },
      {
        key: ADMIN_PURCHASE_TABLE_KEYS.STATUS,
        header: t(AppLocales.Admin.Common.Detail.Status),
        sortKey: ADMIN_PURCHASE_SORT_KEYS.STATUS,
        render: (record) => <StatusBadge status={record.status} />,
      },
      {
        key: ADMIN_PURCHASE_TABLE_KEYS.METHOD,
        header: t(AppLocales.Admin.Purchases.Table.Method),
        render: (record) => record.payment_method_display || "—",
      },
      {
        key: ADMIN_PURCHASE_TABLE_KEYS.CREATED,
        header: t(AppLocales.Admin.Common.Detail.Created),
        sortKey: ADMIN_PURCHASE_SORT_KEYS.CREATED_AT,
        render: (record) => (
          <DateTime
            value={record.paid_at || record.created_at}
            format={DateTimeFormats.ADMIN}
          />
        ),
      },
    ],
    [t],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={t(AppLocales.Admin.Purchases.Title)}
        description={t(AppLocales.Admin.Purchases.Description)}
      />
      <div className="flex flex-col sm:flex-row gap-4 items-center rounded-xl border border-glass-border bg-glass-card p-4 shadow-glass-card backdrop-blur-md">
        <div className="w-full sm:w-64">
          <SearchInput
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            onClear={() => setSearchInput("")}
            placeholder={t(AppLocales.Admin.Purchases.Search)}
            searchableKeys={[
              t(AppLocales.Admin.Purchases.Table.User),
              t(AppLocales.Admin.Purchases.Detail.Product),
              t(AppLocales.Admin.Purchases.Detail.PaymentIntent),
              t(AppLocales.Admin.Purchases.Detail.Charge),
            ]}
          />
        </div>
        <div className="w-full sm:w-48">
          <Dropdown
            size={DropdownSizes.MD}
            value={status}
            onValueChange={(value) => update({ status: value, page: 1 })}
            options={[
              { value: "", label: t(AppLocales.Admin.Purchases.Filters.All) },
              ...Object.values(PURCHASE_STATUS).map((value) => ({
                value,
                label: value.replace(/_/g, " "),
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
                  AppRoutes.client.protected.admin.PURCHASE_DETAIL,
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
export default AdminPurchasesPage;
