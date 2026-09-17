import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AppRoutes from "../../../../AppRoutes";
import { iconsLib } from "../../../../assets";
import { useLoading } from "../../../../contexts";
import {
  Badge,
  DateTime,
  DateTimeFormats,
  Dropdown,
  SearchInput,
} from "../../../../design";
import {
  BadgeVariants,
  ComponentSizes,
} from "../../../../design/constants";
import {
  SORT_ORDERS,
  usePermissions,
  useSort,
} from "../../../../hooks";
import { AppLocales } from "../../../../locales/app_locales";
import {
  AdminPagination,
  AdminState,
  AdminTable,
  type IAdminTableColumn,
} from "../../components";
import {
  ADMIN_ACTIONS,
  ADMIN_PAGE_SIZE,
  ADMIN_RESOURCES,
} from "../../constants";
import { ADMIN_USER_COUPON_SORT_KEYS } from "../constants";
import PaymentController from "../payment.controller";
import type { IUserCoupon } from "../../../payment/types";
import type { IApiPagination } from "../../../../models";

const money = (amount: number, currency: string = "usd") =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);

export interface IAdminRedemptionsTableProps {
  couponId?: string;
  hideCouponColumn?: boolean;
}

export const AdminRedemptionsTable: React.FC<IAdminRedemptionsTableProps> = ({
  couponId,
  hideCouponColumn = false,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { isLoading, setLoading } = useLoading();

  const page = Number(params.get("page") || 1);
  const purchaseType = params.get("purchase_type") || "";
  const search = params.get("search") || "";

  const [searchInput, setSearchInput] = useState(search);
  const [records, setRecords] = useState<IUserCoupon[]>([]);
  const [pagination, setPagination] = useState<IApiPagination | null>(null);
  const [error, setError] = useState("");

  const { can, isLoading: permissionsLoading } = usePermissions();

  const { sortBy, sortOrder, handleSort } = useSort({
    defaultSortBy: ADMIN_USER_COUPON_SORT_KEYS.CREATED_AT,
    defaultSortOrder: SORT_ORDERS.DESC,
  });

  const update = useCallback(
    (values: Record<string, string | number | undefined>) =>
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

  const loadRedemptions = useCallback(async () => {
    const requiredResource = couponId
      ? ADMIN_RESOURCES.PAYMENT_COUPONS
      : ADMIN_RESOURCES.PAYMENT_USER_COUPONS;

    if (permissionsLoading || !can(ADMIN_ACTIONS.READ, requiredResource)) {
      return;
    }

    setLoading(true);
    setError("");

    const filterParams = {
      page,
      limit: ADMIN_PAGE_SIZE,
      purchase_type: purchaseType || undefined,
      search: search || undefined,
      sort_by: sortBy,
      sort_order: sortOrder,
    };

    const result = couponId
      ? await PaymentController.getCouponRedemptions(couponId, filterParams)
      : await PaymentController.getUserCoupons(filterParams);

    if (result.success) {
      const loadedRecords = couponId
        ? (result as { redemptions: IUserCoupon[] }).redemptions
        : (result as { userCoupons: IUserCoupon[] }).userCoupons;
      setRecords(loadedRecords);
      setPagination(result.pagination);
    } else {
      setError(result.error || t(AppLocales.Admin.UserCoupons.Errors.Load));
    }

    setLoading(false);
  }, [
    couponId,
    page,
    purchaseType,
    search,
    sortBy,
    sortOrder,
    permissionsLoading,
    can,
    setLoading,
    t,
  ]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadRedemptions();
  }, [loadRedemptions]);

  const columns: IAdminTableColumn<IUserCoupon>[] = [
    ...(!hideCouponColumn
      ? [
          {
            key: "coupon_code",
            header: t(AppLocales.Admin.UserCoupons.Table.Code),
            sortKey: ADMIN_USER_COUPON_SORT_KEYS.COUPON_CODE,
            render: (item: IUserCoupon) => (
              <div>
                <Badge
                  variant={BadgeVariants.PRIMARY}
                  size={ComponentSizes.MD}
                  className="font-mono font-bold tracking-wider cursor-pointer"
                  onClick={() =>
                    navigate(
                      AppRoutes.withId(
                        AppRoutes.client.protected.admin.COUPON_DETAIL,
                        item.coupon_id,
                      ),
                    )
                  }
                >
                  {item.coupon_code || "—"}
                </Badge>
                {item.coupon_title && (
                  <span className="text-xs text-base-content/60 block mt-1">
                    {item.coupon_title}
                  </span>
                )}
              </div>
            ),
          },
        ]
      : []),
    {
      key: "user_email",
      header: t(AppLocales.Admin.UserCoupons.Table.User),
      sortKey: ADMIN_USER_COUPON_SORT_KEYS.USER_EMAIL,
      render: (item) => (
        <div>
          <span className="font-medium text-sm block">
            {item.user_email || "—"}
          </span>
          {item.user_name && item.user_name !== item.user_email && (
            <span className="text-xs text-base-content/60 block">
              {item.user_name}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "product_name",
      header: t(AppLocales.Admin.UserCoupons.Table.Product),
      sortKey: ADMIN_USER_COUPON_SORT_KEYS.PRODUCT_NAME,
      render: (item) => (
        <div>
          <span className="font-medium text-sm block">
            {item.product_name || "—"}
          </span>
        </div>
      ),
    },
    {
      key: "purchase_type",
      header: t(AppLocales.Admin.UserCoupons.Table.Type),
      sortKey: ADMIN_USER_COUPON_SORT_KEYS.PURCHASE_TYPE,
      render: (item) => (
        <Badge
          variant={
            item.purchase_type === "sbs"
              ? BadgeVariants.INFO
              : BadgeVariants.DEFAULT
          }
          size={ComponentSizes.SM}
        >
          {item.purchase_type === "sbs"
            ? t(AppLocales.Admin.UserCoupons.Types.Subscription)
            : t(AppLocales.Admin.UserCoupons.Types.Transaction)}
        </Badge>
      ),
    },
    {
      key: "discount",
      header: t(AppLocales.Admin.UserCoupons.Table.Discount),
      sortKey: ADMIN_USER_COUPON_SORT_KEYS.DISCOUNT_AMOUNT,
      render: (item) => (
        <div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="line-through text-base-content/50">
              {money(item.original_amount, item.currency)}
            </span>
            <span className="text-success font-semibold">
              -{money(item.discount_amount, item.currency)}
            </span>
          </div>
          <span className="font-bold text-sm text-base-content">
            {item.final_amount === 0
              ? t(AppLocales.Admin.UserCoupons.Free)
              : money(item.final_amount, item.currency)}
          </span>
        </div>
      ),
    },
    {
      key: "created_at",
      header: t(AppLocales.Admin.UserCoupons.Table.Date),
      sortKey: ADMIN_USER_COUPON_SORT_KEYS.CREATED_AT,
      render: (item) => (
        <DateTime
          value={item.created_at}
          format={DateTimeFormats.DATE_TIME}
          fallback="—"
        />
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Filter and Search Bar */}
      <div className="flex justify-between items-center border-b border-base-300 pb-3 flex-wrap gap-4">
        <div className="w-72">
          <SearchInput
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onClear={() => setSearchInput("")}
            placeholder={t(AppLocales.Admin.UserCoupons.SearchPlaceholder)}
          />
        </div>

        <div className="w-48">
          <Dropdown
            value={purchaseType}
            onValueChange={(val) => update({ purchase_type: val, page: 1 })}
            placeholder={t(AppLocales.Admin.UserCoupons.FilterAll)}
            options={[
              { value: "", label: t(AppLocales.Admin.UserCoupons.FilterAll) },
              { value: "trx", label: t(AppLocales.Admin.UserCoupons.FilterTrx) },
              { value: "sbs", label: t(AppLocales.Admin.UserCoupons.FilterSbs) },
            ]}
          />
        </div>
      </div>

      {/* Table Content */}
      {error ? (
        <AdminState
          icon={iconsLib.warning}
          title={t(AppLocales.Admin.UserCoupons.Errors.Load)}
          message={error}
        />
      ) : !isLoading && records.length === 0 ? (
        <AdminState
          icon={iconsLib.document}
          title={t(AppLocales.Admin.UserCoupons.Empty)}
          message={t(AppLocales.Admin.UserCoupons.EmptyDescription)}
        />
      ) : (
        <>
          <AdminTable
            columns={columns}
            records={records}
            getRowKey={(item) => item.id}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
          />

          <AdminPagination
            pagination={pagination}
            onPageChange={(nextPage) => update({ page: nextPage })}
          />
        </>
      )}
    </div>
  );
};
export default AdminRedemptionsTable;
