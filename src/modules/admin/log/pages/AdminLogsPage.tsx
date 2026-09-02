// src/modules/admin/log/pages/AdminLogsPage.tsx

import React, { useCallback, useEffect, useState } from "react";
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
import { iconsLib } from "../../../../assets";
import {
  Badge,
  BadgeSizes,
  BadgeVariants,
  Dropdown,
  DropdownSizes,
  getSeverityBadgeVariant,
  StatusBadge,
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
  Tabs,
  type IAdminTableColumn,
} from "../../components";
import {
  ADMIN_ACTIONS,
  ADMIN_COMMON_LABELS,
  ADMIN_PAGE_SIZE,
  ADMIN_RESOURCES,
  ADMIN_VIEW_MODES,
  type TAdminViewMode,
} from "../../constants";
import {
  ADMIN_LOG_RESOLUTION,
  ADMIN_LOG_SORT_KEYS,
  ADMIN_LOG_TABLE_HEADERS,
  ADMIN_LOG_TABLE_KEYS,
  type TAdminLogResolution,
} from "../constants";
import { AdminLogDetailDialog } from "../components/AdminLogDetailDialog";

interface IAdminLogsPageProps {
  view?: TAdminViewMode;
}

export const AdminLogsPage: React.FC<IAdminLogsPageProps> = ({
  view = ADMIN_VIEW_MODES.ACTIVE,
}) => {
  useDocumentTitle(
    view === ADMIN_VIEW_MODES.ACTIVE
      ? "Client Telemetry & Logs | Admin"
      : "Recycle Bin | Client Telemetry & Logs",
  );

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const resolutionFilter = (searchParams.get("resolution") ||
    ADMIN_LOG_RESOLUTION.UNRESOLVED) as TAdminLogResolution;
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
  const [discardTarget, setDiscardTarget] = useState<IAdminLog | null>(null);
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
      discarded: view === ADMIN_VIEW_MODES.DISCARDED ? "true" : undefined,
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
    view,
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

  const handleUndiscard = async (log: IAdminLog) => {
    setLoading(true);
    const result = await AdminLogsController.undiscardLog(log.id);
    setLoading(false);

    if (result.success) {
      toast.success("Telemetry log restored");
      void loadLogs();
    } else {
      toast.error(result.error || "Failed to restore telemetry log");
    }
  };

  const handleDiscard = async () => {
    if (!discardTarget) return;

    setLoading(true);
    const result = await AdminLogsController.discardLog(discardTarget.id);
    setLoading(false);

    if (result.success) {
      toast.success("Log entry discarded");
      setDiscardTarget(null);
      void loadLogs();
    } else {
      toast.error(result.error || "Failed to discard log");
    }
  };

  const handleDestroy = async () => {
    if (!destroyTarget) return;

    setLoading(true);
    const result = await AdminLogsController.deleteLog(destroyTarget.id);
    setLoading(false);

    if (result.success) {
      toast.success("Log entry permanently destroyed");
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
        <StatusBadge
          status={log.severity}
          variant={getSeverityBadgeVariant(log.severity)}
        />
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
        <Badge size={BadgeSizes.XS} variant={BadgeVariants.SECONDARY}>
          {log.occurrence_count}×
        </Badge>
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
          actions={
            view === ADMIN_VIEW_MODES.ACTIVE
              ? [
                  {
                    type: ADMIN_ACTIONS.INSPECT,
                    onClick: () => setDetailTarget(log),
                  },
                  {
                    type: ADMIN_ACTIONS.DISCARD,
                    onClick: () => setDiscardTarget(log),
                  },
                ]
              : [
                  {
                    type: ADMIN_ACTIONS.INSPECT,
                    onClick: () => setDetailTarget(log),
                  },
                  {
                    type: ADMIN_ACTIONS.UNDISCARD,
                    onClick: () => void handleUndiscard(log),
                  },
                  {
                    type: ADMIN_ACTIONS.DESTROY,
                    onClick: () => setDestroyTarget(log),
                  },
                ]
          }
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Client Telemetry & Logs"
        description="Monitor client runtime exceptions, inspect stack traces, and manage crash reports across Web and Mobile."
      >
        <Tabs
          value={view}
          onChange={(tab) => {
            navigate(
              tab === ADMIN_VIEW_MODES.ACTIVE
                ? AppRoutes.client.protected.admin.LOGS
                : AppRoutes.client.protected.admin.LOGS_RECYCLE_BIN,
            );
            updateFilters({ page: 1 });
          }}
          items={[
            {
              value: ADMIN_VIEW_MODES.ACTIVE,
              label: "Active Logs",
              icon: iconsLib.document,
              count:
                view === ADMIN_VIEW_MODES.ACTIVE
                  ? pagination?.total_count
                  : undefined,
            },
            {
              value: ADMIN_VIEW_MODES.DISCARDED,
              label: "Recycle Bin",
              icon: iconsLib.trash,
              count:
                view === ADMIN_VIEW_MODES.DISCARDED
                  ? pagination?.total_count
                  : undefined,
            },
          ]}
        />
      </PageHeader>

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
            { value: "error", label: "Error" },
            { value: "warning", label: "Warning" },
            { value: "info", label: "Info" },
            { value: "critical", label: "Critical" },
            { value: "debug", label: "Debug" },
          ]}
        />

        <Dropdown
          size={DropdownSizes.SM}
          containerClassName="w-auto min-w-40"
          value={platformFilter}
          onValueChange={(val) => updateFilters({ platform: val, page: 1 })}
          options={[
            { value: "", label: "All Platforms" },
            { value: "web", label: "Web" },
            { value: "ios", label: "iOS" },
            { value: "android", label: "Android" },
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
          icon={
            view === ADMIN_VIEW_MODES.ACTIVE
              ? iconsLib.document
              : iconsLib.trash
          }
          title={
            view === ADMIN_VIEW_MODES.ACTIVE
              ? "No logs found"
              : "Recycle bin is empty"
          }
          message={
            view === ADMIN_VIEW_MODES.ACTIVE
              ? "No client telemetry logs matching your filter parameters."
              : "Discarded client telemetry logs will appear here."
          }
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
        isOpen={!!discardTarget}
        title="Discard Telemetry Log"
        message="Are you sure you want to discard this telemetry log entry?"
        confirmLabel={ADMIN_COMMON_LABELS.DISCARD}
        isDestructive={true}
        onConfirm={handleDiscard}
        onClose={() => setDiscardTarget(null)}
        isLoading={isLoading}
      />

      <ConfirmDialog
        isOpen={!!destroyTarget}
        title="Destroy Telemetry Log"
        message="Are you sure you want to permanently destroy this telemetry log entry? This action cannot be undone."
        confirmLabel={ADMIN_COMMON_LABELS.DESTROY}
        isDestructive={true}
        onConfirm={handleDestroy}
        onClose={() => setDestroyTarget(null)}
        isLoading={isLoading}
      />
    </div>
  );
};
