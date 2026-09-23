import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { iconsLib } from "../../../../assets";
import {
  Badge,
  Button,
  ConfirmDialog,
  DateTime,
  DateTimeFormats,
  Dropdown,
  SearchInput,
} from "../../../../design";
import {
  BadgeVariants,
  ButtonVariants,
  ComponentSizes,
} from "../../../../design/constants";
import { useLoading } from "../../../../contexts";
import {
  SORT_ORDERS,
  useDocumentTitle,
  usePermissions,
  useSort,
} from "../../../../hooks";
import { AppLocales } from "../../../../locales/app_locales";
import type { IApiPagination } from "../../../../models";
import {
  AdminBatchActionBar,
  AdminEmptyRecycleBinButton,
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
  ADMIN_VIEW_MODES,
  type TAdminViewMode,
} from "../../constants";
import {
  ADMIN_COUPON_COLUMNS,
  ADMIN_COUPON_FILTERS,
  ADMIN_COUPON_SORT_KEYS,
  COUPON_METADATA_KEYS,
  COUPON_SYNC_STATUS,
  COUPON_TYPES,
} from "../constants";
import PaymentController from "../payment.controller";
import type { ICoupon } from "../../../payment/types";
import { useToast } from "../../../../contexts/ToastContext";

const money = (amount: number, currency: string = "usd") =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);

export const AdminCouponsPage: React.FC = () => {
  const { t } = useTranslation();
  useDocumentTitle(t(AppLocales.Admin.Coupons.Title));
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();
  const { isLoading, setLoading } = useLoading();
  const [params, setParams] = useSearchParams();

  const page = Number(params.get(ADMIN_COUPON_FILTERS.PAGE) || 1);
  const couponType = params.get(ADMIN_COUPON_FILTERS.COUPON_TYPE) || "";
  const search = params.get(ADMIN_COUPON_FILTERS.SEARCH) || "";
  const viewMode =
    (params.get(ADMIN_COUPON_FILTERS.VIEW) as TAdminViewMode) || ADMIN_VIEW_MODES.ACTIVE;
  const isDiscardedView = viewMode === ADMIN_VIEW_MODES.DISCARDED;

  const [searchInput, setSearchInput] = useState(search);
  const [records, setRecords] = useState<ICoupon[]>([]);
  const [pagination, setPagination] = useState<IApiPagination | null>(null);
  const [error, setError] = useState("");
  const [lifecycleTarget, setLifecycleTarget] = useState<{
    coupon: ICoupon;
    action:
      | typeof ADMIN_ACTIONS.DISCARD
      | typeof ADMIN_ACTIONS.UNDISCARD
      | typeof ADMIN_ACTIONS.DESTROY;
  } | null>(null);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBatchDiscardOpen, setIsBatchDiscardOpen] = useState(false);
  const [isBatchUndiscardOpen, setIsBatchUndiscardOpen] = useState(false);
  const [isBatchDestroyOpen, setIsBatchDestroyOpen] = useState(false);

  const { can, isLoading: permissionsLoading } = usePermissions();
  const canDelete = can(ADMIN_ACTIONS.DELETE, ADMIN_RESOURCES.PAYMENT_COUPONS);
  const { sortBy, sortOrder, handleSort } = useSort({
    defaultSortBy: ADMIN_COUPON_SORT_KEYS.CREATED_AT,
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
        update({
          [ADMIN_COUPON_FILTERS.SEARCH]: searchInput.trim(),
          [ADMIN_COUPON_FILTERS.PAGE]: 1,
        }),
      300,
    );
    return () => window.clearTimeout(timer);
  }, [search, searchInput, update]);

  const loadCoupons = useCallback(async () => {
    if (
      permissionsLoading ||
      !can(ADMIN_ACTIONS.READ, ADMIN_RESOURCES.PAYMENT_COUPONS)
    )
      return;

    setError("");
    setLoading(true);

    const result = await PaymentController.getCoupons({
      page,
      limit: ADMIN_PAGE_SIZE,
      coupon_type: couponType || undefined,
      search: search || undefined,
      discarded: isDiscardedView ? true : undefined,
      sort_by: sortBy,
      sort_order: sortOrder,
    });

    if (result.success) {
      setRecords(result.coupons);
      setPagination(result.pagination);
    } else {
      setError(result.error || t(AppLocales.Admin.Coupons.Errors.LoadList));
    }
    setLoading(false);
  }, [
    page,
    couponType,
    search,
    isDiscardedView,
    sortBy,
    sortOrder,
    permissionsLoading,
    can,
    setLoading,
    t,
  ]);

  useEffect(() => {
    void loadCoupons();
  }, [loadCoupons]);

  const handleExecuteLifecycleAction = async () => {
    if (!lifecycleTarget) return;

    setLoading(true);
    const { coupon, action } = lifecycleTarget;

    if (action === ADMIN_ACTIONS.DISCARD) {
      const result = await PaymentController.discardCoupon(coupon.id);
      if (result.success) {
        success(t(AppLocales.Admin.Coupons.Toasts.DiscardSuccess));
        setLifecycleTarget(null);
        setSelectedIds((prev) => prev.filter((id) => id !== coupon.id));
        void loadCoupons();
      } else {
        toastError(result.error || t(AppLocales.Admin.Coupons.Errors.Discard));
      }
    } else if (action === ADMIN_ACTIONS.UNDISCARD) {
      const result = await PaymentController.undiscardCoupon(coupon.id);
      if (result.success) {
        success(t(AppLocales.Admin.Coupons.Toasts.RestoreSuccess));
        setLifecycleTarget(null);
        setSelectedIds((prev) => prev.filter((id) => id !== coupon.id));
        void loadCoupons();
      } else {
        toastError(result.error || t(AppLocales.Admin.Coupons.Errors.Restore));
      }
    } else {
      const result = await PaymentController.destroyCoupon(coupon.id);
      if (result.success) {
        success(t(AppLocales.Admin.Coupons.Toasts.DestroySuccess));
        setLifecycleTarget(null);
        setSelectedIds((prev) => prev.filter((id) => id !== coupon.id));
        void loadCoupons();
      } else {
        toastError(result.error || t(AppLocales.Admin.Coupons.Errors.Destroy));
      }
    }
    setLoading(false);
  };

  const handleBatchDiscard = async () => {
    if (selectedIds.length === 0) return;
    setLoading(true);
    try {
      const res = await PaymentController.discardBatch(selectedIds);
      if (res.success) {
        success(t(AppLocales.Admin.Coupons.Toasts.BatchDiscardSuccess));
        setIsBatchDiscardOpen(false);
        setSelectedIds([]);
        void loadCoupons();
      } else {
        toastError(
          res.error || t(AppLocales.Admin.Coupons.Errors.BatchDiscard),
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBatchUndiscard = async () => {
    if (selectedIds.length === 0) return;
    setLoading(true);
    try {
      const res = await PaymentController.undiscardBatch(selectedIds);
      if (res.success) {
        success(t(AppLocales.Admin.Coupons.Toasts.BatchRestoreSuccess));
        setIsBatchUndiscardOpen(false);
        setSelectedIds([]);
        void loadCoupons();
      } else {
        toastError(
          res.error || t(AppLocales.Admin.Coupons.Errors.BatchRestore),
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBatchDestroy = async () => {
    if (selectedIds.length === 0) return;
    setLoading(true);
    try {
      const res = await PaymentController.destroyBatch(selectedIds);
      if (res.success) {
        success(t(AppLocales.Admin.Coupons.Toasts.BatchDestroySuccess));
        setIsBatchDestroyOpen(false);
        setSelectedIds([]);
        void loadCoupons();
      } else {
        toastError(
          res.error || t(AppLocales.Admin.Coupons.Errors.BatchDestroy),
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmptyRecycleBin = async () => {
    setLoading(true);
    try {
      const res = await PaymentController.emptyRecycleBin();
      if (res.success) {
        success(t(AppLocales.Admin.Coupons.Toasts.RecycleBinEmptied));
        setSelectedIds([]);
        void loadCoupons();
      } else {
        toastError(
          res.error || t(AppLocales.Admin.Coupons.Errors.EmptyRecycleBin),
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const batchActions = useMemo(() => {
    if (!isDiscardedView) {
      return [
        {
          key: "batch-discard",
          label: t(AppLocales.Admin.Common.Batch.DiscardSelected),
          icon: iconsLib.trash,
          isDestructive: true,
          onClick: () => setIsBatchDiscardOpen(true),
        },
      ];
    }

    return [
      {
        key: "batch-undiscard",
        label: t(AppLocales.Admin.Common.Batch.RestoreSelected),
        icon: iconsLib.arrowPath,
        variant: ButtonVariants.SECONDARY,
        onClick: () => setIsBatchUndiscardOpen(true),
      },
      {
        key: "batch-destroy",
        label: t(AppLocales.Admin.Common.Batch.DestroySelected),
        icon: iconsLib.trash,
        isDestructive: true,
        onClick: () => setIsBatchDestroyOpen(true),
      },
    ];
  }, [isDiscardedView, t]);

  const columns: IAdminTableColumn<ICoupon>[] = useMemo(
    () => [
      {
        key: ADMIN_COUPON_COLUMNS.CODE,
        header: t(AppLocales.Admin.Coupons.Table.Code),
        sortKey: ADMIN_COUPON_SORT_KEYS.CODE,
        render: (coupon) => {
          const syncStatus = coupon.metadata?.[COUPON_METADATA_KEYS.STATUS]
            ?.toString()
            .toLowerCase();
          const syncError = coupon.metadata?.[COUPON_METADATA_KEYS.SYNC_ERROR]
            ? String(coupon.metadata[COUPON_METADATA_KEYS.SYNC_ERROR])
            : undefined;

          return (
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  coupon.active ? BadgeVariants.PRIMARY : BadgeVariants.DEFAULT
                }
                size={ComponentSizes.MD}
                className="font-mono font-bold tracking-wider"
              >
                {coupon.code}
              </Badge>
              {syncStatus === COUPON_SYNC_STATUS.PROCESSING && (
                <Badge variant={BadgeVariants.WARNING} size={ComponentSizes.SM}>
                  {t(AppLocales.Admin.Coupons.Status.Processing)}
                </Badge>
              )}
              {syncStatus === COUPON_SYNC_STATUS.FAILED && (
                <Badge
                  variant={BadgeVariants.ERROR}
                  size={ComponentSizes.SM}
                  title={syncError}
                >
                  {t(AppLocales.Admin.Coupons.Status.Failed)}
                </Badge>
              )}
              {coupon.referrer_id && (
                <Badge variant={BadgeVariants.INFO} size={ComponentSizes.SM}>
                  {t(AppLocales.Admin.Coupons.Table.Referral)}
                </Badge>
              )}
            </div>
          );
        },
      },
      {
        key: ADMIN_COUPON_COLUMNS.TITLE,
        header: t(AppLocales.Admin.Coupons.Table.Title),
        sortKey: ADMIN_COUPON_SORT_KEYS.TITLE,
        render: (coupon) => (
          <div>
            <span className="font-semibold text-base-content block">
              {coupon.title}
            </span>
            {coupon.description && (
              <span className="text-xs text-base-content/60 line-clamp-1">
                {coupon.description}
              </span>
            )}
          </div>
        ),
      },
      {
        key: ADMIN_COUPON_COLUMNS.AMOUNT,
        header: t(AppLocales.Admin.Coupons.Table.Discount),
        sortKey: ADMIN_COUPON_SORT_KEYS.AMOUNT,
        render: (coupon) => (
          <span className="font-semibold text-success">
            {coupon.coupon_type === COUPON_TYPES.PERCENTAGE
              ? `${coupon.amount}% ${t(AppLocales.Admin.Coupons.Table.Off)}`
              : `${money(coupon.amount, coupon.currency || "usd")} ${t(AppLocales.Admin.Coupons.Table.Off)}`}
          </span>
        ),
      },
      {
        key: ADMIN_COUPON_COLUMNS.USED_COUNT,
        header: t(AppLocales.Admin.Coupons.Table.Usage),
        sortKey: ADMIN_COUPON_SORT_KEYS.USED_COUNT,
        render: (coupon) => {
          const isUnlimited = coupon.max_usage === 0;
          return (
            <div>
              <span className="text-sm font-medium">
                {coupon.used_count} / {isUnlimited ? "∞" : coupon.max_usage}
              </span>
              <span className="text-xs text-base-content/50 block">
                {t(AppLocales.Admin.Coupons.Table.MaxPerUser, {
                  count: coupon.max_usage_per_user,
                })}
              </span>
            </div>
          );
        },
      },
      {
        key: ADMIN_COUPON_COLUMNS.EXPIRES_AT,
        header: t(AppLocales.Admin.Coupons.Table.Expires),
        sortKey: ADMIN_COUPON_SORT_KEYS.EXPIRES_AT,
        render: (coupon) =>
          coupon.expires_at ? (
            <DateTime
              value={coupon.expires_at}
              format={DateTimeFormats.DATE_TIME}
              fallback={t(AppLocales.Admin.Coupons.Table.Never)}
            />
          ) : (
            <span className="text-xs text-base-content/60">
              {t(AppLocales.Admin.Coupons.Table.Never)}
            </span>
          ),
      },
      {
        key: ADMIN_COUPON_COLUMNS.CREATED_AT,
        header: t(AppLocales.Admin.Coupons.Table.Created),
        sortKey: ADMIN_COUPON_SORT_KEYS.CREATED_AT,
        render: (coupon) => (
          <DateTime
            value={coupon.created_at}
            format={DateTimeFormats.DATE}
            fallback="—"
          />
        ),
      },
      {
        key: ADMIN_COUPON_COLUMNS.ACTIONS,
        header: t(AppLocales.Admin.Coupons.Table.Actions),
        className: "text-right",
        render: (coupon) => (
          <div
            className="flex items-center justify-end gap-1.5"
            onClick={(e) => e.stopPropagation()}
          >
            {isDiscardedView
              ? canDelete && (
                  <>
                    <Button
                      variant={ButtonVariants.TERTIARY}
                      size={ComponentSizes.SM}
                      onClick={() =>
                        setLifecycleTarget({
                          coupon,
                          action: ADMIN_ACTIONS.UNDISCARD,
                        })
                      }
                      title={t(AppLocales.Admin.Common.Actions.Restore)}
                    >
                      <iconsLib.arrowPath className="w-4 h-4 text-success" />
                    </Button>
                    <Button
                      variant={ButtonVariants.TERTIARY}
                      size={ComponentSizes.SM}
                      onClick={() =>
                        setLifecycleTarget({
                          coupon,
                          action: ADMIN_ACTIONS.DESTROY,
                        })
                      }
                      title={t(AppLocales.Admin.Common.Actions.Destroy)}
                    >
                      <iconsLib.trash className="w-4 h-4 text-error" />
                    </Button>
                  </>
                )
              : canDelete && (
                  <Button
                    variant={ButtonVariants.TERTIARY}
                    size={ComponentSizes.SM}
                    onClick={() =>
                      setLifecycleTarget({
                        coupon,
                        action: ADMIN_ACTIONS.DISCARD,
                      })
                    }
                    title={t(AppLocales.Admin.Common.Actions.Discard)}
                  >
                    <iconsLib.trash className="w-4 h-4 text-error" />
                  </Button>
                )}
          </div>
        ),
      },
    ],
    [canDelete, isDiscardedView, navigate, t],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={t(AppLocales.Admin.Coupons.Title)}
        description={t(AppLocales.Admin.Coupons.Description)}
        action={
          <div className="flex items-center gap-3">
            <Button
              variant={ButtonVariants.SECONDARY}
              size={ComponentSizes.MD}
              onClick={() =>
                navigate(AppRoutes.client.protected.admin.USER_COUPONS)
              }
            >
              <iconsLib.document className="w-4 h-4 mr-1.5" />
              {t(AppLocales.Admin.Coupons.LedgerButton)}
            </Button>
            {can(ADMIN_ACTIONS.CREATE, ADMIN_RESOURCES.PAYMENT_COUPONS) && (
              <Button
                variant={ButtonVariants.PRIMARY}
                size={ComponentSizes.MD}
                onClick={() =>
                  navigate(AppRoutes.client.protected.admin.COUPON_CREATE)
                }
              >
                <iconsLib.plus className="w-4 h-4 mr-1.5" />
                {t(AppLocales.Admin.Coupons.CreateButton)}
              </Button>
            )}
          </div>
        }
      />

      {/* Tabs: Active vs Recycle Bin */}
      <div className="flex justify-between items-center border-b border-base-300 pb-3 flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant={
              !isDiscardedView
                ? ButtonVariants.PRIMARY
                : ButtonVariants.TERTIARY
            }
            size={ComponentSizes.SM}
            onClick={() => {
              setSelectedIds([]);
              update({
                [ADMIN_COUPON_FILTERS.VIEW]: ADMIN_VIEW_MODES.ACTIVE,
                [ADMIN_COUPON_FILTERS.PAGE]: 1,
              });
            }}
          >
            {t(AppLocales.Admin.Coupons.Tabs.Active)}
          </Button>
          <Button
            variant={
              isDiscardedView ? ButtonVariants.PRIMARY : ButtonVariants.TERTIARY
            }
            size={ComponentSizes.SM}
            onClick={() => {
              setSelectedIds([]);
              update({
                [ADMIN_COUPON_FILTERS.VIEW]: ADMIN_VIEW_MODES.DISCARDED,
                [ADMIN_COUPON_FILTERS.PAGE]: 1,
              });
            }}
            className="flex items-center gap-1.5"
          >
            <iconsLib.trash className="w-4 h-4" />
            {t(AppLocales.Admin.Coupons.Tabs.RecycleBin)}
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="w-64">
            <SearchInput
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onClear={() => setSearchInput("")}
              placeholder={t(AppLocales.Admin.Coupons.SearchPlaceholder)}
            />
          </div>

          <div className="w-40">
            <Dropdown
              value={couponType}
              onValueChange={(value) =>
                update({
                  [ADMIN_COUPON_FILTERS.COUPON_TYPE]: value,
                  [ADMIN_COUPON_FILTERS.PAGE]: 1,
                })
              }
              placeholder={t(AppLocales.Admin.Coupons.FilterAll)}
              options={[
                { value: "", label: t(AppLocales.Admin.Coupons.FilterAll) },
                {
                  value: COUPON_TYPES.PERCENTAGE,
                  label: t(AppLocales.Admin.Coupons.FilterPercentage),
                },
                {
                  value: COUPON_TYPES.FIXED,
                  label: t(AppLocales.Admin.Coupons.FilterFixed),
                },
              ]}
            />
          </div>

          {isDiscardedView && canDelete && (
            <div className="w-full sm:w-auto sm:ml-auto">
              <AdminEmptyRecycleBinButton
                onConfirm={handleEmptyRecycleBin}
                count={pagination?.total_count}
                disabled={records.length === 0}
              />
            </div>
          )}
        </div>
      </div>

      {/* Batch Action Bar */}
      {selectedIds.length > 0 && (
        <AdminBatchActionBar
          selectedCount={selectedIds.length}
          onClearSelection={() => setSelectedIds([])}
          actions={batchActions}
        />
      )}

      {/* Content */}
      {error ? (
        <AdminState
          icon={iconsLib.warning}
          title={t(AppLocales.Admin.Coupons.Errors.LoadList)}
          message={error}
        />
      ) : !isLoading && records.length === 0 ? (
        <AdminState
          icon={iconsLib.tag}
          title={
            isDiscardedView
              ? t(AppLocales.Admin.Coupons.RecycleTitle)
              : t(AppLocales.Admin.Coupons.Title)
          }
          message={
            isDiscardedView
              ? t(AppLocales.Admin.Coupons.RecycleDescription)
              : t(AppLocales.Admin.Coupons.Description)
          }
        />
      ) : (
        <>
          <AdminTable
            columns={columns}
            records={records}
            getRowKey={(coupon) => coupon.id}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            onRowClick={(coupon) =>
              navigate(
                AppRoutes.withId(
                  AppRoutes.client.protected.admin.COUPON_DETAIL,
                  coupon.id,
                ),
              )
            }
            selectable={canDelete}
            selectedRowKeys={selectedIds}
            onSelectRow={(id, selected) => {
              setSelectedIds((prev) =>
                selected ? [...prev, id] : prev.filter((item) => item !== id),
              );
            }}
            onSelectAll={(selected) => {
              setSelectedIds(selected ? records.map((item) => item.id) : []);
            }}
          />
          <AdminPagination
            pagination={pagination}
            onPageChange={(nextPage) => update({ page: nextPage })}
          />
        </>
      )}

      {/* Single Lifecycle Confirm Dialog */}
      <ConfirmDialog
        isOpen={Boolean(lifecycleTarget)}
        onClose={() => setLifecycleTarget(null)}
        onConfirm={() => void handleExecuteLifecycleAction()}
        title={
          lifecycleTarget?.action === ADMIN_ACTIONS.DISCARD
            ? t(AppLocales.Admin.Common.Confirm.DiscardTitle)
            : lifecycleTarget?.action === ADMIN_ACTIONS.UNDISCARD
              ? t(AppLocales.Admin.Common.Confirm.RestoreTitle)
              : t(AppLocales.Admin.Common.Confirm.DestroyTitle)
        }
        message={
          lifecycleTarget?.action === ADMIN_ACTIONS.DISCARD
            ? t(AppLocales.Admin.Common.Confirm.DiscardMessage)
            : lifecycleTarget?.action === ADMIN_ACTIONS.UNDISCARD
              ? t(AppLocales.Admin.Common.Confirm.RestoreMessage)
              : t(AppLocales.Admin.Common.Confirm.DestroyMessage)
        }
        confirmLabel={
          lifecycleTarget?.action === ADMIN_ACTIONS.DISCARD
            ? t(AppLocales.Admin.Common.Actions.Discard)
            : lifecycleTarget?.action === ADMIN_ACTIONS.UNDISCARD
              ? t(AppLocales.Admin.Common.Actions.Restore)
              : t(AppLocales.Admin.Common.Actions.Destroy)
        }
        cancelLabel={t(AppLocales.Admin.Common.Actions.Cancel)}
        isDestructive={
          lifecycleTarget?.action === ADMIN_ACTIONS.DISCARD ||
          lifecycleTarget?.action === ADMIN_ACTIONS.DESTROY
        }
        isLoading={isLoading}
      />

      {/* Batch Discard Confirm Dialog */}
      <ConfirmDialog
        isOpen={isBatchDiscardOpen}
        onClose={() => setIsBatchDiscardOpen(false)}
        onConfirm={() => void handleBatchDiscard()}
        title={t(AppLocales.Admin.Common.Batch.ConfirmDiscardTitle)}
        message={t(AppLocales.Admin.Common.Batch.ConfirmDiscardMessage)}
        confirmLabel={t(AppLocales.Admin.Common.Batch.DiscardSelected)}
        cancelLabel={t(AppLocales.Admin.Common.Actions.Cancel)}
        isDestructive={true}
        isLoading={isLoading}
      />

      {/* Batch Undiscard Confirm Dialog */}
      <ConfirmDialog
        isOpen={isBatchUndiscardOpen}
        onClose={() => setIsBatchUndiscardOpen(false)}
        onConfirm={() => void handleBatchUndiscard()}
        title={t(AppLocales.Admin.Common.Batch.ConfirmRestoreTitle)}
        message={t(AppLocales.Admin.Common.Batch.ConfirmRestoreMessage)}
        confirmLabel={t(AppLocales.Admin.Common.Batch.RestoreSelected)}
        cancelLabel={t(AppLocales.Admin.Common.Actions.Cancel)}
        isDestructive={false}
        isLoading={isLoading}
      />

      {/* Batch Destroy Confirm Dialog */}
      <ConfirmDialog
        isOpen={isBatchDestroyOpen}
        onClose={() => setIsBatchDestroyOpen(false)}
        onConfirm={() => void handleBatchDestroy()}
        title={t(AppLocales.Admin.Common.Batch.ConfirmDestroyTitle)}
        message={t(AppLocales.Admin.Common.Batch.ConfirmDestroyMessage)}
        confirmLabel={t(AppLocales.Admin.Common.Batch.DestroySelected)}
        cancelLabel={t(AppLocales.Admin.Common.Actions.Cancel)}
        isDestructive={true}
        isLoading={isLoading}
      />
    </div>
  );
};
