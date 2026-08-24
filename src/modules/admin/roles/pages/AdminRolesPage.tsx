import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle } from "../../../../hooks";
import RoleController from "../role.controller";
import { IAdminRole } from "../types";
import {
  AdminActionButton,
  AdminLoadingState,
  AdminState,
  AdminTable,
  ConfirmDialog,
  IAdminTableColumn,
} from "../../components";
import {
  ADMIN_ACTIONS,
  ADMIN_COMMON_LABELS,
  ADMIN_RESOURCES,
  ADMIN_TABLE_HEADERS,
} from "../../constants";

const countPermissions = (role: IAdminRole): number =>
  Object.values(role.permissions ?? {}).reduce(
    (total, actions) => total + (actions?.length ?? 0),
    0,
  );

export const AdminRolesPage: React.FC = () => {
  useDocumentTitle("Roles");

  const navigate = useNavigate();
  const toast = useToast();
  const { isLoading, setLoading } = useLoading();
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
        key: "name",
        header: ADMIN_TABLE_HEADERS.ROLE,
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
        key: "permissions",
        header: ADMIN_TABLE_HEADERS.PERMISSIONS,
        render: (role) => countPermissions(role),
      },
      {
        key: "users",
        header: ADMIN_TABLE_HEADERS.USERS,
        render: (role) => role.user_count ?? 0,
      },
      {
        key: "system",
        header: ADMIN_TABLE_HEADERS.TYPE,
        render: (role) =>
          role.system ? ADMIN_COMMON_LABELS.SYSTEM : ADMIN_COMMON_LABELS.CUSTOM,
      },
      {
        key: "actions",
        header: ADMIN_TABLE_HEADERS.ACTIONS,
        className: "text-right",
        render: (role) => (
          <div className="flex justify-end gap-8">
            <AdminActionButton
              action={ADMIN_ACTIONS.UPDATE}
              resource={ADMIN_RESOURCES.ROLES}
              size="sm"
              variant="secondary"
              className="h-[32px] w-[32px] p-0"
              aria-label="Edit role"
              title="Edit"
              onClick={() =>
                navigate(
                  AppRoutes.client.protected.ADMIN_ROLE_EDIT.replace(
                    ":id",
                    role.id,
                  ),
                )
              }
            >
              <PencilSquareIcon className="h-[18px] w-[18px]" />
            </AdminActionButton>
            {!role.system && (
              <AdminActionButton
                action={ADMIN_ACTIONS.DELETE}
                resource={ADMIN_RESOURCES.ROLES}
                type="button"
                size="sm"
                variant="tertiary"
                className="h-[32px] w-[32px] p-0"
                aria-label="Delete role"
                title="Delete"
                onClick={() => setDeleteTarget(role)}
              >
                <TrashIcon className="h-[18px] w-[18px]" />
              </AdminActionButton>
            )}
          </div>
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
      {isLoading ? (
        <AdminLoadingState />
      ) : error ? (
        <AdminState title="Unable to load roles" message={error} />
      ) : roles.length === 0 ? (
        <AdminState title="No roles yet" message="Created roles appear here." />
      ) : (
        <AdminTable
          columns={columns}
          records={roles}
          getRowKey={(role) => role.id}
        />
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
