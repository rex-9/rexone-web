import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle, usePermissions } from "../../../../hooks";
import { IApiPagination } from "../../../../models";
import UserController from "../user.controller";
import { IAdminUser } from "../types";
import {
  AdminActionButton,
  AdminLoadingState,
  AdminPagination,
  AdminState,
  AdminTable,
  ConfirmDialog,
  IAdminTableColumn,
} from "../../components";
import {
  ADMIN_ACTIONS,
  ADMIN_COMMON_LABELS,
  ADMIN_PAGE_SIZE,
  ADMIN_RESOURCES,
  ADMIN_TABLE_HEADERS,
} from "../../constants";

const formatDate = (value: Date): string => {
  if (!value) return ADMIN_COMMON_LABELS.NOT_AVAILABLE;
  return new Date(value).toLocaleDateString();
};

const formatRoles = (user: IAdminUser): string => {
  if (user.role_names?.length) return user.role_names.join(", ");
  return ADMIN_COMMON_LABELS.UNASSIGNED;
};

export const AdminUsersPage: React.FC = () => {
  useDocumentTitle("User");

  const navigate = useNavigate();
  const toast = useToast();
  const { can, isLoading: permissionsLoading } = usePermissions();
  const { isLoading, setLoading } = useLoading();
  const [users, setUsers] = useState<IAdminUser[]>([]);
  const [pagination, setPagination] = useState<IApiPagination | null>(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<IAdminUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadUsers = useCallback(async () => {
    if (!can(ADMIN_ACTIONS.READ, ADMIN_RESOURCES.USERS)) return;

    setLoading(true);
    setError("");

    await UserController.getUsers(
      { page, limit: ADMIN_PAGE_SIZE },
      (nextUsers, nextPagination) => {
        setUsers(nextUsers);
        setPagination(nextPagination ?? null);
        setLoading(false);
      },
      (message) => {
        setError(message);
        setLoading(false);
      },
    );
  }, [can, page, setLoading]);

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
        header: ADMIN_TABLE_HEADERS.USER,
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
        header: ADMIN_TABLE_HEADERS.EMAIL,
        render: (user) => user.email,
      },
      {
        key: "role",
        header: ADMIN_TABLE_HEADERS.ROLE,
        render: (user) => formatRoles(user),
      },
      {
        key: "created",
        header: ADMIN_TABLE_HEADERS.CREATED,
        render: (user) => formatDate(user.created_at),
      },
      {
        key: "actions",
        header: ADMIN_TABLE_HEADERS.ACTIONS,
        className: "text-right",
        render: (user) => (
          <div className="flex justify-end gap-8">
            <AdminActionButton
              action={ADMIN_ACTIONS.UPDATE}
              resource={ADMIN_RESOURCES.USERS}
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
              action={ADMIN_ACTIONS.DELETE}
              resource={ADMIN_RESOURCES.USERS}
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
    [navigate],
  );

  const handleDelete = async () => {
    if (!deleteTarget || !can(ADMIN_ACTIONS.DELETE, ADMIN_RESOURCES.USERS))
      return;

    setIsDeleting(true);

    await UserController.deleteUser(
      deleteTarget.id,
      (message) => {
        toast.success(message);
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
    <>
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

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete user"
        message={`Delete ${deleteTarget?.email || "this user"}? This cannot be undone.`}
        confirmLabel="Delete"
        isLoading={isDeleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </>
  );
};
