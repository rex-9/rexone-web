// src/modules/admin/ai/pages/AdminAiRunsPage.tsx

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
  Dropdown,
  SearchInput,
} from "../../../../design";
import AiController from "../ai.controller";
import type { IAdminAiRun } from "../types";
import {
  AdminPagination,
  AdminState,
  AdminTable,
  PageHeader,
  type IAdminTableColumn,
} from "../../components";
import {
  ADMIN_PAGE_SIZE,
  ADMIN_ACTIONS,
  ADMIN_RESOURCES,
} from "../../constants";
import {
  ADMIN_AI_RUN_SORT_KEYS,
  ADMIN_AI_RUN_STATUS_OPTIONS,
  ADMIN_AI_FEATURE_OPTIONS,
  AI_PROVIDER_OPTIONS,
  AI_PROVIDER_MODELS,
} from "../constants";
import { useTranslate, AppLocales } from "../../../../locales";

export const AdminAiRunsPage: React.FC = () => {
  const t = useTranslate();
  useDocumentTitle(`${t(AppLocales.Admin.Ai.RunsTitle)} | Admin`);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const statusFilter = searchParams.get("status") || "";
  const featureFilter = searchParams.get("feature") || "";
  const providerFilter = searchParams.get("provider") || "";
  const modelFilter = searchParams.get("model") || "";
  const searchQuery = searchParams.get("search") || "";
  const [searchInput, setSearchInput] = useState(searchQuery);

  const { sortBy, sortOrder, handleSort } = useSort({
    defaultSortBy: ADMIN_AI_RUN_SORT_KEYS.CREATED_AT,
    defaultSortOrder: SORT_ORDERS.DESC,
  });

  const { can } = usePermissions();
  const { setLoading } = useLoading();
  const [runs, setRuns] = useState<IAdminAiRun[]>([]);
  const [pagination, setPagination] = useState<IApiPagination | null>(null);
  const [error, setError] = useState("");

  const updateFilters = useCallback(
    (updates: {
      page?: number;
      status?: string;
      feature?: string;
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
    () =>
      ADMIN_AI_RUN_STATUS_OPTIONS.map((o) => ({
        value: o.value,
        label:
          o.value === ""
            ? t(AppLocales.Admin.Ai.Filters.AllStatuses)
            : o.label,
      })),
    [t],
  );

  const featureFilterOptions = useMemo(
    () =>
      ADMIN_AI_FEATURE_OPTIONS.map((o) => ({
        value: o.value,
        label:
          o.value === ""
            ? t(AppLocales.Admin.Ai.Filters.AllFeatures)
            : o.label,
      })),
    [t],
  );

  const loadRuns = useCallback(async () => {
    if (!can(ADMIN_ACTIONS.READ, ADMIN_RESOURCES.AI_RUNS)) return;

    setLoading(true);
    setError("");

    const result = await AiController.getRuns({
      page,
      limit: ADMIN_PAGE_SIZE,
      sort_by: sortBy,
      sort_order: sortOrder,
      status: statusFilter || undefined,
      feature: featureFilter || undefined,
      provider: providerFilter || undefined,
      model: modelFilter || undefined,
      search: searchQuery || undefined,
    });

    setLoading(false);

    if (result.success) {
      setRuns(result.runs);
      setPagination(result.pagination);
    } else {
      setError(result.error || t(AppLocales.Admin.Ai.Errors.LoadRuns));
    }
  }, [
    can,
    page,
    sortBy,
    sortOrder,
    statusFilter,
    featureFilter,
    providerFilter,
    modelFilter,
    searchQuery,
    setLoading,
    t,
  ]);

  useEffect(() => {
    void loadRuns();
  }, [loadRuns]);

  const columns: IAdminTableColumn<IAdminAiRun>[] = useMemo(
    () => [
      {
        key: "id",
        header: t(AppLocales.Admin.Ai.RunsTable.Id),
        render: (run) => (
          <span className="font-mono text-xs text-base-content/80">
            {run.id.slice(0, 8)}...
          </span>
        ),
      },
      {
        key: "feature",
        header: t(AppLocales.Admin.Ai.RunsTable.Feature),
        sortKey: ADMIN_AI_RUN_SORT_KEYS.FEATURE,
        render: (run) => (
          <span className="badge badge-sm badge-outline font-mono">
            {run.feature || "chat"}
          </span>
        ),
      },
      {
        key: "profile_key",
        header: t(AppLocales.Admin.Ai.RunsTable.Profile),
        render: (run) => (
          <span className="font-mono text-xs font-semibold text-primary">
            {run.profile_key || "-"}
          </span>
        ),
      },
      {
        key: "provider",
        header: t(AppLocales.Admin.Ai.RunsTable.Provider),
        sortKey: ADMIN_AI_RUN_SORT_KEYS.PROVIDER,
        render: (run) => (
          <span className="badge badge-sm badge-neutral uppercase">
            {run.provider || "-"}
          </span>
        ),
      },
      {
        key: "model",
        header: t(AppLocales.Admin.Ai.RunsTable.Model),
        sortKey: ADMIN_AI_RUN_SORT_KEYS.MODEL,
        render: (run) => (
          <span className="font-mono text-xs text-base-content/80">
            {run.model || "-"}
          </span>
        ),
      },
      {
        key: "status",
        header: t(AppLocales.Admin.Ai.RunsTable.Status),
        sortKey: ADMIN_AI_RUN_SORT_KEYS.STATUS,
        render: (run) => (
          <StatusBadge status={run.status} label={run.status.toUpperCase()} />
        ),
      },
      {
        key: "total_tokens",
        header: t(AppLocales.Admin.Ai.RunsTable.Tokens),
        sortKey: ADMIN_AI_RUN_SORT_KEYS.TOTAL_TOKENS,
        render: (run) => (
          <div className="text-xs">
            <span className="font-semibold text-base-content">
              {run.total_tokens != null
                ? run.total_tokens.toLocaleString()
                : "-"}
            </span>
            {run.prompt_tokens != null && run.completion_tokens != null && (
              <span className="ml-1 text-base-content/50">
                ({run.prompt_tokens} / {run.completion_tokens})
              </span>
            )}
          </div>
        ),
      },
      {
        key: "latency_ms",
        header: t(AppLocales.Admin.Ai.RunsTable.Latency),
        sortKey: ADMIN_AI_RUN_SORT_KEYS.LATENCY_MS,
        render: (run) => (
          <span className="font-mono text-xs">
            {run.latency_ms != null ? `${run.latency_ms}ms` : "-"}
          </span>
        ),
      },
      {
        key: "created_at",
        header: t(AppLocales.Admin.Ai.RunsTable.Created),
        sortKey: ADMIN_AI_RUN_SORT_KEYS.CREATED_AT,
        render: (run) =>
          run.created_at ? (
            <DateTime value={run.created_at} format={DateTimeFormats.ADMIN} />
          ) : (
            "-"
          ),
      },
    ],
    [t],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={t(AppLocales.Admin.Ai.RunsTitle)}
        description={t(AppLocales.Admin.Ai.RunsDescription)}
      />

      <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-center bg-base-100 p-4 rounded-xl border border-base-200">
        <div className="w-full sm:w-64">
          <SearchInput
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onClear={() => setSearchInput("")}
            placeholder={t(AppLocales.Admin.Ai.Filters.SearchRuns)}
            searchableKeys={[
              t(AppLocales.Admin.Ai.RunsTable.Feature),
              t(AppLocales.Admin.Ai.RunsTable.Provider),
              t(AppLocales.Admin.Ai.RunsTable.Model),
              t(AppLocales.Admin.Ai.RunsTable.Profile),
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
        <div className="w-full sm:w-48">
          <Dropdown
            value={featureFilter}
            onValueChange={(val) => updateFilters({ feature: val, page: 1 })}
            options={featureFilterOptions}
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
            records={runs}
            getRowKey={(run) => run.id}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            onRowClick={(run) =>
              navigate(
                AppRoutes.withId(
                  AppRoutes.client.protected.admin.AI_RUN_DETAIL,
                  run.id,
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
