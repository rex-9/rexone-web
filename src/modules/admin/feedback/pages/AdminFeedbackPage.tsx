// src/modules/admin/feedback/pages/AdminFeedbackPage.tsx

import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle, usePermissions ,  useSort, SORT_ORDERS } from "../../../../hooks";
import type { IApiPagination } from "../../../../models";
import { iconsLib } from "../../../../assets";
import {
  Dropdown,
  DropdownSizes,
  getCategoryBadgeVariant,
  getPriorityBadgeVariant,
  StatusBadge,
} from "../../../../design";
import { formatAdminDate } from "../../../../helpers";
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
  ADMIN_FEEDBACK_SORT_KEYS,
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

  const { sortBy, sortOrder, handleSort } = useSort({
    defaultSortBy: ADMIN_FEEDBACK_SORT_KEYS.CREATED_AT,
    defaultSortOrder: SORT_ORDERS.DESC,
  });

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
      sort_by: sortBy,
      sort_order: sortOrder,
    });

    if (result.success) {
      setFeedbacks(result.feedbacks);
      setPagination(result.pagination);
    } else {
      setError(result.error || "Failed to load feedback");
    }

    setLoading(false);
  }, [can, page, statusFilter, categoryFilter, priorityFilter, setLoading, sortBy, sortOrder]);

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
        <StatusBadge
          status={item.category}
          variant={getCategoryBadgeVariant(item.category)}
        />
      ),
    },
    {
      key: ADMIN_FEEDBACK_TABLE_KEYS.CONTENT,
      header: ADMIN_FEEDBACK_TABLE_HEADERS.CONTENT,
      sortKey: ADMIN_FEEDBACK_SORT_KEYS.RATING,
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
      sortKey: ADMIN_FEEDBACK_SORT_KEYS.USER_NAME,
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
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: ADMIN_FEEDBACK_TABLE_KEYS.PRIORITY,
      header: ADMIN_FEEDBACK_TABLE_HEADERS.PRIORITY,
      render: (item) => (
        <StatusBadge
          status={item.priority || "medium"}
          variant={getPriorityBadgeVariant(item.priority)}
        />
      ),
    },
    {
      key: ADMIN_FEEDBACK_TABLE_KEYS.CREATED_AT,
      header: ADMIN_FEEDBACK_TABLE_HEADERS.CREATED_AT,
      sortKey: ADMIN_FEEDBACK_SORT_KEYS.CREATED_AT,
      render: (item) => (
        <div className="text-caption text-base-content opacity-70">
          {formatAdminDate(item.created_at)}
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
          size={DropdownSizes.SM}
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
          size={DropdownSizes.SM}
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
          size={DropdownSizes.SM}
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
