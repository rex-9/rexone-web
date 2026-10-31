// src/modules/admin/ai/pages/AdminAiProfilesPage.tsx

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useToast } from "../../../../contexts/ToastContext";
import {
  useDocumentTitle,
  usePermissions,
  useSort,
  SORT_ORDERS,
} from "../../../../hooks";
import type { IApiPagination } from "../../../../models";
import {
  StatusBadge,
  DateTime,
  DateTimeFormats,
  Button,
  ButtonSizes,
  ButtonVariants,
  ConfirmDialog,
  Dropdown,
  SearchInput,
  Badge,
  BadgeVariants,
  ComponentSizes,
} from "../../../../design";
import { iconsLib } from "../../../../assets";
import AiController from "../ai.controller";
import type { IAdminAiConfig, IAdminAiProfile } from "../types";
import {
  AdminPagination,
  AdminState,
  AdminTableActions,
  AdminTable,
  PageHeader,
  type IAdminTableAction,
  type IAdminTableColumn,
} from "../../components";
import {
  ADMIN_PAGE_SIZE,
  ADMIN_RESOURCES,
  ADMIN_ACTIONS,
  ADMIN_COMMON_LABELS,
} from "../../constants";
import {
  ADMIN_AI_FILTER,
  ADMIN_AI_PROFILE_SORT_KEYS,
} from "../constants";
import { useTranslate, AppLocales } from "../../../../locales";

export const AdminAiProfilesPage: React.FC = () => {
  const t = useTranslate();
  useDocumentTitle(`${t(AppLocales.Admin.Ai.ProfilesTitle)} | Admin`);

  const navigate = useNavigate();
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const statusFilter = searchParams.get("status") || "";
  const providerFilter = searchParams.get("provider") || "";
  const modelFilter = searchParams.get("model") || "";
  const searchQuery = searchParams.get("search") || "";
  const [searchInput, setSearchInput] = useState(searchQuery);

  const { sortBy, sortOrder, handleSort } = useSort({
    defaultSortBy: ADMIN_AI_PROFILE_SORT_KEYS.CREATED_AT,
    defaultSortOrder: SORT_ORDERS.DESC,
  });

  const { can } = usePermissions();
  const { isLoading, setLoading } = useLoading();
  const [profiles, setProfiles] = useState<IAdminAiProfile[]>([]);
  const [config, setConfig] = useState<IAdminAiConfig | null>(
    null,
  );
  const [pagination, setPagination] = useState<IApiPagination | null>(null);
  const [error, setError] = useState("");
  const [destroyTarget, setDestroyTarget] = useState<IAdminAiProfile | null>(
    null,
  );

  const updateFilters = useCallback(
    (updates: {
      page?: number;
      status?: string;
      provider?: string;
      model?: string;
      search?: string;
    }) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          Object.entries(updates).forEach(([k, val]) => {
            if (val !== undefined && val !== "" && (k !== "page" || val !== 1)) {
              next.set(k, String(val));
            } else {
              next.delete(k);
            }
          });
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (searchInput.trim() !== searchQuery) {
        updateFilters({ search: searchInput.trim(), page: 1 });
      }
    }, 300);
    return () => window.clearTimeout(timer);
  }, [searchInput, searchQuery, updateFilters]);

  const providerFilterOptions = useMemo(() => {
    const dynamicProviders = (config?.providers || []).map(
      (providerItem) => ({
        value: providerItem.key,
        label: providerItem.label,
      }),
    );
    return [
      {
        value: "",
        label: t(AppLocales.Admin.Ai.Filters.AllProviders),
      },
      ...dynamicProviders,
    ];
  }, [config, t]);

  const modelFilterOptions = useMemo(() => {
    const providers = config?.providers || [];
    const targetProviders = providerFilter
      ? providers.filter((providerItem) => providerItem.key === providerFilter)
      : providers;

    const allModels: { value: string; label: string }[] = [];
    targetProviders.forEach((providerItem) => {
      providerItem.models.forEach((modelItem) => {
        if (!allModels.some((existing) => existing.value === modelItem.model)) {
          allModels.push({ value: modelItem.model, label: modelItem.model });
        }
      });
    });

    return [
      {
        value: "",
        label: t(AppLocales.Admin.Ai.Filters.AllModels),
      },
      ...allModels,
    ];
  }, [config, providerFilter, t]);

  const presetKeySet = useMemo(
    () =>
      new Set(
        (config?.profile_key_presets || []).map((item) => item.key),
      ),
    [config],
  );

  const statusFilterOptions = useMemo(
    () => [
      {
        value: "",
        label: t(AppLocales.Admin.Ai.Filters.AllStatuses),
      },
      { value: ADMIN_AI_FILTER.ACTIVE, label: ADMIN_COMMON_LABELS.ACTIVE },
      { value: ADMIN_AI_FILTER.INACTIVE, label: ADMIN_COMMON_LABELS.INACTIVE },
    ],
    [t],
  );

  const loadProfiles = useCallback(async () => {
    if (!can(ADMIN_ACTIONS.READ, ADMIN_RESOURCES.AI_PROFILES)) return;

    setLoading(true);
    setError("");

    const result = await AiController.getProfiles({
      page,
      limit: ADMIN_PAGE_SIZE,
      sort_by: sortBy,
      sort_order: sortOrder,
      status: statusFilter || undefined,
      provider: providerFilter || undefined,
      model: modelFilter || undefined,
      search: searchQuery || undefined,
    });

    setLoading(false);

    if (result.success) {
      setProfiles(result.profiles);
      setPagination(result.pagination);
      if (result.config) {
        setConfig(result.config);
      }
    } else {
      setError(result.error || t(AppLocales.Admin.Ai.Errors.LoadProfiles));
    }
  }, [
    can,
    page,
    sortBy,
    sortOrder,
    statusFilter,
    providerFilter,
    modelFilter,
    searchQuery,
    setLoading,
    t,
  ]);

  useEffect(() => {
    void loadProfiles();
  }, [loadProfiles]);

  const handleSyncPrices = useCallback(async () => {
    setLoading(true);
    const result = await AiController.syncPrices();
    setLoading(false);

    if (result.success) {
      if (result.config) {
        setConfig(result.config);
      }
      toast.success(t(AppLocales.Admin.Ai.Toasts.SyncPricesSuccess));
    } else {
      toast.error(result.error || t(AppLocales.Admin.Ai.Errors.SyncPrices));
    }
  }, [setLoading, t, toast]);

  const handleDestroy = useCallback(async () => {
    if (!destroyTarget) return;
    setLoading(true);
    const result = await AiController.destroyProfile(destroyTarget.id);
    setLoading(false);

    if (result.success) {
      toast.success(t(AppLocales.Admin.Ai.Toasts.ProfileDestroySuccess));
      setDestroyTarget(null);
      void loadProfiles();
    } else {
      toast.error(result.error || t(AppLocales.Admin.Ai.Errors.DestroyProfile));
    }
  }, [destroyTarget, loadProfiles, setLoading, t, toast]);

  const columns: IAdminTableColumn<IAdminAiProfile>[] = useMemo(
    () => [
      {
        key: "key",
        header: t(AppLocales.Admin.Ai.ProfilesTable.Key),
        sortKey: ADMIN_AI_PROFILE_SORT_KEYS.KEY,
        render: (profile) => (
          <span className="font-mono text-xs font-semibold text-primary">
            {profile.key}
          </span>
        ),
      },
      {
        key: "name",
        header: t(AppLocales.Admin.Ai.ProfilesTable.Name),
        sortKey: ADMIN_AI_PROFILE_SORT_KEYS.NAME,
        render: (profile) => (
          <div className="font-medium text-base-content">{profile.name}</div>
        ),
      },
      {
        key: "provider",
        header: t(AppLocales.Admin.Ai.ProfilesTable.Provider),
        sortKey: ADMIN_AI_PROFILE_SORT_KEYS.PROVIDER,
        render: (profile) => {
          const providerMeta = config?.providers.find(
            (item) => item.key === profile.provider,
          );
          return (
            <div className="flex items-center gap-1.5">
              <Badge
                variant={BadgeVariants.SECONDARY}
                size={ComponentSizes.XS}
                className="uppercase font-medium"
              >
                {providerMeta?.label || profile.provider}
              </Badge>
              {providerMeta && !providerMeta.configured && (
                <Badge
                  variant={BadgeVariants.WARNING}
                  size={ComponentSizes.XS}
                >
                  {t(AppLocales.Admin.Ai.ApiKeyMissing)}
                </Badge>
              )}
            </div>
          );
        },
      },
      {
        key: "model",
        header: t(AppLocales.Admin.Ai.ProfilesTable.Model),
        sortKey: ADMIN_AI_PROFILE_SORT_KEYS.MODEL,
        render: (profile) => (
          <span className="font-mono text-xs text-base-content/80">
            {profile.model}
          </span>
        ),
      },
      {
        key: "temperature",
        header: t(AppLocales.Admin.Ai.ProfilesTable.Temperature),
        sortKey: ADMIN_AI_PROFILE_SORT_KEYS.TEMPERATURE,
        render: (profile) => (
          <span className="text-xs font-mono">
            {profile.temperature != null ? profile.temperature : "-"}
          </span>
        ),
      },
      {
        key: "tokens",
        header: t(AppLocales.Admin.Ai.ProfilesTable.Tokens),
        render: (profile) => (
          <div className="text-xs text-base-content/70">
            <span>
              Out:{" "}
              {profile.max_output_tokens != null
                ? profile.max_output_tokens.toLocaleString()
                : "—"}
            </span>
            <span className="mx-1">/</span>
            <span>
              Ctx:{" "}
              {profile.context_max_tokens != null
                ? profile.context_max_tokens.toLocaleString()
                : "—"}
            </span>
          </div>
        ),
      },
      {
        key: "enabled",
        header: t(AppLocales.Admin.Ai.ProfilesTable.Status),
        sortKey: ADMIN_AI_PROFILE_SORT_KEYS.ENABLED,
        render: (profile) => (
          <StatusBadge
            status={
              profile.enabled
                ? ADMIN_AI_FILTER.ACTIVE
                : ADMIN_AI_FILTER.INACTIVE
            }
            label={
              profile.enabled
                ? ADMIN_COMMON_LABELS.ACTIVE
                : ADMIN_COMMON_LABELS.INACTIVE
            }
          />
        ),
      },
      {
        key: "created_at",
        header: t(AppLocales.Admin.Ai.ProfilesTable.Created),
        sortKey: ADMIN_AI_PROFILE_SORT_KEYS.CREATED_AT,
        render: (profile) =>
          profile.created_at ? (
            <DateTime
              value={profile.created_at}
              format={DateTimeFormats.ADMIN}
            />
          ) : (
            "-"
          ),
      },
      {
        key: "actions",
        header: "",
        render: (profile) => {
          const isBuiltInPreset = presetKeySet.has(profile.key);
          const rowActions: IAdminTableAction[] = [
            {
              type: ADMIN_ACTIONS.EDIT,
              onClick: () =>
                navigate(
                  AppRoutes.withId(
                    AppRoutes.client.protected.admin.AI_PROFILE_EDIT,
                    profile.id,
                  ),
                ),
            },
          ];
          if (!isBuiltInPreset) {
            rowActions.push({
              type: ADMIN_ACTIONS.DESTROY,
              onClick: () => setDestroyTarget(profile),
            });
          }
          return (
            <AdminTableActions
              resource={ADMIN_RESOURCES.AI_PROFILES}
              actions={rowActions}
            />
          );
        },
      },
    ],
    [config, navigate, presetKeySet, t],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={t(AppLocales.Admin.Ai.ProfilesTitle)}
        description={t(AppLocales.Admin.Ai.ProfilesDescription)}
        action={
          <div className="flex flex-wrap items-center gap-2">
            {can(ADMIN_ACTIONS.UPDATE, ADMIN_RESOURCES.AI_PROFILES) && (
              <Button
                size={ButtonSizes.SM}
                variant={ButtonVariants.SECONDARY}
                disabled={isLoading}
                onClick={handleSyncPrices}
              >
                <iconsLib.arrowPath className="mr-1.5 h-4 w-4" />
                {isLoading
                  ? t(AppLocales.Admin.Ai.SyncingPrices)
                  : t(AppLocales.Admin.Ai.SyncPrices)}
              </Button>
            )}
            {can(ADMIN_ACTIONS.CREATE, ADMIN_RESOURCES.AI_PROFILES) && (
              <Button
                size={ButtonSizes.SM}
                variant={ButtonVariants.PRIMARY}
                onClick={() =>
                  navigate(AppRoutes.client.protected.admin.AI_PROFILE_CREATE)
                }
              >
                <iconsLib.plus className="mr-1.5 h-4 w-4" />
                {t(AppLocales.Admin.Ai.CreateProfile)}
              </Button>
            )}
          </div>
        }
      />

      <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-center bg-glass-card p-4 rounded-xl border border-glass-border shadow-glass-card backdrop-blur-md">
        <div className="w-full sm:w-64">
          <SearchInput
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onClear={() => setSearchInput("")}
            placeholder={t(AppLocales.Admin.Ai.Filters.SearchProfiles)}
            searchableKeys={[
              t(AppLocales.Admin.Ai.ProfileForm.KeyLabel),
              t(AppLocales.Admin.Ai.ProfileForm.NameLabel),
              t(AppLocales.Admin.Ai.ProfileForm.ProviderLabel),
              t(AppLocales.Admin.Ai.ProfileForm.ModelLabel),
            ]}
          />
        </div>
        <div className="w-full sm:w-48">
          <Dropdown
            value={providerFilter}
            onValueChange={(val) =>
              updateFilters({ provider: val, model: "", page: 1 })
            }
            options={providerFilterOptions}
          />
        </div>
        <div className="w-full sm:w-48">
          <Dropdown
            value={modelFilter}
            onValueChange={(val) => updateFilters({ model: val, page: 1 })}
            options={modelFilterOptions}
          />
        </div>
        <div className="w-full sm:w-48">
          <Dropdown
            value={statusFilter}
            onValueChange={(val) => updateFilters({ status: val, page: 1 })}
            options={statusFilterOptions}
          />
        </div>
      </div>

      {error ? (
        <AdminState
          title={t(AppLocales.Admin.Common.State.ErrorTitle)}
          message={error}
        />
      ) : (
        <>
          <AdminTable
            columns={columns}
            records={profiles}
            getRowKey={(profile) => profile.id}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            onRowClick={(profile) =>
              navigate(
                AppRoutes.withId(
                  AppRoutes.client.protected.admin.AI_PROFILE_DETAIL,
                  profile.id,
                ),
              )
            }
          />

          {pagination && pagination.total_pages > 1 && (
            <AdminPagination
              pagination={pagination}
              onPageChange={(nextPage) => updateFilters({ page: nextPage })}
            />
          )}
        </>
      )}

      <ConfirmDialog
        isOpen={Boolean(destroyTarget)}
        title={t(AppLocales.Admin.Ai.DestroyProfileTitle)}
        message={t(AppLocales.Admin.Ai.DestroyProfileMessage)}
        confirmLabel={t(AppLocales.Admin.Common.Actions.Destroy)}
        cancelLabel={t(AppLocales.Admin.Common.Actions.Cancel)}
        isDestructive={true}
        isLoading={isLoading}
        onClose={() => setDestroyTarget(null)}
        onConfirm={handleDestroy}
      />
    </div>
  );
};
