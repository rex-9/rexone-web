import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle, usePermissions } from "../../../../hooks";
import { IApiPagination } from "../../../../models";
import UserController from "../user.controller";
import { IAdminUser } from "../types";
import {
  AdminPagination,
  AdminState,
  AdminTableActions,
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
import {
  ADMIN_USER_LABELS,
  ADMIN_USER_PAGE_TITLES,
  ADMIN_USER_TABLE_HEADERS,
  ADMIN_USER_TABLE_KEYS,
} from "../constants";
import { translate } from "../../../../locales";

const formatDate = (value?: Date | string | null): string => {
  if (!value) return ADMIN_COMMON_LABELS.NOT_AVAILABLE;
  return new Date(value).toLocaleDateString();
};

const formatRoles = (user: IAdminUser): string => {
  if (user.role_names?.length) return user.role_names.join(", ");
  return ADMIN_USER_LABELS.UNASSIGNED;
};

type UserListView = "active" | "discarded";
type UserLifecycleAction = "discard" | "restore";

interface IAdminUsersPageProps {
  view?: UserListView;
}

export const AdminUsersPage: React.FC<IAdminUsersPageProps> = ({
  view = "active",
}) => {
  useDocumentTitle(
    view === "active" ? ADMIN_USER_PAGE_TITLES.LIST : ADMIN_USER_PAGE_TITLES.RECYCLE_BIN,
  );

  const navigate = useNavigate();
  const toast = useToast();
  const { can, isLoading: permissionsLoading } = usePermissions();
  const { setLoading } = useLoading();
  const [users, setUsers] = useState<IAdminUser[]>([]);
  const [pagination, setPagination] = useState<IApiPagination | null>(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [actionTarget, setActionTarget] = useState<IAdminUser | null>(null);
  const [lifecycleAction, setLifecycleAction] =
    useState<UserLifecycleAction | null>(null);
  const [isLifecycleLoading, setIsLifecycleLoading] = useState(false);

  const loadUsers = useCallback(async () => {
    if (!can(ADMIN_ACTIONS.READ, ADMIN_RESOURCES.USERS)) return;

    setLoading(true);
    setError("");

    const load = view === "active"
      ? UserController.getUsers.bind(UserController)
      : UserController.getDiscardedUsers.bind(UserController);

    await load(
      { page, limit: ADMIN_PAGE_SIZE },
      (nextUsers, nextPagination) => {
        setUsers(nextUsers);
        setPagination(nextPagination ?? null);
        setLoading(false);
      },
      (message) => {
        setError(translate(message));
        setLoading(false);
      },
    );
  }, [can, page, setLoading, view]);

  useEffect(() => {
    if (permissionsLoading) return;

    const timeoutId = window.setTimeout(() => {
      void loadUsers();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadUsers, permissionsLoading]);

  const openLifecycleDialog = (
    user: IAdminUser,
    action: UserLifecycleAction,
  ) => {
    setActionTarget(user);
    setLifecycleAction(action);
  };

  const closeLifecycleDialog = () => {
    if (isLifecycleLoading) return;

    setActionTarget(null);
    setLifecycleAction(null);
  };

  const columns = useMemo<IAdminTableColumn<IAdminUser>[]>(
    () => [
      {
        key: ADMIN_USER_TABLE_KEYS.IDENTITY,
        header: ADMIN_USER_TABLE_HEADERS.USER,
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
        key: ADMIN_USER_TABLE_KEYS.EMAIL,
        header: ADMIN_USER_TABLE_HEADERS.EMAIL,
        render: (user) => user.email,
      },
      {
        key: ADMIN_USER_TABLE_KEYS.ROLE,
        header: ADMIN_USER_TABLE_HEADERS.ROLE,
        render: (user) => formatRoles(user),
      },
      {
        key: ADMIN_USER_TABLE_KEYS.LIFECYCLE_DATE,
        header: view === "active" ? ADMIN_TABLE_HEADERS.CREATED : "Discarded",
        render: (user) =>
          formatDate(view === "active" ? user.created_at : user.discarded_at),
      },
      {
        key: ADMIN_USER_TABLE_KEYS.ACTIONS,
        header: ADMIN_TABLE_HEADERS.ACTIONS,
        className: "text-right",
        render: (user) => (
          <AdminTableActions
            resource={ADMIN_RESOURCES.USERS}
            actions={
              view === "active" ? (
                [
                  {
                    type: ADMIN_ACTIONS.EDIT,
                    onClick: () =>
                      navigate(
                        AppRoutes.withId(
                          AppRoutes.client.protected.admin.USER_EDIT,
                          user.id,
                        ),
                      ),
                  },
                  {
                    type: ADMIN_ACTIONS.DISCARD,
                    onClick: () => openLifecycleDialog(user,  ADMIN_ACTIONS.DISCARD),
                  },
                ]
              ) : (
                [
                  {
                    type: ADMIN_ACTIONS.RESTORE,
                    onClick: () => openLifecycleDialog(user,ADMIN_ACTIONS.RESTORE),
                  },
                ]
              )
            }
          />
        ),
      },
    ],
    [navigate, view],
  );

  const handleLifecycleAction = async () => {
    if (!actionTarget || !lifecycleAction || !can(ADMIN_ACTIONS.DELETE, ADMIN_RESOURCES.USERS))
      return;

    setIsLifecycleLoading(true);

    const onSuccess = (message: string) => {
      toast.success(message);
      setIsLifecycleLoading(false);
      setActionTarget(null);
      setLifecycleAction(null);
      void loadUsers();
    };

    const onError = (message: string) => {
      toast.error(message);
      setIsLifecycleLoading(false);
    };

    if (lifecycleAction === "discard") {
      await UserController.discardUser(actionTarget.id, onSuccess, onError);
      return;
    }

    if (lifecycleAction === "restore") {
      await UserController.restoreUser(actionTarget.id, onSuccess, onError);
      return;
    }
  };

  const lifecycleDialog = lifecycleAction === "discard"
    ? {
        title: "Discard user",
        message: `Move ${actionTarget?.email || "this user"} to the recycle bin? You can restore this account later.`,
        confirmLabel: "Discard",
        isDestructive: false,
      }
    : lifecycleAction === "restore"
      ? {
          title: "Restore user",
          message: `Restore ${actionTarget?.email || "this user"}? This account will return to the active users list.`,
          confirmLabel: "Restore",
          isDestructive: false,
        }
      : {
          title: "Restore user",
          message: `Restore ${actionTarget?.email || "this user"}? This account will return to the active users list.`,
          confirmLabel: "Restore",
          isDestructive: false,
        };

  return (
    <>
      {error ? (
        <AdminState title="Unable to load users" message={error} />
      ) : (
        <>
          {users.length === 0 ? (
            <AdminState
              title={view === "active" ? "No users yet" : "Recycle bin is empty"}
              message={
                view === "active"
                  ? "Users will appear here once the backend returns admin user records."
                  : "Discarded users can be restored here."
              }
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
        </>
      )}

      <ConfirmDialog
        isOpen={Boolean(actionTarget && lifecycleAction)}
        {...lifecycleDialog}
        isLoading={isLifecycleLoading}
        onClose={closeLifecycleDialog}
        onConfirm={handleLifecycleAction}
      />
    </>
  );
};

export const AdminDiscardedUsersPage: React.FC = () => (
  <AdminUsersPage view="discarded" />
);
