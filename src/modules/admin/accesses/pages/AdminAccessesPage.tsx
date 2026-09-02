// src/modules/admin/accesses/pages/AdminAccessesPage.tsx

import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle, usePermissions ,  useSort, SORT_ORDERS } from "../../../../hooks";
import type { IApiPagination } from "../../../../models";
import { iconsLib } from "../../../../assets";
import {
  Badge,
  Button,
  getStatusBadgeVariant,
} from "../../../../design";
import {
  SearchInput,
  Dropdown,
} from "../../../../design/components";
import type { IAdminAccess, IGrantAccessPayload } from "../types";
import AdminAccessesController from "../accesses.controller";
import {
  AdminPagination,
  AdminState,
  AdminTable,
  AdminTableActions,
  ConfirmDialog,
  PageHeader,
  type IAdminTableAction,
  type IAdminTableColumn,
} from "../../components";
import {
  ADMIN_PAGE_SIZE,
  ADMIN_ACTIONS,
  ADMIN_RESOURCES,
  ADMIN_TABLE_HEADERS,
} from "../../constants";
import {
  ADMIN_ACCESS_SORT_KEYS,
  ADMIN_ACCESS_STATUS,
  ADMIN_ACCESS_TABLE_HEADERS,
  ADMIN_ACCESS_TABLE_KEYS,
} from "../constants";
import { AdminAccessGrantDialog } from "../components/AdminAccessGrantDialog";
import { AdminAccessExtendDialog } from "../components/AdminAccessExtendDialog";

import { DropdownSizes } from "../../../../design/constants";
import { formatAdminDate } from "../../../../helpers";

export const AdminAccessesPage: React.FC = () => {
  useDocumentTitle("Access | Admin");

  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const statusFilter = searchParams.get("status") || "";
  const searchQuery = searchParams.get("search") || "";
  const [searchInput, setSearchInput] = useState(searchQuery);

  const { sortBy, sortOrder, handleSort } = useSort({
    defaultSortBy: ADMIN_ACCESS_SORT_KEYS.CREATED_AT,
    defaultSortOrder: SORT_ORDERS.DESC,
  });

  const { isLoading, setLoading } = useLoading();
  const toast = useToast();
  const { can, isLoading: permissionsLoading } = usePermissions();

  const [accesses, setAccesses] = useState<IAdminAccess[]>([]);
  const [pagination, setPagination] = useState<IApiPagination | null>(null);
  const [error, setError] = useState("");

  const [isGrantOpen, setIsGrantOpen] = useState(false);
  const [extendTarget, setExtendTarget] = useState<IAdminAccess | null>(null);
  const [revokeTarget, setRevokeTarget] = useState<IAdminAccess | null>(null);

  const updateFilters = useCallback(
    (updates: { page?: number; status?: string; search?: string }) => {
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
          if (updates.search !== undefined) {
            if (updates.search.trim())
              next.set("search", updates.search.trim());
            else next.delete("search");
          }
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  // Keep local search input in sync if URL search param changes externally
  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  // Debounce search input by 300ms before updating URL and querying API
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput.trim() !== searchQuery) {
        updateFilters({ search: searchInput.trim(), page: 1 });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, searchQuery, updateFilters]);

  const loadAccesses = useCallback(async () => {
    if (!can(ADMIN_ACTIONS.READ, ADMIN_RESOURCES.ACCESSES)) return;

    setLoading(true);
    setError("");

    const result = await AdminAccessesController.getAccesses({
      page,
      limit: ADMIN_PAGE_SIZE,
      status: statusFilter || undefined,
      search: searchQuery.trim() || undefined,
      sort_by: sortBy,
      sort_order: sortOrder,
    });

    if (result.success) {
      setAccesses(result.accesses);
      setPagination(result.pagination);
    } else {
      setError(result.error || "Failed to load entitlements");
    }

    setLoading(false);
  }, [can, page, statusFilter, searchQuery, setLoading, sortBy, sortOrder]);

  useEffect(() => {
    if (!permissionsLoading) {
      void loadAccesses();
    }
  }, [loadAccesses, permissionsLoading]);

  const handleGrant = async (payload: IGrantAccessPayload) => {
    setLoading(true);
    const result = await AdminAccessesController.grantAccess(payload);
    setLoading(false);

    if (result.success) {
      toast.success("Entitlement granted successfully! 🎉");
      setIsGrantOpen(false);
      void loadAccesses();
    } else {
      toast.error(result.error || "Failed to grant entitlement");
    }
  };

  const handleExtend = async (
    id: string,
    payload: { days?: number | null },
  ) => {
    setLoading(true);
    const result = await AdminAccessesController.extendAccess(id, payload);
    setLoading(false);

    if (result.success) {
      toast.success("Entitlement extended successfully!");
      setExtendTarget(null);
      void loadAccesses();
    } else {
      toast.error(result.error || "Failed to extend entitlement");
    }
  };

  const handleRevoke = async () => {
    if (!revokeTarget) return;

    setLoading(true);
    const result = await AdminAccessesController.revokeAccess(revokeTarget.id);
    setLoading(false);

    if (result.success) {
      toast.success("Entitlement revoked successfully");
      setRevokeTarget(null);
      void loadAccesses();
    } else {
      toast.error(result.error || "Failed to revoke entitlement");
    }
  };

  const columns: IAdminTableColumn<IAdminAccess>[] = [
    {
      key: ADMIN_ACCESS_TABLE_KEYS.USER,
      header: ADMIN_ACCESS_TABLE_HEADERS.USER,
      sortKey: ADMIN_ACCESS_SORT_KEYS.USER_NAME,
      render: (access) => {
        const displayName =
          access.user_name || access.username || access.user_email || "User";
        return (
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-base-content">{displayName}</span>
              {access.username && access.user_name && (
                <span className="text-caption text-base-content opacity-50 text-xs">
                  (@{access.username})
                </span>
              )}
            </div>
            {access.user_email && (
              <div className="text-caption text-base-content opacity-60 text-xs">
                {access.user_email}
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: ADMIN_ACCESS_TABLE_KEYS.PRODUCT,
      header: ADMIN_ACCESS_TABLE_HEADERS.PRODUCT,
      sortKey: ADMIN_ACCESS_SORT_KEYS.PRODUCT_NAME,
      render: (access) => (
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-base-content">
              {access.product_name || "Product"}
            </span>
            {access.product_code && (
              <span className="rounded bg-base-200 px-1.5 py-0.5 font-mono text-[11px] font-medium text-base-content opacity-80">
                {access.product_code}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: ADMIN_ACCESS_TABLE_KEYS.STATUS,
      header: ADMIN_ACCESS_TABLE_HEADERS.STATUS,
      render: (access) => (
        <Badge variant={getStatusBadgeVariant(access.status)}>
          {access.status.toUpperCase()}
        </Badge>
      ),
    },
    {
      key: ADMIN_ACCESS_TABLE_KEYS.GRANTED_AT,
      header: ADMIN_ACCESS_TABLE_HEADERS.GRANTED_AT,
      sortKey: ADMIN_ACCESS_SORT_KEYS.CREATED_AT,
      render: (access) => formatAdminDate(access.granted_at),
    },
    {
      key: ADMIN_ACCESS_TABLE_KEYS.EXPIRES_AT,
      header: ADMIN_ACCESS_TABLE_HEADERS.EXPIRES,
      sortKey: ADMIN_ACCESS_SORT_KEYS.EXPIRES_AT,
      render: (access) => {
        if (!access.expires_at)
          return <span className="text-success font-semibold">Lifetime</span>;
        return (
          <div>
            <div>{formatAdminDate(access.expires_at)}</div>
            {access.remaining_days !== undefined &&
              access.remaining_days !== null &&
              access.remaining_days > 0 && (
                <span className="text-caption text-base-content opacity-60">
                  ({access.remaining_days} days left)
                </span>
              )}
          </div>
        );
      },
    },
    {
      key: ADMIN_ACCESS_TABLE_KEYS.ACTIONS,
      header: ADMIN_TABLE_HEADERS.ACTIONS,
      className: "text-right",
      render: (access) => {
        const actions: IAdminTableAction[] = [];

        if (access.status !== ADMIN_ACCESS_STATUS.REVOKED) {
          actions.push({
            type: ADMIN_ACTIONS.EXTEND,
            onClick: () => setExtendTarget(access),
          });

          actions.push({
            type: ADMIN_ACTIONS.REVOKE,
            onClick: () => setRevokeTarget(access),
          });
        }

        if (actions.length === 0) return null;

        return (
          <AdminTableActions
            resource={ADMIN_RESOURCES.ACCESSES}
            actions={actions}
          />
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Modals & Dialogs */}
      <AdminAccessGrantDialog
        isOpen={isGrantOpen}
        onClose={() => setIsGrantOpen(false)}
        onSubmit={handleGrant}
      />

      <AdminAccessExtendDialog
        isOpen={Boolean(extendTarget)}
        access={extendTarget}
        onClose={() => setExtendTarget(null)}
        onSubmit={handleExtend}
      />

      <ConfirmDialog
        isOpen={Boolean(revokeTarget)}
        title="Revoke Access"
        message={`Are you sure you want to revoke entitlement access for ${
          revokeTarget?.user_name || revokeTarget?.username || "this user"
        }? They will immediately lose access to ${
          revokeTarget?.product_name || "the product"
        }.`}
        confirmLabel="Revoke Access"
        isDestructive={true}
        onConfirm={handleRevoke}
        onClose={() => setRevokeTarget(null)}
      />

      {/* Header */}
      <PageHeader
        title="Entitlement & Access Management"
        description="Monitor user entitlements, grant complimentary access passes, extend durations, or revoke access rights."
        action={
          can(ADMIN_ACTIONS.CREATE, ADMIN_RESOURCES.ACCESSES) ? (
            <Button
              variant="primary"
              onClick={() => setIsGrantOpen(true)}
              className="flex items-center gap-1.5"
            >
              <iconsLib.plus className="h-4 w-4" />
              Grant Access
            </Button>
          ) : null
        }
      />

      {/* Filters & Search Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <Dropdown
            size={DropdownSizes.SM}
            containerClassName="w-auto min-w-44"
            value={statusFilter}
            onValueChange={(val) => updateFilters({ status: val, page: 1 })}
            options={[
              { value: "", label: "All Statuses" },
              { value: ADMIN_ACCESS_STATUS.ACTIVE, label: "Active" },
              { value: ADMIN_ACCESS_STATUS.REVOKED, label: "Revoked" },
              { value: ADMIN_ACCESS_STATUS.EXPIRED, label: "Expired" },
            ]}
          />
        </div>

        {/* Search */}
        <div className="w-full sm:w-72">
          <SearchInput
            placeholder="Search by user email or name..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onClear={() => setSearchInput("")}
          />
        </div>
      </div>

      {/* Table & States */}
      {error ? (
        <AdminState
          icon={iconsLib.warning}
          title="Unable to load entitlements"
          message={error}
        />
      ) : !isLoading && accesses.length === 0 ? (
        <AdminState
          icon={iconsLib.shieldCheck}
          title="No entitlements found"
          message="No entitlements matching your filter parameters."
        />
      ) : (
        <>
          <AdminTable<IAdminAccess>
            records={accesses}
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
    </div>
  );
};
