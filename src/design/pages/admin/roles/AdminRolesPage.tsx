import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle, usePermissions } from "../../../../hooks";
import { Admin, IAdminRole } from "../../../../modules/admin";
import {
  AdminActionButton,
  AdminLayout,
  AdminLoadingState,
  AdminState,
  AdminTable,
  ConfirmationDialog,
  IAdminTableColumn,
} from "../../../components";

const countPermissions = (role: IAdminRole): number =>
  Object.values(role.permissions ?? {}).reduce(
    (total, actions) => total + (actions?.length ?? 0),
    0,
  );

export const AdminRolesPage: React.FC = () => {
  useDocumentTitle("Roles");

  const navigate = useNavigate();
  const toast = useToast();
  const { can } = usePermissions();
  const [roles, setRoles] = useState<IAdminRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<IAdminRole | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadRoles = useCallback(async () => {
    setIsLoading(true);
    setError("");

    await Admin.RoleController.getRoles(
      (nextRoles) => {
        setRoles(nextRoles);
        setIsLoading(false);
      },
      (message) => {
        setError(message);
        setIsLoading(false);
      },
    );
  }, []);

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
        header: "Role",
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
        header: "Permissions",
        render: (role) => countPermissions(role),
      },
      {
        key: "users",
        header: "Users",
        render: (role) => role.user_count ?? 0,
      },
      {
        key: "system",
        header: "Type",
        render: (role) => (role.system ? "System" : "Custom"),
      },
      {
        key: "actions",
        header: "",
        className: "text-right",
        render: (role) => (
          <div className="flex justify-end gap-8">
            <AdminActionButton
              action="update"
              resource="roles"
              can={can}
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
                action="delete"
                resource="roles"
                can={can}
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
    [can, navigate],
  );

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);

    await Admin.RoleController.deleteRole(
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
    <AdminLayout
      title="Roles"
      actionLabel="Create role"
      onAction={() => navigate(AppRoutes.client.protected.ADMIN_ROLE_CREATE)}
    >
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

      <ConfirmationDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete role"
        message={`Delete ${deleteTarget?.name || "this role"}? This cannot be undone.`}
        confirmLabel="Delete"
        isLoading={isDeleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </AdminLayout>
  );
};
