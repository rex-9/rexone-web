// src/modules/admin/log/pages/AdminLogsPage.tsx
import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useToast } from "../../../../contexts/ToastContext";
import {
  useDocumentTitle,
  usePermissions,
  useSort,
  SORT_ORDERS,
} from "../../../../hooks";
import type { IApiPagination } from "../../../../models";
import { iconsLib } from "../../../../assets";
import {
  Badge,
  BadgeVariants,
  Dropdown,
  DropdownSizes,
  getSeverityBadgeVariant,
} from "../../../../design";
import { formatAdminDate } from "../../../../helpers";
import type { IAdminLog } from "../types";
import AdminLogsController from "../logs.controller";
import {
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
} from "../../constants";
import {
  ADMIN_LOG_PLATFORM,
  ADMIN_LOG_RESOLUTION,
  ADMIN_LOG_SEVERITY,
  ADMIN_LOG_SORT_KEYS,
  ADMIN_LOG_TABLE_HEADERS,
  ADMIN_LOG_TABLE_KEYS,
} from "../constants";
import { AdminLogDetailDialog } from "../components/AdminLogDetailDialog";

export const AdminLogsPage: React.FC = () => {
  useDocumentTitle("Client Telemetry & Logs | Admin");

  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const resolutionFilter = (searchParams.get("resolution") ||
    ADMIN_LOG_RESOLUTION.UNRESOLVED) as "unresolved" | "resolved" | "all";
  const severityFilter = searchParams.get("severity") || "";
  const platformFilter = searchParams.get("platform") || "";

  const { sortBy, sortOrder, handleSort } = useSort({
    defaultSortBy: ADMIN_LOG_SORT_KEYS.CREATED_AT,
    defaultSortOrder: SORT_ORDERS.DESC,
  });

  const { isLoading, setLoading } = useLoading();
  const toast = useToast();
  const { can, isLoading: permissionsLoading } = usePermissions();

  const [logs, setLogs] = useState<IAdminLog[]>([]);
  const [pagination, setPagination] = useState<IApiPagination | null>(null);
  const [error, setError] = useState("");

  const [detailTarget, setDetailTarget] = useState<IAdminLog | null>(null);
  const [destroyTarget, setDestroyTarget] = useState<IAdminLog | null>(null);

  const updateFilters = useCallback(
    (updates: {
      page?: number;
      resolution?: string;
      severity?: string;
      platform?: string;
    }) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (updates.page !== undefined) {
            if (updates.page > 1) next.set("page", updates.page.toString());
            else next.delete("page");
          }
          if (updates.resolution !== undefined) {
            if (
              updates.resolution &&
              updates.resolution !== ADMIN_LOG_RESOLUTION.UNRESOLVED
            )
              next.set("resolution", updates.resolution);
            else next.delete("resolution");
          }
          if (updates.severity !== undefined) {
            if (updates.severity) next.set("severity", updates.severity);
            else next.delete("severity");
          }
          if (updates.platform !== undefined) {
            if (updates.platform) next.set("platform", updates.platform);
            else next.delete("platform");
          }
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const loadLogs = useCallback(async () => {
    if (!can(ADMIN_ACTIONS.READ, ADMIN_RESOURCES.CLIENTS)) return;

    setLoading(true);
    setError("");

    const result = await AdminLogsController.getLogs({
      page,
      limit: ADMIN_PAGE_SIZE,
      severity: severityFilter || undefined,
      platform: platformFilter || undefined,
      unresolved:
        resolutionFilter === ADMIN_LOG_RESOLUTION.UNRESOLVED
          ? "true"
          : undefined,
      resolved:
        resolutionFilter === ADMIN_LOG_RESOLUTION.RESOLVED ? "true" : undefined,
      sort_by: sortBy,
      sort_order: sortOrder,
    });

    if (result.success) {
      setLogs(result.logs);
      setPagination(result.pagination);
    } else {
      setError(result.error || "Failed to load telemetry logs");
    }

    setLoading(false);
  }, [
    can,
    page,
    resolutionFilter,
    severityFilter,
    platformFilter,
    setLoading,
    sortBy,
    sortOrder,
  ]);

  useEffect(() => {
    if (!permissionsLoading) {
      void loadLogs();
    }
  }, [loadLogs, permissionsLoading]);

  const handleToggleResolve = async (
    id: string,
    currentlyResolved: boolean,
  ) => {
    setLoading(true);
    const result = currentlyResolved
      ? await AdminLogsController.unresolveLog(id)
      : await AdminLogsController.resolveLog(id);
    setLoading(false);

    if (result.success) {
      toast.success(
        currentlyResolved
          ? "Log marked as unresolved"
          : "Log marked as resolved! 🎉",
      );
      setDetailTarget(null);
      void loadLogs();
    } else {
      toast.error(result.error || "Failed to update log resolution status");
    }
  };

  const handleDestroy = async () => {
    if (!destroyTarget) return;

    setLoading(true);
    const result = await AdminLogsController.deleteLog(destroyTarget.id);
    setLoading(false);

    if (result.success) {
      toast.success("Log entry destroyed");
      setDestroyTarget(null);
      void loadLogs();
    } else {
      toast.error(result.error || "Failed to destroy log");
    }
  };

  const columns: IAdminTableColumn<IAdminLog>[] = [
    {
      key: ADMIN_LOG_TABLE_KEYS.SEVERITY,
      header: ADMIN_LOG_TABLE_HEADERS.SEVERITY,
      render: (log) => (
        <Badge variant={getSeverityBadgeVariant(log.severity)}>
          {log.severity.toUpperCase()}
        </Badge>
      ),
    },
    {
      key: ADMIN_LOG_TABLE_KEYS.MESSAGE,
      header: ADMIN_LOG_TABLE_HEADERS.MESSAGE,
      render: (log) => (
        <div className="max-w-md">
          <div className="line-clamp-2 font-mono text-body-m font-medium text-base-content">
            {log.message}
          </div>
          <div className="text-caption text-base-content opacity-60 font-mono text-xs pt-0.5">
            {log.url || "N/A"}
          </div>
        </div>
      ),
    },
    {
      key: ADMIN_LOG_TABLE_KEYS.PLATFORM,
      header: ADMIN_LOG_TABLE_HEADERS.PLATFORM,
      render: (log) => (
        <div>
          <div className="font-semibold text-base-content">
            {log.platform?.toUpperCase() || "WEB"}
          </div>
          <div className="text-caption text-base-content opacity-60 text-xs font-mono">
            {log.environment || "production"} •{" "}
            {log.browser || log.device || ""}
          </div>
        </div>
      ),
    },
    {
      key: ADMIN_LOG_TABLE_KEYS.COUNT,
      header: ADMIN_LOG_TABLE_HEADERS.COUNT,
      sortKey: ADMIN_LOG_SORT_KEYS.COUNT,
      render: (log) => (
        <Badge variant={BadgeVariants.SECONDARY}>{log.occurrence_count}×</Badge>
      ),
    },
    {
      key: ADMIN_LOG_TABLE_KEYS.LAST_OCCURRED,
      header: ADMIN_LOG_TABLE_HEADERS.LAST_OCCURRED,
      sortKey: ADMIN_LOG_SORT_KEYS.CREATED_AT,
      render: (log) => (
        <div className="text-caption text-base-content opacity-70">
          {formatAdminDate(log.last_occurred_at || log.created_at)}
        </div>
      ),
    },
    {
      key: ADMIN_LOG_TABLE_KEYS.ACTIONS,
      header: "",
      className: "text-right",
      render: (log) => (
        <AdminTableActions
          resource={ADMIN_RESOURCES.CLIENTS}
          actions={[
            {
              type: ADMIN_ACTIONS.INSPECT,
              onClick: () => setDetailTarget(log),
            },
            {
              type: ADMIN_ACTIONS.DESTROY,
              onClick: () => setDestroyTarget(log),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Client Telemetry & Logs"
        description="Monitor client runtime exceptions, inspect stack traces, and manage crash reports across Web and Mobile."
      />

      {/* Dropdown Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Dropdown
          size={DropdownSizes.SM}
          containerClassName="w-auto min-w-40"
          value={resolutionFilter}
          onValueChange={(val) => updateFilters({ resolution: val, page: 1 })}
          options={[
            { value: ADMIN_LOG_RESOLUTION.UNRESOLVED, label: "Unresolved" },
            { value: ADMIN_LOG_RESOLUTION.RESOLVED, label: "Resolved" },
            { value: ADMIN_LOG_RESOLUTION.ALL, label: "All Logs" },
          ]}
        />

        <Dropdown
          size={DropdownSizes.SM}
          containerClassName="w-auto min-w-40"
          value={severityFilter}
          onValueChange={(val) => updateFilters({ severity: val, page: 1 })}
          options={[
            { value: "", label: "All Severities" },
            { value: ADMIN_LOG_SEVERITY.FATAL, label: "Fatal" },
            { value: ADMIN_LOG_SEVERITY.ERROR, label: "Error" },
            { value: ADMIN_LOG_SEVERITY.WARN, label: "Warning" },
          ]}
        />

        <Dropdown
          size={DropdownSizes.SM}
          containerClassName="w-auto min-w-40"
          value={platformFilter}
          onValueChange={(val) => updateFilters({ platform: val, page: 1 })}
          options={[
            { value: "", label: "All Platforms" },
            { value: ADMIN_LOG_PLATFORM.WEB, label: "Web" },
            { value: ADMIN_LOG_PLATFORM.ANDROID, label: "Android" },
            { value: ADMIN_LOG_PLATFORM.IOS, label: "iOS" },
          ]}
        />
      </div>

      {/* Table & States */}
      {error ? (
        <AdminState
          icon={iconsLib.warning}
          title="Unable to load logs"
          message={error}
        />
      ) : !isLoading && logs.length === 0 ? (
        <AdminState
          icon={iconsLib.document}
          title="No logs found"
          message="No client telemetry logs matching your filter parameters."
        />
      ) : (
        <>
          <AdminTable<IAdminLog>
            records={logs}
            columns={columns}
            getRowKey={(record) => record.id}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
          />
          <AdminPagination
            pagination={pagination}
            onPageChange={(nextPage) => updateFilters({ page: nextPage })}
          />
        </>
      )}

      {/* Dialogs */}
      <AdminLogDetailDialog
        isOpen={!!detailTarget}
        log={detailTarget}
        onClose={() => setDetailTarget(null)}
        onToggleResolve={handleToggleResolve}
        isLoading={isLoading}
      />

      <ConfirmDialog
        isOpen={!!destroyTarget}
        title="Destroy Telemetry Log"
        message="Are you sure you want to destroy this log entry permanently? This action cannot be undone."
        confirmLabel="Destroy"
        isDestructive={true}
        onConfirm={handleDestroy}
        onClose={() => setDestroyTarget(null)}
        isLoading={isLoading}
      />
    </div>
  );
};
