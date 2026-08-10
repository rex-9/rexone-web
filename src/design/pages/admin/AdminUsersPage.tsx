import React, { useCallback, useEffect, useMemo, useState } from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../../AppRoutes";
import { UserController } from "../../../controllers";
import { useToast } from "../../../contexts/ToastContext";
import { useDocumentTitle, usePermissions } from "../../../hooks";
import { IAdminUser, IApiPagination } from "../../../models";
import {
  AdminActionButton,
  AdminLayout,
  AdminLoadingState,
  AdminPagination,
  AdminState,
  AdminTable,
  ConfirmationDialog,
  IAdminTableColumn,
} from "../../components";

const PAGE_SIZE = 10;

const formatDate = (value: Date): string => {
  if (!value) return "Not available";
  return new Date(value).toLocaleDateString();
};

const formatRoles = (user: IAdminUser): string => {
  if (user.role_names?.length) return user.role_names.join(", ");
  return "Unassigned";
};

export const AdminUsersPage: React.FC = () => {
  useDocumentTitle("User");

  const navigate = useNavigate();
  const toast = useToast();
  const { can, isLoading: permissionsLoading } = usePermissions();
  const [users, setUsers] = useState<IAdminUser[]>([]);
  const [pagination, setPagination] = useState<IApiPagination | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<IAdminUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadUsers = useCallback(async () => {
    if (!can("read", "users")) return;

    setIsLoading(true);
    setError("");

    await UserController.getAdminUsers(
      { page, limit: PAGE_SIZE },
      (nextUsers, nextPagination) => {
        setUsers(nextUsers);
        setPagination(nextPagination ?? null);
        setIsLoading(false);
      },
      (message) => {
        setError(message);
        setIsLoading(false);
      },
    );
  }, [can, page]);

  useEffect(() => {
    if (permissionsLoading) return;

    const timeoutId = window.setTimeout(() => {
      void loadUsers();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadUsers, permissionsLoading]);

  const columns = useMemo<IAdminTableColumn<IAdminUser>[]>(
    () => [
      {
        key: "identity",
        header: "User",
        render: (user) => (
          <div>
            <div className="font-medium text-base-content">{user.name}</div>
            <div className="text-body-s text-base-content opacity-60">
              @{user.username}
            </div>
          </div>
        ),
      },
      {
        key: "email",
        header: "Email",
        render: (user) => user.email,
      },
      {
        key: "role",
        header: "Role",
        render: (user) => formatRoles(user),
      },
      {
        key: "created",
        header: "Created",
        render: (user) => formatDate(user.created_at),
      },
      {
        key: "actions",
        header: "",
        className: "text-right",
        render: (user) => (
          <div className="flex justify-end gap-8">
            <AdminActionButton
              action="update"
              resource="users"
              can={can}
              size="sm"
              variant="secondary"
              className="h-[32px] w-[32px] p-0"
              aria-label="Edit user"
              title="Edit"
              onClick={() =>
                navigate(
                  AppRoutes.client.protected.ADMIN_USER_EDIT.replace(
                    ":id",
                    user.id,
                  ),
                )
              }
            >
              <PencilSquareIcon className="h-[18px] w-[18px]" />
            </AdminActionButton>
            <AdminActionButton
              action="delete"
              resource="users"
              can={can}
              size="sm"
              variant="tertiary"
              className="h-[32px] w-[32px] p-0"
              aria-label="Delete user"
              title="Delete"
              onClick={() => setDeleteTarget(user)}
            >
              <TrashIcon className="h-[18px] w-[18px]" />
            </AdminActionButton>
          </div>
        ),
      },
    ],
    [can, navigate],
  );

  const handleDelete = async () => {
    if (!deleteTarget || !can("delete", "users")) return;

    setIsDeleting(true);

    await UserController.deleteAdminUser(
      deleteTarget.id,
      () => {
        toast.success("User deleted");
        setDeleteTarget(null);
        setIsDeleting(false);
        void loadUsers();
      },
      (message) => {
        toast.error(message);
        setIsDeleting(false);
      },
    );
  };

  return (
    <AdminLayout
      title="Users"
      actionLabel={can("create", "users") ? "Create user" : undefined}
      onAction={() => navigate(AppRoutes.client.protected.ADMIN_USER_CREATE)}
    >
      {isLoading || permissionsLoading ? (
        <AdminLoadingState />
      ) : error ? (
        <AdminState title="Unable to load users" message={error} />
      ) : users.length === 0 ? (
        <AdminState
          title="No users yet"
          message="Users will appear here once the backend returns admin user records."
        />
      ) : (
        <>
          <AdminTable
            columns={columns}
            records={users}
            getRowKey={(user) => user.id}
          />
          <AdminPagination pagination={pagination} onPageChange={setPage} />
        </>
      )}

      <ConfirmationDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete user"
        message={`Delete ${deleteTarget?.email || "this user"}? This cannot be undone.`}
        confirmLabel="Delete"
        isLoading={isDeleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </AdminLayout>
  );
};
