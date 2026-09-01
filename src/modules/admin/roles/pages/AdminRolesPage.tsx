import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle } from "../../../../hooks";
import { iconsLib } from "../../../../assets";
import RoleController from "../role.controller";
import { IAdminRole } from "../types";
import {
  
  AdminState,
  AdminTableActions,
  AdminTable,
  ConfirmDialog,
  IAdminTableColumn,
} from "../../components";
import {
  ADMIN_RESOURCES,
  ADMIN_ACTIONS,
  ADMIN_TABLE_HEADERS,
} from "../../constants";
import {
  ADMIN_ROLE_LABELS,
  ADMIN_ROLE_PAGE_TITLES,
  ADMIN_ROLE_TABLE_HEADERS,
  ADMIN_ROLE_TABLE_KEYS,
} from "../constants";

const countPermissions = (role: IAdminRole): number =>
  Object.values(role.permissions ?? {}).reduce(
    (total, actions) => total + (actions?.length ?? 0),
    0,
  );

export const AdminRolesPage: React.FC = () => {
  useDocumentTitle(ADMIN_ROLE_PAGE_TITLES.LIST);

  const navigate = useNavigate();
  const toast = useToast();
  const { setLoading } = useLoading();
  const [roles, setRoles] = useState<IAdminRole[]>([]);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<IAdminRole | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadRoles = useCallback(async () => {
    setLoading(true);
    setError("");

    await RoleController.getRoles(
      (nextRoles) => {
        setRoles(nextRoles);
       
        setLoading(false);
      },
      (message) => {
        setError(message);
        setLoading(false);
      },
    );
  }, [setLoading]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadRoles();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadRoles]);

  const columns = useMemo<IAdminTableColumn<IAdminRole>[]>(
    () => [
      {
        key: ADMIN_ROLE_TABLE_KEYS.NAME,
        header: ADMIN_ROLE_TABLE_HEADERS.ROLE,
        render: (role) => (
          <div>
            <div className="font-medium text-base-content">{role.name}</div>
            {role.description && (
              <div className="text-body-s text-base-content opacity-60">
                {role.description}
              </div>
            )}
          </div>
        ),
      },
      {
        key: ADMIN_ROLE_TABLE_KEYS.PERMISSIONS,
        header: ADMIN_ROLE_TABLE_HEADERS.PERMISSIONS,
        render: (role) => countPermissions(role),
      },
      {
        key: ADMIN_ROLE_TABLE_KEYS.USERS,
        header: ADMIN_ROLE_TABLE_HEADERS.USERS,
        render: (role) => role.user_count ?? 0,
      },
      {
        key: ADMIN_ROLE_TABLE_KEYS.SYSTEM,
        header: ADMIN_ROLE_TABLE_HEADERS.TYPE,
        render: (role) =>
          role.system ? ADMIN_ROLE_LABELS.SYSTEM : ADMIN_ROLE_LABELS.CUSTOM,
      },
      {
        key: ADMIN_ROLE_TABLE_KEYS.ACTIONS,
        header: ADMIN_TABLE_HEADERS.ACTIONS,
        className: "text-right",
        render: (role) => (
          <AdminTableActions
            resource={ADMIN_RESOURCES.ROLES}
            actions={[
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
                      type: ADMIN_ACTIONS.DELETE,
                      onClick: () => setDeleteTarget(role),
                    },
                  ]
                : []),
            ]}
          />
        ),
      },
    ],
    [navigate],
  );

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);

    await RoleController.deleteRole(
      deleteTarget.id,
      () => {
        toast.success("Role deleted");
        setDeleteTarget(null);
        setIsDeleting(false);
        void loadRoles();
      },
      (message) => {
        toast.error(message);
        setIsDeleting(false);
      },
    );
  };

  return (
    <>
      {error ? (
        <AdminState
          icon={iconsLib.warning}
          title="Unable to load roles"
          message={error}
        />
      ) : roles.length === 0 ? (
        <AdminState
          icon={iconsLib.key}
          title="No roles yet"
          message="Created roles appear here."
        />
      ) : (
        <>
        <AdminTable
          columns={columns}
          records={roles}
          getRowKey={(role) => role.id}
        />
         </>
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete role"
        message={`Delete ${deleteTarget?.name || "this role"}? This cannot be undone.`}
        confirmLabel="Delete"
        isLoading={isDeleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </>
  );
};
