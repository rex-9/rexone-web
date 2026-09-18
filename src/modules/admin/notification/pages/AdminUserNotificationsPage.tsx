// src/modules/admin/notification/pages/AdminUserNotificationsPage.tsx

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { iconsLib } from "../../../../assets";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useToast } from "../../../../contexts/ToastContext";
import {
  Badge,
  DateTime,
  DateTimeFormats,
  Dropdown,
  SearchInput,
  Tabs,
} from "../../../../design";
import {
  BadgeVariants,
  ButtonVariants,
  DropdownSizes,
} from "../../../../design/constants";
import {
  useDocumentTitle,
  usePermissions,
  useSort,
  SORT_ORDERS,
} from "../../../../hooks";
import { AppLocales, useTranslate } from "../../../../locales";
import type { IApiPagination } from "../../../../models";
import {
  AdminBatchActionBar,
  AdminEmptyRecycleBinButton,
  AdminPagination,
  AdminState,
  AdminTable,
  AdminTableActions,
  ConfirmDialog,
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
  ADMIN_USER_NOTIFICATION_CLIENT_FILTERS,
  ADMIN_USER_NOTIFICATION_SORT_KEYS,
  ADMIN_USER_NOTIFICATION_STATUS_FILTERS,
} from "../constants";
import NotificationController from "../notification.controller";
import type { IAdminUserNotification } from "../types";

interface IAdminUserNotificationsPageProps {
  view?: TAdminViewMode;
  embedded?: boolean;
}

export const AdminUserNotificationsPage: React.FC<
  IAdminUserNotificationsPageProps
> = ({ view: initialView = ADMIN_VIEW_MODES.ACTIVE, embedded = false }) => {
  const t = useTranslate();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useToast();
  const { isLoading, setLoading } = useLoading();
  const { can } = usePermissions();

  const viewParam = searchParams.get("view") as TAdminViewMode | null;
  const [localView, setLocalView] = useState<TAdminViewMode>(
    viewParam === ADMIN_VIEW_MODES.DISCARDED
      ? ADMIN_VIEW_MODES.DISCARDED
      : initialView,
  );
  const currentView = embedded ? localView : initialView;
  const isActive = currentView === ADMIN_VIEW_MODES.ACTIVE;

  useEffect(() => {
    if (embedded && viewParam) {
      setLocalView(viewParam);
    }
  }, [embedded, viewParam]);

  useDocumentTitle(
    embedded
      ? `${t(AppLocales.Admin.Notifications.Title)} | Admin`
      : isActive
        ? `${t(AppLocales.Admin.Notifications.UserNotifications.Title)} | Admin`
        : `${t(AppLocales.Admin.Notifications.UserNotifications.RecycleTitle)} | Admin`,
  );

  const canDelete = can(
    ADMIN_ACTIONS.DELETE,
    ADMIN_RESOURCES.USER_NOTIFICATIONS,
  );

  const page = parseInt(searchParams.get("page") || "1", 10);
  const searchQuery = searchParams.get("search") || "";
  const [searchInput, setSearchInput] = useState(searchQuery);
  const clientFilter = searchParams.get("client") || "";
  const statusFilter = searchParams.get("status") || "";

  const { sortBy, sortOrder, handleSort } = useSort({
    defaultSortBy: isActive
      ? ADMIN_USER_NOTIFICATION_SORT_KEYS.CREATED_AT
      : ADMIN_USER_NOTIFICATION_SORT_KEYS.DISCARDED_AT,
    defaultSortOrder: SORT_ORDERS.DESC,
  });

  const [notifications, setNotifications] = useState<IAdminUserNotification[]>(
    [],
  );
  const [pagination, setPagination] = useState<IApiPagination | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Keep local search input in sync if URL search param changes externally
  useEffect(() => {
    const timeoutId = window.setTimeout(() => setSearchInput(searchQuery), 0);
    return () => window.clearTimeout(timeoutId);
  }, [searchQuery]);

  // Dialog targets
  const [discardTarget, setDiscardTarget] =
    useState<IAdminUserNotification | null>(null);
  const [undiscardTarget, setUndiscardTarget] =
    useState<IAdminUserNotification | null>(null);
  const [destroyTarget, setDestroyTarget] =
    useState<IAdminUserNotification | null>(null);

  // Batch dialog states
  const [isBatchDiscardOpen, setIsBatchDiscardOpen] = useState(false);
  const [isBatchUndiscardOpen, setIsBatchUndiscardOpen] = useState(false);
  const [isBatchDestroyOpen, setIsBatchDestroyOpen] = useState(false);

  const updateSearchParams = useCallback(
    (updates: Record<string, string | null>) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          Object.entries(updates).forEach(([key, val]) => {
            if (val === null || val === "" || (key === "page" && val === "1")) {
              next.delete(key);
            } else {
              next.set(key, val);
            }
          });
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  // Debounce search input by 300ms before updating URL and querying API
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput.trim() !== searchQuery) {
        updateSearchParams({ search: searchInput.trim() || null, page: "1" });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, searchQuery, updateSearchParams]);

  const fetchNotifications = useCallback(async () => {
    setLoading(true, { overlay: false });
    try {
      const res = await NotificationController.getUserNotifications({
        page,
        limit: ADMIN_PAGE_SIZE,
        search: searchQuery.trim() || undefined,
        client: clientFilter || undefined,
        status: statusFilter || undefined,
        discarded:
          currentView === ADMIN_VIEW_MODES.DISCARDED ? "true" : undefined,
        sort_by: sortBy,
        sort_order: sortOrder,
      });

      if (res.success) {
        setNotifications(res.notifications);
        setPagination(res.pagination);
      } else {
        toast.error(
          res.error || t(AppLocales.Admin.Notifications.Errors.LoadTemplates),
        );
      }
    } finally {
      setLoading(false, { overlay: false });
    }
  }, [
    clientFilter,
    currentView,
    page,
    searchQuery,
    setLoading,
    sortBy,
    sortOrder,
    statusFilter,
    t,
    toast,
  ]);

  useEffect(() => {
    void fetchNotifications();
  }, [fetchNotifications]);

  // Handle single actions
  const handleDiscard = async () => {
    if (!discardTarget) return;
    setLoading(true, { overlay: true });
    try {
      const res = await NotificationController.discardUserNotification(
        discardTarget.id,
      );
      if (res.success) {
        toast.success(
          t(
            AppLocales.Admin.Notifications.UserNotifications.Toasts
              .DiscardSuccess,
          ),
        );
        setDiscardTarget(null);
        setSelectedIds((prev) => prev.filter((id) => id !== discardTarget.id));
        void fetchNotifications();
      } else {
        toast.error(res.error || "Failed to discard notification");
      }
    } finally {
      setLoading(false, { overlay: true });
    }
  };

  const handleUndiscard = async () => {
    if (!undiscardTarget) return;
    setLoading(true, { overlay: true });
    try {
      const res = await NotificationController.undiscardUserNotification(
        undiscardTarget.id,
      );
      if (res.success) {
        toast.success(
          t(
            AppLocales.Admin.Notifications.UserNotifications.Toasts
              .RestoreSuccess,
          ),
        );
        setUndiscardTarget(null);
        setSelectedIds((prev) =>
          prev.filter((id) => id !== undiscardTarget.id),
        );
        void fetchNotifications();
      } else {
        toast.error(res.error || "Failed to restore notification");
      }
    } finally {
      setLoading(false, { overlay: true });
    }
  };

  const handleDestroy = async () => {
    if (!destroyTarget) return;
    setLoading(true, { overlay: true });
    try {
      const res = await NotificationController.destroyUserNotification(
        destroyTarget.id,
      );
      if (res.success) {
        toast.success(
          t(
            AppLocales.Admin.Notifications.UserNotifications.Toasts
              .DestroySuccess,
          ),
        );
        setDestroyTarget(null);
        setSelectedIds((prev) => prev.filter((id) => id !== destroyTarget.id));
        void fetchNotifications();
      } else {
        toast.error(res.error || "Failed to permanently delete notification");
      }
    } finally {
      setLoading(false, { overlay: true });
    }
  };

  // Handle batch actions
  const handleBatchDiscard = async () => {
    if (selectedIds.length === 0) return;
    setLoading(true, { overlay: true });
    try {
      const res =
        await NotificationController.batchDiscardUserNotifications(selectedIds);
      if (res.success) {
        toast.success(
          t(
            AppLocales.Admin.Notifications.UserNotifications.Toasts
              .BatchDiscardSuccess,
            { count: String(res.count ?? selectedIds.length) },
          ),
        );
        setIsBatchDiscardOpen(false);
        setSelectedIds([]);
        void fetchNotifications();
      } else {
        toast.error(res.error || "Failed to batch discard notifications");
      }
    } finally {
      setLoading(false, { overlay: true });
    }
  };

  const handleBatchUndiscard = async () => {
    if (selectedIds.length === 0) return;
    setLoading(true, { overlay: true });
    try {
      const res =
        await NotificationController.batchUndiscardUserNotifications(
          selectedIds,
        );
      if (res.success) {
        toast.success(
          t(
            AppLocales.Admin.Notifications.UserNotifications.Toasts
              .BatchRestoreSuccess,
            { count: String(res.count ?? selectedIds.length) },
          ),
        );
        setIsBatchUndiscardOpen(false);
        setSelectedIds([]);
        void fetchNotifications();
      } else {
        toast.error(res.error || "Failed to batch restore notifications");
      }
    } finally {
      setLoading(false, { overlay: true });
    }
  };

  const handleBatchDestroy = async () => {
    if (selectedIds.length === 0) return;
    setLoading(true, { overlay: true });
    try {
      const res =
        await NotificationController.batchDestroyUserNotifications(selectedIds);
      if (res.success) {
        toast.success(
          t(
            AppLocales.Admin.Notifications.UserNotifications.Toasts
              .BatchDestroySuccess,
            { count: String(res.count ?? selectedIds.length) },
          ),
        );
        setIsBatchDestroyOpen(false);
        setSelectedIds([]);
        void fetchNotifications();
      } else {
        toast.error(res.error || "Failed to batch delete notifications");
      }
    } finally {
      setLoading(false, { overlay: true });
    }
  };

  const handleEmptyRecycleBin = async () => {
    setLoading(true, { overlay: true });
    try {
      const res = await NotificationController.emptyUserNotificationsBin();
      if (res.success) {
        toast.success(
          t(
            AppLocales.Admin.Notifications.UserNotifications.Toasts
              .RecycleBinEmptied,
          ),
        );
        setSelectedIds([]);
        void fetchNotifications();
      } else {
        toast.error(res.error || "Failed to empty recycle bin");
      }
    } finally {
      setLoading(false, { overlay: true });
    }
  };

  const batchActions = useMemo(() => {
    if (isActive) {
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
  }, [isActive, t]);

  const columns: IAdminTableColumn<IAdminUserNotification>[] = useMemo(() => {
    const base: IAdminTableColumn<IAdminUserNotification>[] = [
      {
        key: "recipient",
        header: t(
          AppLocales.Admin.Notifications.UserNotifications.Columns.Recipient,
        ),
        sortKey: ADMIN_USER_NOTIFICATION_SORT_KEYS.RECIPIENT,
        className: "w-48",
        render: (item) => (
          <div className="flex flex-col min-w-0">
            <span
              className="font-medium text-base-content truncate"
              title={item.user_email}
            >
              {item.user_email || item.user_id}
            </span>
            {item.user_name && (
              <span className="text-xs text-base-content/60 truncate">
                {item.user_name}
              </span>
            )}
          </div>
        ),
      },
      {
        key: "notification",
        header: t(
          AppLocales.Admin.Notifications.UserNotifications.Columns.Notification,
        ),
        sortKey: ADMIN_USER_NOTIFICATION_SORT_KEYS.TITLE,
        className: "min-w-64 max-w-sm",
        render: (item) => (
          <div className="flex flex-col min-w-0">
            <span
              className="font-semibold text-base-content truncate"
              title={item.title}
            >
              {item.title}
            </span>
            <span
              className="text-xs text-base-content/70 line-clamp-1 mt-0.5"
              title={item.message}
            >
              {item.message}
            </span>
          </div>
        ),
      },
      {
        key: "platforms",
        header: t(
          AppLocales.Admin.Notifications.UserNotifications.Columns.Platforms,
        ),
        className: "w-32",
        render: (item) => (
          <div className="flex flex-wrap gap-1">
            {item.clients?.map((client) => (
              <Badge
                key={client}
                variant={BadgeVariants.SECONDARY}
                className="capitalize text-xs"
              >
                {client}
              </Badge>
            ))}
          </div>
        ),
      },
      {
        key: "status",
        header: t(
          AppLocales.Admin.Notifications.UserNotifications.Columns.Status,
        ),
        className: "w-32",
        render: (item) => (
          <Badge
            variant={item.read ? BadgeVariants.SUCCESS : BadgeVariants.WARNING}
          >
            {item.read ? "Read" : "Unread"}
          </Badge>
        ),
      },
      {
        key: "sent_at",
        header: isActive
          ? t(AppLocales.Admin.Notifications.UserNotifications.Columns.SentAt)
          : t(
              AppLocales.Admin.Notifications.UserNotifications.Columns
                .DiscardedAt,
            ),
        sortKey: isActive
          ? ADMIN_USER_NOTIFICATION_SORT_KEYS.CREATED_AT
          : ADMIN_USER_NOTIFICATION_SORT_KEYS.DISCARDED_AT,
        className: "w-40",
        render: (item) => (
          <DateTime
            value={
              isActive ? item.created_at : item.discarded_at || item.created_at
            }
            format={DateTimeFormats.ADMIN}
            className="text-xs text-base-content/70"
          />
        ),
      },
      {
        key: "actions",
        header: t(
          AppLocales.Admin.Notifications.UserNotifications.Columns.Actions,
        ),
        className: "w-28 text-right",
        render: (item) => (
          <div className="flex items-center justify-end gap-1">
            <AdminTableActions
              resource={ADMIN_RESOURCES.USER_NOTIFICATIONS}
              actions={
                isActive
                  ? [
                      {
                        type: ADMIN_ACTIONS.DISCARD,
                        onClick: () => setDiscardTarget(item),
                      },
                    ]
                  : [
                      {
                        type: ADMIN_ACTIONS.UNDISCARD,
                        onClick: () => setUndiscardTarget(item),
                      },
                      {
                        type: ADMIN_ACTIONS.DESTROY,
                        onClick: () => setDestroyTarget(item),
                      },
                    ]
              }
            />
          </div>
        ),
      },
    ];

    return base;
  }, [isActive, t]);

  const content = (
    <div className="space-y-4">
      {/* View Switcher Tabs (Active vs Recycle Bin) */}
      {canDelete && (
        <Tabs
          value={currentView}
          onChange={(tab) => {
            setSelectedIds([]);
            if (embedded) {
              setLocalView(tab as TAdminViewMode);
              updateSearchParams({
                view: tab === ADMIN_VIEW_MODES.DISCARDED ? tab : "",
                page: "1",
              });
            } else {
              navigate(
                tab === ADMIN_VIEW_MODES.ACTIVE
                  ? AppRoutes.client.protected.admin.USER_NOTIFICATIONS
                  : AppRoutes.client.protected.admin
                      .USER_NOTIFICATIONS_RECYCLE_BIN,
              );
              updateSearchParams({ page: "1" });
            }
          }}
          items={[
            {
              value: ADMIN_VIEW_MODES.ACTIVE,
              label: t(
                AppLocales.Admin.Notifications.UserNotifications.Tabs.Active,
              ),
              icon: iconsLib.bell,
              count: isActive ? pagination?.total_count : undefined,
            },
            {
              value: ADMIN_VIEW_MODES.DISCARDED,
              label: t(
                AppLocales.Admin.Notifications.UserNotifications.Tabs
                  .RecycleBin,
              ),
              icon: iconsLib.trash,
              count: !isActive ? pagination?.total_count : undefined,
            },
          ]}
        />
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center bg-base-100 p-4 rounded-xl border border-base-200">
        <div className="w-full sm:w-64">
          <SearchInput
            placeholder={t(
              AppLocales.Admin.Notifications.UserNotifications
                .SearchPlaceholder,
            )}
            searchableKeys={[
              t(
                AppLocales.Admin.Notifications.UserNotifications.Columns
                  .Notification,
              ),
              t(
                AppLocales.Admin.Notifications.UserNotifications.Columns
                  .Recipient,
              ),
              t(AppLocales.Admin.Common.Detail.Name),
              t(AppLocales.Admin.Users.Table.Username),
              t(AppLocales.Admin.Users.Table.Email),
              t(
                AppLocales.Admin.Notifications.UserNotifications.Detail
                  .TargetLink,
              ),
            ]}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onClear={() => {
              setSearchInput("");
              updateSearchParams({ search: null, page: "1" });
            }}
          />
        </div>

        <div className="w-full sm:w-48">
          <Dropdown
            value={clientFilter}
            size={DropdownSizes.MD}
            options={[
              {
                value: "",
                label: t(
                  AppLocales.Admin.Notifications.UserNotifications.Filters
                    .AllClients,
                ),
              },
              {
                value: ADMIN_USER_NOTIFICATION_CLIENT_FILTERS.WEB,
                label: "Web",
              },
              {
                value: ADMIN_USER_NOTIFICATION_CLIENT_FILTERS.MOBILE,
                label: "Mobile",
              },
            ]}
            onValueChange={(val) =>
              updateSearchParams({ client: val || null, page: "1" })
            }
          />
        </div>

        <div className="w-full sm:w-48">
          <Dropdown
            value={statusFilter}
            size={DropdownSizes.MD}
            options={[
              {
                value: "",
                label: t(
                  AppLocales.Admin.Notifications.UserNotifications.Filters
                    .AllStatuses,
                ),
              },
              {
                value: ADMIN_USER_NOTIFICATION_STATUS_FILTERS.UNREAD,
                label: t(
                  AppLocales.Admin.Notifications.UserNotifications.Filters
                    .Unread,
                ),
              },
              {
                value: ADMIN_USER_NOTIFICATION_STATUS_FILTERS.READ,
                label: t(
                  AppLocales.Admin.Notifications.UserNotifications.Filters.Read,
                ),
              },
            ]}
            onValueChange={(val) =>
              updateSearchParams({ status: val || null, page: "1" })
            }
          />
        </div>

        {!isActive && canDelete && (
          <div className="w-full sm:w-auto sm:ml-auto">
            <AdminEmptyRecycleBinButton
              onConfirm={handleEmptyRecycleBin}
              count={pagination?.total_count}
              disabled={notifications.length === 0}
            />
          </div>
        )}
      </div>

      {/* Batch Action Bar */}
      {selectedIds.length > 0 && (
        <AdminBatchActionBar
          selectedCount={selectedIds.length}
          onClearSelection={() => setSelectedIds([])}
          actions={batchActions}
        />
      )}

      {/* Table & Pagination */}
      <div className="bg-base-100 rounded-xl border border-base-200 overflow-hidden">
        {notifications.length > 0 ? (
          <>
            <AdminTable
              columns={columns}
              records={notifications}
              getRowKey={(item) => item.id}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
              onRowClick={(item) =>
                navigate(
                  AppRoutes.withId(
                    AppRoutes.client.protected.admin.USER_NOTIFICATION_DETAIL,
                    item.id,
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
                setSelectedIds(
                  selected ? notifications.map((item) => item.id) : [],
                );
              }}
            />
            {pagination && (
              <AdminPagination
                pagination={pagination}
                onPageChange={(nextPage) =>
                  updateSearchParams({ page: String(nextPage) })
                }
              />
            )}
          </>
        ) : (
          <AdminState
            icon={<iconsLib.bell className="w-12 h-12" />}
            title={t(
              AppLocales.Admin.Notifications.UserNotifications.EmptyTitle,
            )}
            message={t(
              AppLocales.Admin.Notifications.UserNotifications.EmptyDesc,
            )}
          />
        )}
      </div>

      {/* Discard Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(discardTarget)}
        title={t(AppLocales.Admin.Notifications.UserNotifications.DiscardTitle)}
        message={t(
          AppLocales.Admin.Notifications.UserNotifications.DiscardMessage,
        )}
        confirmLabel={t(AppLocales.Admin.Common.Actions.Discard)}
        cancelLabel={t(AppLocales.Admin.Common.Actions.Cancel)}
        onConfirm={handleDiscard}
        onClose={() => setDiscardTarget(null)}
        isLoading={isLoading}
        isDestructive
      />

      {/* Undiscard Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(undiscardTarget)}
        title={t(AppLocales.Admin.Notifications.UserNotifications.RestoreTitle)}
        message={t(
          AppLocales.Admin.Notifications.UserNotifications.RestoreMessage,
        )}
        confirmLabel={t(AppLocales.Admin.Common.Actions.Restore)}
        cancelLabel={t(AppLocales.Admin.Common.Actions.Cancel)}
        onConfirm={handleUndiscard}
        onClose={() => setUndiscardTarget(null)}
        isLoading={isLoading}
      />

      {/* Destroy Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(destroyTarget)}
        title={t(AppLocales.Admin.Notifications.UserNotifications.DeleteTitle)}
        message={t(
          AppLocales.Admin.Notifications.UserNotifications.DeleteMessage,
        )}
        confirmLabel={t(AppLocales.Admin.Common.Actions.Destroy)}
        cancelLabel={t(AppLocales.Admin.Common.Actions.Cancel)}
        isDestructive
        onConfirm={handleDestroy}
        onClose={() => setDestroyTarget(null)}
        isLoading={isLoading}
      />

      {/* Batch Discard Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isBatchDiscardOpen}
        title={t(AppLocales.Admin.Common.Batch.ConfirmDiscardTitle)}
        message={t(AppLocales.Admin.Common.Batch.ConfirmDiscardMessage, {
          count: String(selectedIds.length),
        })}
        confirmLabel={t(AppLocales.Admin.Common.Batch.DiscardSelected)}
        cancelLabel={t(AppLocales.Admin.Common.Actions.Cancel)}
        onConfirm={handleBatchDiscard}
        onClose={() => setIsBatchDiscardOpen(false)}
        isLoading={isLoading}
        isDestructive
      />

      {/* Batch Undiscard Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isBatchUndiscardOpen}
        title={t(AppLocales.Admin.Common.Batch.ConfirmRestoreTitle)}
        message={t(AppLocales.Admin.Common.Batch.ConfirmRestoreMessage, {
          count: String(selectedIds.length),
        })}
        confirmLabel={t(AppLocales.Admin.Common.Batch.RestoreSelected)}
        cancelLabel={t(AppLocales.Admin.Common.Actions.Cancel)}
        onConfirm={handleBatchUndiscard}
        onClose={() => setIsBatchUndiscardOpen(false)}
        isLoading={isLoading}
      />

      {/* Batch Destroy Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isBatchDestroyOpen}
        title={t(AppLocales.Admin.Common.Batch.ConfirmDestroyTitle)}
        message={t(AppLocales.Admin.Common.Batch.ConfirmDestroyMessage, {
          count: String(selectedIds.length),
        })}
        confirmLabel={t(AppLocales.Admin.Common.Batch.DestroySelected)}
        cancelLabel={t(AppLocales.Admin.Common.Actions.Cancel)}
        isDestructive
        onConfirm={handleBatchDestroy}
        onClose={() => setIsBatchDestroyOpen(false)}
        isLoading={isLoading}
      />
    </div>
  );

  if (embedded) {
    return content;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={
          isActive
            ? t(AppLocales.Admin.Notifications.UserNotifications.Title)
            : t(AppLocales.Admin.Notifications.UserNotifications.RecycleTitle)
        }
        description={
          isActive
            ? t(AppLocales.Admin.Notifications.UserNotifications.Description)
            : t(
                AppLocales.Admin.Notifications.UserNotifications
                  .RecycleDescription,
              )
        }
      />
      {content}
    </div>
  );
};
