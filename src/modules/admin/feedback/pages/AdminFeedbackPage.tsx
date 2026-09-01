// src/modules/admin/feedback/pages/AdminFeedbackPage.tsx

import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle, usePermissions } from "../../../../hooks";
import type { IApiPagination } from "../../../../models";
import { iconsLib } from "../../../../assets";
import {
  Badge,
  Dropdown,
  getCategoryBadgeVariant,
  getPriorityBadgeVariant,
  getStatusBadgeVariant,
} from "../../../../design";
import type { IAdminFeedback } from "../types";
import AdminFeedbackController from "../feedback.controller";
import {
  AdminPagination,
  AdminState,
  AdminTable,
  AdminTableActions,
  PageHeader,
  type IAdminTableColumn,
} from "../../components";
import {
  ADMIN_ACTIONS,
  ADMIN_PAGE_SIZE,
  ADMIN_RESOURCES,
} from "../../constants";
import {
  ADMIN_FEEDBACK_CATEGORY,
  ADMIN_FEEDBACK_PRIORITY,
  ADMIN_FEEDBACK_STATUS,
  ADMIN_FEEDBACK_TABLE_HEADERS,
  ADMIN_FEEDBACK_TABLE_KEYS,
} from "../constants";
import { AdminFeedbackTriageDialog } from "../components/AdminFeedbackTriageDialog";

export const AdminFeedbackPage: React.FC = () => {
  useDocumentTitle("Feedback Inbox | Admin");

  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const statusFilter = searchParams.get("status") || "";
  const categoryFilter = searchParams.get("category") || "";
  const priorityFilter = searchParams.get("priority") || "";

  const { isLoading, setLoading } = useLoading();
  const toast = useToast();
  const { can, isLoading: permissionsLoading } = usePermissions();

  const [feedbacks, setFeedbacks] = useState<IAdminFeedback[]>([]);
  const [pagination, setPagination] = useState<IApiPagination | null>(null);
  const [error, setError] = useState("");

  const [triageTarget, setTriageTarget] = useState<IAdminFeedback | null>(null);

  const updateFilters = useCallback(
    (updates: {
      page?: number;
      status?: string;
      category?: string;
      priority?: string;
    }) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (updates.page !== undefined) {
            if (updates.page > 1) next.set("page", updates.page.toString());
            else next.delete("page");
          }
          if (updates.status !== undefined) {
            if (updates.status) next.set("status", updates.status);
            else next.delete("status");
          }
          if (updates.category !== undefined) {
            if (updates.category) next.set("category", updates.category);
            else next.delete("category");
          }
          if (updates.priority !== undefined) {
            if (updates.priority) next.set("priority", updates.priority);
            else next.delete("priority");
          }
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const loadFeedbacks = useCallback(async () => {
    if (!can(ADMIN_ACTIONS.READ, ADMIN_RESOURCES.FEEDBACKS)) return;

    setLoading(true);
    setError("");

    const result = await AdminFeedbackController.getFeedbacks({
      page,
      limit: ADMIN_PAGE_SIZE,
      status: statusFilter || undefined,
      category: categoryFilter || undefined,
      priority: priorityFilter || undefined,
    });

    if (result.success) {
      setFeedbacks(result.feedbacks);
      setPagination(result.pagination);
    } else {
      setError(result.error || "Failed to load feedback");
    }

    setLoading(false);
  }, [can, page, statusFilter, categoryFilter, priorityFilter, setLoading]);

  useEffect(() => {
    if (!permissionsLoading) {
      void loadFeedbacks();
    }
  }, [loadFeedbacks, permissionsLoading]);

  const handleUpdate = async (
    id: string,
    payload: { status?: string; priority?: string; admin_notes?: string },
  ) => {
    setLoading(true);
    const result = await AdminFeedbackController.updateFeedback(id, payload);
    setLoading(false);

    if (result.success) {
      toast.success("Feedback updated successfully!");
      setTriageTarget(null);
      void loadFeedbacks();
    } else {
      toast.error(result.error || "Failed to update feedback");
    }
  };

  const columns: IAdminTableColumn<IAdminFeedback>[] = [
    {
      key: ADMIN_FEEDBACK_TABLE_KEYS.CATEGORY,
      header: ADMIN_FEEDBACK_TABLE_HEADERS.CATEGORY,
      render: (item) => (
        <Badge variant={getCategoryBadgeVariant(item.category)}>
          {item.category.replace("_", " ")}
        </Badge>
      ),
    },
    {
      key: ADMIN_FEEDBACK_TABLE_KEYS.CONTENT,
      header: ADMIN_FEEDBACK_TABLE_HEADERS.CONTENT,
      render: (item) => (
        <div className="max-w-md">
          <div className="line-clamp-2 text-body-m font-medium text-base-content">
            {item.content}
          </div>
          {item.rating && (
            <div className="text-caption text-warning pt-0.5">
              {"⭐".repeat(item.rating)} ({item.rating}/10)
            </div>
          )}
        </div>
      ),
    },
    {
      key: ADMIN_FEEDBACK_TABLE_KEYS.USER,
      header: ADMIN_FEEDBACK_TABLE_HEADERS.USER,
      render: (item) => (
        <div>
          <div className="font-semibold text-base-content">
            {item.user_name || item.user_email || "Anonymous"}
          </div>
          {item.platform && (
            <div className="text-caption text-base-content opacity-60 text-xs">
              {item.platform} • {item.app_version || "web"}
            </div>
          )}
        </div>
      ),
    },
    {
      key: ADMIN_FEEDBACK_TABLE_KEYS.STATUS,
      header: ADMIN_FEEDBACK_TABLE_HEADERS.STATUS,
      render: (item) => (
        <Badge variant={getStatusBadgeVariant(item.status)}>
          {item.status.replace("_", " ")}
        </Badge>
      ),
    },
    {
      key: ADMIN_FEEDBACK_TABLE_KEYS.PRIORITY,
      header: ADMIN_FEEDBACK_TABLE_HEADERS.PRIORITY,
      render: (item) => (
        <Badge variant={getPriorityBadgeVariant(item.priority)}>
          {(item.priority || "medium").replace("_", " ").toUpperCase()}
        </Badge>
      ),
    },
    {
      key: ADMIN_FEEDBACK_TABLE_KEYS.CREATED_AT,
      header: ADMIN_FEEDBACK_TABLE_HEADERS.CREATED_AT,
      render: (item) => (
        <div className="text-caption text-base-content opacity-70">
          {new Date(item.created_at).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: ADMIN_FEEDBACK_TABLE_KEYS.ACTIONS,
      header: "",
      className: "text-right",
      render: (item) => (
        <AdminTableActions
          resource={ADMIN_RESOURCES.FEEDBACKS}
          actions={[
            {
              type: ADMIN_ACTIONS.REVIEW,
              onClick: () => setTriageTarget(item),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Feedback Inbox"
        description="Triage customer feedback, review bug reports, and prioritize feature requests."
      />

      {/* Dropdown Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Dropdown
          size="sm"
          containerClassName="w-auto min-w-44"
          value={statusFilter}
          onValueChange={(val) => updateFilters({ status: val, page: 1 })}
          options={[
            { value: "", label: "All Statuses" },
            { value: ADMIN_FEEDBACK_STATUS.NEW, label: "New" },
            { value: ADMIN_FEEDBACK_STATUS.IN_PROGRESS, label: "In Progress" },
            { value: ADMIN_FEEDBACK_STATUS.RESOLVED, label: "Resolved" },
            { value: ADMIN_FEEDBACK_STATUS.CLOSED, label: "Closed" },
          ]}
        />

        <Dropdown
          size="sm"
          containerClassName="w-auto min-w-44"
          value={categoryFilter}
          onValueChange={(val) => updateFilters({ category: val, page: 1 })}
          options={[
            { value: "", label: "All Categories" },
            { value: ADMIN_FEEDBACK_CATEGORY.BUG, label: "Bug Report" },
            {
              value: ADMIN_FEEDBACK_CATEGORY.FEATURE_REQUEST,
              label: "Feature Request",
            },
            {
              value: ADMIN_FEEDBACK_CATEGORY.IMPROVEMENT,
              label: "Improvement",
            },
            { value: ADMIN_FEEDBACK_CATEGORY.GENERAL, label: "General" },
          ]}
        />

        <Dropdown
          size="sm"
          containerClassName="w-auto min-w-44"
          value={priorityFilter}
          onValueChange={(val) => updateFilters({ priority: val, page: 1 })}
          options={[
            { value: "", label: "All Priorities" },
            { value: ADMIN_FEEDBACK_PRIORITY.CRITICAL, label: "Critical" },
            { value: ADMIN_FEEDBACK_PRIORITY.URGENT, label: "Urgent" },
            { value: ADMIN_FEEDBACK_PRIORITY.HIGH, label: "High" },
            { value: ADMIN_FEEDBACK_PRIORITY.MEDIUM, label: "Medium" },
            { value: ADMIN_FEEDBACK_PRIORITY.LOW, label: "Low" },
          ]}
        />
      </div>

      {/* Table & States */}
      {error ? (
        <AdminState
          icon={iconsLib.warning}
          title="Unable to load feedback"
          message={error}
        />
      ) : !isLoading && feedbacks.length === 0 ? (
        <AdminState
          icon={iconsLib.mail}
          title="No feedback found"
          message="No user feedback matching your filter criteria."
        />
      ) : (
        <>
          <AdminTable<IAdminFeedback>
            records={feedbacks}
            columns={columns}
            getRowKey={(record) => record.id}
          />
          <AdminPagination
            pagination={pagination}
            onPageChange={(nextPage) => updateFilters({ page: nextPage })}
          />
        </>
      )}

      {/* Dialogs */}
      <AdminFeedbackTriageDialog
        isOpen={!!triageTarget}
        feedback={triageTarget}
        onClose={() => setTriageTarget(null)}
        onSubmit={handleUpdate}
        isLoading={isLoading}
      />
    </div>
  );
};
