// src/modules/admin/ai/pages/AdminAiProfilesPage.tsx

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useLoading } from "../../../../contexts/LoadingContext";
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
  Dropdown,
  SearchInput,
} from "../../../../design";
import { iconsLib } from "../../../../assets";
import AiController from "../ai.controller";
import type { IAdminAiProfile } from "../types";
import {
  AdminPagination,
  AdminState,
  AdminTableActions,
  AdminTable,
  PageHeader,
  type IAdminTableColumn,
} from "../../components";
import {
  ADMIN_PAGE_SIZE,
  ADMIN_RESOURCES,
  ADMIN_ACTIONS,
  ADMIN_COMMON_LABELS,
} from "../../constants";
import {
  ADMIN_AI_PROFILE_SORT_KEYS,
  AI_PROVIDER_OPTIONS,
  AI_PROVIDER_MODELS,
} from "../constants";
import { useTranslate, AppLocales } from "../../../../locales";

export const AdminAiProfilesPage: React.FC = () => {
  const t = useTranslate();
  useDocumentTitle(`${t(AppLocales.Admin.Ai.ProfilesTitle)} | Admin`);

  const navigate = useNavigate();
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
  const { setLoading } = useLoading();
  const [profiles, setProfiles] = useState<IAdminAiProfile[]>([]);
  const [pagination, setPagination] = useState<IApiPagination | null>(null);
  const [error, setError] = useState("");

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

  const providerFilterOptions = useMemo(
    () => [
      {
        value: "",
        label: t(AppLocales.Admin.Ai.Filters.AllProviders),
      },
      ...AI_PROVIDER_OPTIONS.map((o) => ({ value: o.value, label: o.label })),
    ],
    [t],
  );

  const modelFilterOptions = useMemo(() => {
    let models: { value: string; label: string }[] = [];
    if (providerFilter && AI_PROVIDER_MODELS[providerFilter]) {
      models = AI_PROVIDER_MODELS[providerFilter];
    } else {
      const all: { value: string; label: string }[] = [];
      Object.values(AI_PROVIDER_MODELS).forEach((list) => {
        list.forEach((m) => {
          if (!all.some((existing) => existing.value === m.value)) {
            all.push(m);
          }
        });
      });
      models = all;
    }
    return [
      {
        value: "",
        label: t(AppLocales.Admin.Ai.Filters.AllModels),
      },
      ...models,
    ];
  }, [providerFilter, t]);

  const statusFilterOptions = useMemo(
    () => [
      {
        value: "",
        label: t(AppLocales.Admin.Ai.Filters.AllStatuses),
      },
      { value: "active", label: ADMIN_COMMON_LABELS.ACTIVE },
      { value: "inactive", label: ADMIN_COMMON_LABELS.INACTIVE },
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
        render: (profile) => (
          <span className="badge badge-sm badge-neutral uppercase">
            {profile.provider}
          </span>
        ),
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
            <span>Out: {profile.max_output_tokens ?? "Default"}</span>
            <span className="mx-1">/</span>
            <span>Ctx: {profile.context_max_tokens ?? "Default"}</span>
          </div>
        ),
      },
      {
        key: "enabled",
        header: t(AppLocales.Admin.Ai.ProfilesTable.Status),
        sortKey: ADMIN_AI_PROFILE_SORT_KEYS.ENABLED,
        render: (profile) => (
          <StatusBadge
            status={profile.enabled ? "active" : "inactive"}
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
        render: (profile) => (
          <AdminTableActions
            resource={ADMIN_RESOURCES.AI_PROFILES}
            actions={[
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
            ]}
          />
        ),
      },
    ],
    [navigate, t],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={t(AppLocales.Admin.Ai.ProfilesTitle)}
        description={t(AppLocales.Admin.Ai.ProfilesDescription)}
        action={
          can(ADMIN_ACTIONS.CREATE, ADMIN_RESOURCES.AI_PROFILES) ? (
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
          ) : undefined
        }
      />

      <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-center bg-base-100 p-4 rounded-xl border border-base-200">
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
        <div className="rounded-box border border-base-content/10 bg-base-100 shadow-sm">
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
            <div className="border-t border-base-content/10 p-4">
              <AdminPagination
                pagination={pagination}
                onPageChange={(nextPage) => updateFilters({ page: nextPage })}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
