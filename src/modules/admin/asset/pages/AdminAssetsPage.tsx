import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle, useSort, SORT_ORDERS } from "../../../../hooks";
import type { IApiPagination } from "../../../../models";
import { iconsLib } from "../../../../assets";
import {
  Badge,
  Button,
  SearchInput,
  Dropdown,
  Tabs,
  Image,
} from "../../../../design";
import { AppLocales, useTranslate } from "../../../../locales";
import AdminAssetController from "../asset.controller";
import type { IAdminAsset } from "../types";
import {
  AdminPagination,
  AdminState,
  AdminTableActions,
  AdminTable,
  ConfirmDialog,
  PageHeader,
  type IAdminTableColumn,
} from "../../components";
import {
  ADMIN_PAGE_SIZE,
  ADMIN_ACTIONS,
  ADMIN_VIEW_MODES,
  ADMIN_RESOURCES,
  type TAdminViewMode,
} from "../../constants";
import {
  ADMIN_ASSET_COLUMNS,
  ASSET_TYPE_OPTIONS,
  ASSET_FORMAT_OPTIONS,
  formatAssetFileSize,
  isImageAsset,
} from "../constants";
import { formatAdminDate } from "../../../../helpers";
import { usePermissions } from "../../../../hooks/usePermissions";
import { AdminAssetUploadDialog } from "../components/AdminAssetUploadDialog";

interface IAdminAssetsPageProps {
  view?: TAdminViewMode;
}

export const AdminAssetsPage: React.FC<IAdminAssetsPageProps> = ({
  view = ADMIN_VIEW_MODES.ACTIVE,
}) => {
  const isActive = view === ADMIN_VIEW_MODES.ACTIVE;
  const t = useTranslate();

  useDocumentTitle(
    isActive
      ? `${t(AppLocales.Admin.Assets.Title)} | Admin`
      : `${t(AppLocales.Admin.Assets.RecycleTitle)} | Admin`,
  );

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { can } = usePermissions();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const searchQuery = searchParams.get("search") || "";
  const typeFilter = searchParams.get("type") || "";
  const formatFilter = searchParams.get("format") || "";

  const { sortBy, sortOrder, handleSort } = useSort({
    defaultSortBy: isActive
      ? ADMIN_ASSET_COLUMNS.CREATED_AT
      : ADMIN_ASSET_COLUMNS.DISCARDED_AT,
    defaultSortOrder: SORT_ORDERS.DESC,
  });

  const { isLoading, setLoading } = useLoading();
  const toast = useToast();

  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [assets, setAssets] = useState<IAdminAsset[]>([]);
  const [pagination, setPagination] = useState<IApiPagination | null>(null);

  // Active view state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isDiscardOpen, setIsDiscardOpen] = useState(false);
  const [assetToDiscard, setAssetToDiscard] = useState<IAdminAsset | null>(
    null,
  );
  const [isDiscarding, setIsDiscarding] = useState(false);

  // Discarded view state
  const [isRestoreOpen, setIsRestoreOpen] = useState(false);
  const [assetToRestore, setAssetToRestore] = useState<IAdminAsset | null>(
    null,
  );
  const [isRestoring, setIsRestoring] = useState(false);
  const [isDestroyOpen, setIsDestroyOpen] = useState(false);
  const [assetToDestroy, setAssetToDestroy] = useState<IAdminAsset | null>(
    null,
  );
  const [isDestroying, setIsDestroying] = useState(false);

  const fetchAssets = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = {
        page,
        limit: ADMIN_PAGE_SIZE,
      };

      if (sortBy) params.sort_by = sortBy;
      if (sortOrder) params.sort_order = sortOrder;
      if (searchQuery) params.search = searchQuery;
      if (typeFilter) params.type = typeFilter;
      if (formatFilter) params.format = formatFilter;

      const result = isActive
        ? await AdminAssetController.getAssets(params)
        : await AdminAssetController.getDiscardedAssets(params);

      if (result.success) {
        setAssets(result.assets);
        setPagination(result.pagination);
      } else {
        toast.error(
          result.error || t(AppLocales.Admin.Assets.Errors.LoadFailed),
        );
      }
    } finally {
      setLoading(false);
      setHasLoadedOnce(true);
    }
  }, [
    page,
    sortBy,
    sortOrder,
    searchQuery,
    typeFilter,
    formatFilter,
    isActive,
    setLoading,
    toast,
    t,
  ]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const updateSearchParams = useCallback(
    (updates: Record<string, string | null>) => {
      const newParams = new URLSearchParams(searchParams);
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null) {
          newParams.delete(key);
        } else {
          newParams.set(key, value);
        }
      });
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams],
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSearchParams({ search: e.target.value || null, page: "1" });
  };

  const handlePageChange = (newPage: number) => {
    updateSearchParams({ page: newPage.toString() });
  };

  // Active view actions
  const handleDiscard = async () => {
    if (!assetToDiscard) return;

    setIsDiscarding(true);
    try {
      const result = await AdminAssetController.discardAsset(assetToDiscard.id);
      if (result.success) {
        toast.success(
          result.message || t(AppLocales.Admin.Assets.Toasts.DiscardSuccess),
        );
        setIsDiscardOpen(false);
        setAssetToDiscard(null);
        fetchAssets();
      } else {
        toast.error(
          result.error || t(AppLocales.Admin.Assets.Errors.DiscardFailed),
        );
      }
    } finally {
      setIsDiscarding(false);
    }
  };

  // Discarded view actions
  const handleRestore = async () => {
    if (!assetToRestore) return;

    setIsRestoring(true);
    try {
      const result = await AdminAssetController.undiscardAsset(
        assetToRestore.id,
      );
      if (result.success) {
        toast.success(
          result.message || t(AppLocales.Admin.Assets.Toasts.RestoreSuccess),
        );
        setIsRestoreOpen(false);
        setAssetToRestore(null);
        fetchAssets();
      } else {
        toast.error(
          result.error || t(AppLocales.Admin.Assets.Errors.RestoreFailed),
        );
      }
    } finally {
      setIsRestoring(false);
    }
  };

  const handleDestroy = async () => {
    if (!assetToDestroy) return;

    setIsDestroying(true);
    try {
      const result = await AdminAssetController.destroyAsset(assetToDestroy.id);
      if (result.success) {
        toast.success(
          result.message || t(AppLocales.Admin.Assets.Toasts.DestroySuccess),
        );
        setIsDestroyOpen(false);
        setAssetToDestroy(null);
        fetchAssets();
      } else {
        toast.error(
          result.error || t(AppLocales.Admin.Assets.Errors.DestroyFailed),
        );
      }
    } finally {
      setIsDestroying(false);
    }
  };

  const columns: IAdminTableColumn<IAdminAsset>[] = useMemo(() => {
    const base: IAdminTableColumn<IAdminAsset>[] = [
      {
        key: ADMIN_ASSET_COLUMNS.PREVIEW,
        header: t(AppLocales.Admin.Assets.Table.Preview),
        render: (asset) => {
          const isImg = isImageAsset(asset);

          return (
            <div className="w-10 h-10 rounded overflow-hidden bg-base-200 flex items-center justify-center">
              {isImg ? (
                <Image
                  src={asset.url}
                  alt={asset.name}
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-cover ${!isActive ? "opacity-50 grayscale" : ""}`}
                  fallback={
                    <iconsLib.photo className="w-5 h-5 text-base-content/50" />
                  }
                />
              ) : (
                <iconsLib.photo className="w-5 h-5 text-base-content/50" />
              )}
            </div>
          );
        },
      },
      {
        key: ADMIN_ASSET_COLUMNS.NAME,
        header: t(AppLocales.Admin.Assets.Table.Name),
        sortKey: ADMIN_ASSET_COLUMNS.NAME,
        render: (asset) => (
          <div className="flex flex-col">
            <span className="font-medium text-base-content">{asset.name}</span>
            <span className="text-xs text-base-content/60">{asset.id}</span>
          </div>
        ),
      },
      {
        key: ADMIN_ASSET_COLUMNS.TYPE,
        header: t(AppLocales.Admin.Assets.Table.Type),
        sortKey: ADMIN_ASSET_COLUMNS.TYPE,
        render: (asset) => <Badge>{asset.type}</Badge>,
      },
    ];

    if (isActive) {
      base.push(
        {
          key: ADMIN_ASSET_COLUMNS.FORMAT,
          header: t(AppLocales.Admin.Assets.Table.Format),
          sortKey: ADMIN_ASSET_COLUMNS.FORMAT,
          render: (asset) => (
            <span className="text-sm uppercase">{asset.format || "N/A"}</span>
          ),
        },
        {
          key: ADMIN_ASSET_COLUMNS.SIZE,
          header: t(AppLocales.Admin.Assets.Table.Size),
          sortKey: ADMIN_ASSET_COLUMNS.SIZE,
          render: (asset) => (
            <span className="text-sm">
              {formatAssetFileSize(asset.size_bytes)}
            </span>
          ),
        },
        {
          key: ADMIN_ASSET_COLUMNS.CREATED_AT,
          header: t(AppLocales.Admin.Assets.Table.Created),
          sortKey: ADMIN_ASSET_COLUMNS.CREATED_AT,
          render: (asset) => (
            <span className="text-sm text-base-content/70">
              {formatAdminDate(asset.created_at)}
            </span>
          ),
        },
        {
          key: "actions",
          header: "",
          render: (asset) => (
            <AdminTableActions
              resource={ADMIN_RESOURCES.ASSETS}
              actions={[
                {
                  type: ADMIN_ACTIONS.EDIT,
                  onClick: () => {
                    navigate(
                      AppRoutes.withId(
                        AppRoutes.client.protected.admin.ASSET_EDIT,
                        asset.id,
                      ),
                    );
                  },
                },
                {
                  type: ADMIN_ACTIONS.DISCARD,
                  onClick: () => {
                    setAssetToDiscard(asset);
                    setIsDiscardOpen(true);
                  },
                },
              ]}
            />
          ),
        },
      );
    } else {
      base.push(
        {
          key: ADMIN_ASSET_COLUMNS.DISCARDED_AT,
          header: t(AppLocales.Admin.Assets.Table.Discarded),
          sortKey: ADMIN_ASSET_COLUMNS.DISCARDED_AT,
          render: (asset) => (
            <span className="text-sm text-base-content/70">
              {formatAdminDate(asset.discarded_at)}
            </span>
          ),
        },
        {
          key: "actions",
          header: "",
          render: (asset) => (
            <AdminTableActions
              resource={ADMIN_RESOURCES.ASSETS}
              actions={[
                {
                  type: ADMIN_ACTIONS.UNDISCARD,
                  onClick: () => {
                    setAssetToRestore(asset);
                    setIsRestoreOpen(true);
                  },
                },
                {
                  type: ADMIN_ACTIONS.DESTROY,
                  onClick: () => {
                    setAssetToDestroy(asset);
                    setIsDestroyOpen(true);
                  },
                },
              ]}
            />
          ),
        },
      );
    }

    return base;
  }, [isActive, navigate, t]);

  const canCreate = can(ADMIN_ACTIONS.CREATE, ADMIN_RESOURCES.ASSETS);

  return (
    <div className="space-y-6">
      <PageHeader
        title={
          isActive
            ? t(AppLocales.Admin.Assets.Title)
            : t(AppLocales.Admin.Assets.RecycleTitle)
        }
        description={
          isActive
            ? t(AppLocales.Admin.Assets.Description)
            : t(AppLocales.Admin.Assets.RecycleDescription)
        }
        action={
          isActive && canCreate ? (
            <Button onClick={() => setIsUploadOpen(true)}>
              <iconsLib.plus className="w-5 h-5 mr-2" />
              {t(AppLocales.Admin.Assets.UploadButton)}
            </Button>
          ) : null
        }
      >
        {can(ADMIN_ACTIONS.DELETE, ADMIN_RESOURCES.ASSETS) && (
          <Tabs
            value={view}
            onChange={(tab) => {
              navigate(
                tab === ADMIN_VIEW_MODES.ACTIVE
                  ? AppRoutes.client.protected.admin.ASSETS
                  : AppRoutes.client.protected.admin.ASSETS_RECYCLE_BIN,
              );
              updateSearchParams({ page: "1" });
            }}
            items={[
              {
                value: ADMIN_VIEW_MODES.ACTIVE,
                label: t(AppLocales.Admin.Assets.Tabs.ActiveAssets),
              },
              {
                value: ADMIN_VIEW_MODES.DISCARDED,
                label: t(AppLocales.Admin.Assets.Tabs.RecycleBin),
              },
            ]}
          />
        )}
      </PageHeader>

      {isActive && (
        <div className="flex flex-col sm:flex-row gap-4 items-center bg-base-100 p-4 rounded-xl border border-base-200">
          <div className="w-full sm:w-64">
            <SearchInput
              placeholder={t(AppLocales.Admin.Assets.SearchPlaceholder)}
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <div className="w-full sm:w-48">
            <Dropdown
              value={typeFilter}
              options={ASSET_TYPE_OPTIONS.map((o) => ({
                value: o.value,
                label: o.label,
              }))}
              onValueChange={(val) =>
                updateSearchParams({ type: val || null, page: "1" })
              }
            />
          </div>
          <div className="w-full sm:w-48">
            <Dropdown
              value={formatFilter}
              options={ASSET_FORMAT_OPTIONS.map((o) => ({
                value: o.value,
                label: o.label,
              }))}
              onValueChange={(val) =>
                updateSearchParams({ format: val || null, page: "1" })
              }
            />
          </div>
        </div>
      )}

      <div className="bg-base-100 rounded-xl border border-base-200 overflow-hidden">
        {assets.length > 0 ? (
          <>
            <AdminTable
              columns={columns}
              records={assets}
              getRowKey={(asset) => asset.id}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
            {pagination && (
              <AdminPagination
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            )}
          </>
        ) : hasLoadedOnce && !isLoading ? (
          <AdminState
            title={
              isActive
                ? t(AppLocales.Admin.Assets.State.EmptyTitle)
                : t(AppLocales.Admin.Assets.State.RecycleEmptyTitle)
            }
            message={
              isActive
                ? t(AppLocales.Admin.Assets.State.EmptyDesc)
                : t(AppLocales.Admin.Assets.State.RecycleEmptyDesc)
            }
            icon={
              isActive ? (
                <iconsLib.photo className="w-12 h-12" />
              ) : (
                <iconsLib.trash className="w-12 h-12" />
              )
            }
          />
        ) : (
          <div className="py-16 flex items-center justify-center text-base-content/40">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        )}
      </div>

      {/* Active view dialogs */}
      {isActive && (
        <>
          <AdminAssetUploadDialog
            isOpen={isUploadOpen}
            onClose={() => setIsUploadOpen(false)}
            onSuccess={fetchAssets}
          />

          <ConfirmDialog
            isOpen={isDiscardOpen}
            title={t(AppLocales.Admin.Assets.Confirm.DiscardTitle)}
            message={t(AppLocales.Admin.Assets.Confirm.DiscardMessage)}
            confirmLabel={t(AppLocales.Admin.Common.Actions.Discard)}
            cancelLabel={t(AppLocales.Admin.Common.Actions.Cancel)}
            onConfirm={handleDiscard}
            onClose={() => {
              setIsDiscardOpen(false);
              setAssetToDiscard(null);
            }}
            isLoading={isDiscarding}
            isDestructive
          />
        </>
      )}

      {/* Discarded view dialogs */}
      {!isActive && (
        <>
          <ConfirmDialog
            isOpen={isRestoreOpen}
            title={t(AppLocales.Admin.Assets.Confirm.RestoreTitle)}
            message={t(AppLocales.Admin.Assets.Confirm.RestoreMessage)}
            confirmLabel={t(AppLocales.Admin.Common.Actions.Restore)}
            cancelLabel={t(AppLocales.Admin.Common.Actions.Cancel)}
            onConfirm={handleRestore}
            onClose={() => {
              setIsRestoreOpen(false);
              setAssetToRestore(null);
            }}
            isLoading={isRestoring}
          />

          <ConfirmDialog
            isOpen={isDestroyOpen}
            title={t(AppLocales.Admin.Assets.Confirm.DestroyTitle)}
            message={t(AppLocales.Admin.Assets.Confirm.DestroyMessage)}
            confirmLabel={t(AppLocales.Admin.Common.Actions.Destroy)}
            cancelLabel={t(AppLocales.Admin.Common.Actions.Cancel)}
            onConfirm={handleDestroy}
            onClose={() => {
              setIsDestroyOpen(false);
              setAssetToDestroy(null);
            }}
            isLoading={isDestroying}
            isDestructive
          />
        </>
      )}
    </div>
  );
};
