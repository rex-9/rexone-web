// src/modules/admin/roles/pages/AdminRolesPage.tsx

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle, usePermissions ,  useSort, SORT_ORDERS } from "../../../../hooks";
import { iconsLib } from "../../../../assets";
import { Button, StatusBadge } from "../../../../design/components";
import RoleController from "../role.controller";
import type { IAdminRole } from "../types";
import {
  AdminState,
  AdminTableActions,
  AdminTable,
  ConfirmDialog,
  PageHeader,
  Tabs,
  type IAdminTableColumn,
} from "../../components";
import {
  ADMIN_RESOURCES,
  ADMIN_ACTIONS,
  ADMIN_COMMON_LABELS,
  ADMIN_TABLE_HEADERS,
  ADMIN_VIEW_MODES,
  type TAdminViewMode,
} from "../../constants";
import {
  ADMIN_ROLE_LABELS,
  ADMIN_ROLE_PAGE_TITLES,
  ADMIN_ROLE_SORT_KEYS,
  ADMIN_ROLE_TABLE_HEADERS,
  ADMIN_ROLE_TABLE_KEYS,
} from "../constants";

const countPermissions = (role: IAdminRole): number =>
  Object.values(role.permissions ?? {}).reduce(
    (total, actions) => total + (actions?.length ?? 0),
    0,
  );

interface IAdminRolesPageProps {
  view?: TAdminViewMode;
}

export const AdminRolesPage: React.FC<IAdminRolesPageProps> = ({
  view = ADMIN_VIEW_MODES.ACTIVE,
}) => {
  useDocumentTitle(
    view === ADMIN_VIEW_MODES.ACTIVE
      ? ADMIN_ROLE_PAGE_TITLES.LIST
      : ADMIN_ROLE_PAGE_TITLES.RECYCLE_BIN,
  );

  const navigate = useNavigate();
  const toast = useToast();
  const { can } = usePermissions();
  const { isLoading, setLoading } = useLoading();
  const [roles, setRoles] = useState<IAdminRole[]>([]);
  const [error, setError] = useState("");
  const [discardTarget, setDiscardTarget] = useState<IAdminRole | null>(null);

  const { sortBy, sortOrder, handleSort } = useSort({
    defaultSortBy: ADMIN_ROLE_SORT_KEYS.CREATED_AT,
    defaultSortOrder: SORT_ORDERS.DESC,
  });

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    setError("");

    const result = await RoleController.getRoles({
      sort_by: sortBy,
      sort_order: sortOrder,
      discarded: view === ADMIN_VIEW_MODES.DISCARDED ? "true" : undefined,
    });

    if (result.success) {
      setRoles(result.roles);
    } else {
      setError(result.error || "Failed to load roles");
    }
    setLoading(false);
  }, [setLoading, sortBy, sortOrder, view]);

  useEffect(() => {
    void fetchRoles();
  }, [fetchRoles]);

  const handleUndiscard = async (role: IAdminRole) => {
    setLoading(true);
    const result = await RoleController.undiscardRole(role.id);
    setLoading(false);

    if (result.success) {
      toast.success("Role restored successfully");
      void fetchRoles();
    } else {
      toast.error(result.error || "Failed to restore role");
    }
  };

  const columns = useMemo<IAdminTableColumn<IAdminRole>[]>(
    () => [
      {
        key: ADMIN_ROLE_TABLE_KEYS.NAME,
        header: ADMIN_ROLE_TABLE_HEADERS.ROLE,
        sortKey: ADMIN_ROLE_SORT_KEYS.NAME,
        render: (role) => (
          <div>
            <div className="font-semibold text-base-content">{role.name}</div>
            <div className="text-caption text-base-content opacity-60 text-xs">
              {role.description || "No description provided."}
            </div>
          </div>
        ),
      },
      {
        key: ADMIN_ROLE_TABLE_KEYS.PERMISSIONS,
        header: ADMIN_ROLE_TABLE_HEADERS.PERMISSIONS,
        render: (role) => {
          const count = countPermissions(role);
          return (
            <span className="font-mono text-sm text-base-content font-medium">
              {count} {count === 1 ? "grant" : "grants"}
            </span>
          );
        },
      },
      {
        key: ADMIN_ROLE_TABLE_KEYS.USERS,
        header: ADMIN_ROLE_TABLE_HEADERS.USERS,
        render: (role) => (
          <span className="text-body-s font-medium">
            {role.user_count ?? 0} users
          </span>
        ),
      },
      {
        key: ADMIN_ROLE_TABLE_KEYS.SYSTEM,
        header: ADMIN_ROLE_TABLE_HEADERS.TYPE,
        render: (role) => (
          <StatusBadge
            status={role.system ? "system" : "custom"}
            label={
              role.system
                ? ADMIN_ROLE_LABELS.SYSTEM
                : ADMIN_ROLE_LABELS.CUSTOM
            }
          />
        ),
      },
      {
        key: ADMIN_ROLE_TABLE_KEYS.ACTIONS,
        header: ADMIN_TABLE_HEADERS.ACTIONS,
        className: "text-right",
        render: (role) => (
          <AdminTableActions
            resource={ADMIN_RESOURCES.ROLES}
            actions={
              view === ADMIN_VIEW_MODES.ACTIVE
                ? [
                    {
                      type: ADMIN_ACTIONS.EDIT,
                      onClick: () =>
                        navigate(
                          AppRoutes.withId(
                            AppRoutes.client.protected.admin.ROLE_EDIT,
                            role.id,
                          ),
                        ),
                    },
                    ...(!role.system
                      ? [
                          {
                            type: ADMIN_ACTIONS.DISCARD,
                            onClick: () => setDiscardTarget(role),
                          },
                        ]
                      : []),
                  ]
                : [
                    {
                      type: ADMIN_ACTIONS.UNDISCARD,
                      onClick: () => void handleUndiscard(role),
                    },
                  ]
            }
          />
        ),
      },
    ],
    [navigate, toast, view],
  );

  const handleDiscard = async () => {
    if (!discardTarget) return;

    setLoading(true);

    const result = await RoleController.discardRole(discardTarget.id);
    setLoading(false);

    if (result.success) {
      toast.success("Role discarded successfully");
      setDiscardTarget(null);
      void fetchRoles();
    } else {
      toast.error(result.error || "Failed to discard role");
    }
  };

  const canCreate = can(ADMIN_ACTIONS.CREATE, ADMIN_RESOURCES.ROLES);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles & Permissions"
        description="Define system roles, access policies, and permission grants across the platform."
        action={
          canCreate && view === ADMIN_VIEW_MODES.ACTIVE ? (
            <Button
              onClick={() =>
                navigate(AppRoutes.client.protected.admin.ROLE_CREATE)
              }
            >
              <iconsLib.plus className="mr-2 h-4 w-4" />
              Create Role
            </Button>
          ) : null
        }
      >
        {can(ADMIN_ACTIONS.DELETE, ADMIN_RESOURCES.ROLES) && (
          <Tabs
            value={view}
            onChange={(tab) => {
              navigate(
                tab === ADMIN_VIEW_MODES.ACTIVE
                  ? AppRoutes.client.protected.admin.ROLES
                  : AppRoutes.client.protected.admin.ROLES_RECYCLE_BIN,
              );
            }}
            items={[
              {
                value: ADMIN_VIEW_MODES.ACTIVE,
                label: "Active Roles",
                icon: iconsLib.shieldCheck,
                count:
                  view === ADMIN_VIEW_MODES.ACTIVE ? roles.length : undefined,
              },
              {
                value: ADMIN_VIEW_MODES.DISCARDED,
                label: "Recycle Bin",
                icon: iconsLib.trash,
                count:
                  view === ADMIN_VIEW_MODES.DISCARDED
                    ? roles.length
                    : undefined,
              },
            ]}
          />
        )}
      </PageHeader>

      {/* Table & States */}
      {error ? (
        <AdminState
          icon={iconsLib.warning}
          title="Unable to load roles"
          message={error}
        />
      ) : !isLoading && roles.length === 0 ? (
        <AdminState
          icon={view === ADMIN_VIEW_MODES.ACTIVE ? iconsLib.key : iconsLib.trash}
          title={
            view === ADMIN_VIEW_MODES.ACTIVE
              ? "No roles yet"
              : "Recycle bin is empty"
          }
          message={
            view === ADMIN_VIEW_MODES.ACTIVE
              ? "Created roles appear here."
              : "Discarded custom roles will appear here."
          }
        />
      ) : (
        <AdminTable
          columns={columns}
          records={roles}
          getRowKey={(role) => role.id}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
        />
      )}

      <ConfirmDialog
        isOpen={Boolean(discardTarget)}
        title="Discard Role"
        message={`Are you sure you want to discard the role "${discardTarget?.name}"? Users with this role will lose associated permissions.`}
        confirmLabel={ADMIN_COMMON_LABELS.DISCARD}
        isDestructive={true}
        isLoading={isLoading}
        onClose={() => setDiscardTarget(null)}
        onConfirm={handleDiscard}
      />
    </div>
  );
};
