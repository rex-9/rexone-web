// src/modules/admin/users/pages/AdminUsersPage.tsx

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle, usePermissions } from "../../../../hooks";
import type { IApiPagination } from "../../../../models";
import { iconsLib } from "../../../../assets";
import { Button, Badge, SearchInput, getRoleBadgeVariant } from "../../../../design";
import UserController from "../user.controller";
import type { IAdminUser } from "../types";
import {
  AdminPagination,
  AdminState,
  AdminTableActions,
  AdminTable,
  ConfirmDialog,
  PageHeader,
  Tabs,
  type IAdminTableColumn,
} from "../../components";
import {
  ADMIN_ACTIONS,
  ADMIN_COMMON_LABELS,
  ADMIN_PAGE_SIZE,
  ADMIN_RESOURCES,
  ADMIN_TABLE_HEADERS,
  ADMIN_VIEW_MODES,
  type TAdminViewMode,
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

const renderUserRoles = (user: IAdminUser) => {
  const roles: string[] =
    user.role_names ?? user.roles ?? (user.role ? [user.role] : []);
  if (!roles.length) {
    return (
      <span className="text-caption text-base-content opacity-50">
        {ADMIN_USER_LABELS.UNASSIGNED}
      </span>
    );
  }
  return (
    <div className="flex flex-wrap items-center gap-1">
      {roles.map((role) => (
        <Badge key={role} size="xs" variant={getRoleBadgeVariant(role)}>
          {role}
        </Badge>
      ))}
    </div>
  );
};

type UserLifecycleAction =
  | typeof ADMIN_ACTIONS.DISCARD
  | typeof ADMIN_ACTIONS.UNDISCARD;

interface IAdminUsersPageProps {
  view?: TAdminViewMode;
}

export const AdminUsersPage: React.FC<IAdminUsersPageProps> = ({
  view = ADMIN_VIEW_MODES.ACTIVE,
}) => {
  useDocumentTitle(
    view === ADMIN_VIEW_MODES.ACTIVE
      ? ADMIN_USER_PAGE_TITLES.LIST
      : ADMIN_USER_PAGE_TITLES.RECYCLE_BIN,
  );

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const searchQuery = searchParams.get("search") || "";

  const [searchInput, setSearchInput] = useState(searchQuery);
  const toast = useToast();
  const { can, isLoading: permissionsLoading } = usePermissions();
  const { isLoading, setLoading } = useLoading();
  const [users, setUsers] = useState<IAdminUser[]>([]);
  const [pagination, setPagination] = useState<IApiPagination | null>(null);
  const [error, setError] = useState("");
  const [actionTarget, setActionTarget] = useState<IAdminUser | null>(null);
  const [lifecycleAction, setLifecycleAction] =
    useState<UserLifecycleAction | null>(null);

  const updateFilters = useCallback(
    (updates: { page?: number; search?: string }) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (updates.page !== undefined) {
            if (updates.page > 1) next.set("page", updates.page.toString());
            else next.delete("page");
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

  const loadUsers = useCallback(async () => {
    if (!can(ADMIN_ACTIONS.READ, ADMIN_RESOURCES.USERS)) return;

    setLoading(true);
    setError("");

    const load =
      view === "active"
        ? UserController.getUsers.bind(UserController)
        : UserController.getDiscardedUsers.bind(UserController);

    await load(
      { page, limit: ADMIN_PAGE_SIZE, search: searchQuery.trim() || undefined },
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
  }, [can, page, searchQuery, setLoading, view]);

  useEffect(() => {
    if (!permissionsLoading) {
      void loadUsers();
    }
  }, [loadUsers, permissionsLoading]);

  const openLifecycleDialog = (
    user: IAdminUser,
    action: UserLifecycleAction,
  ) => {
    setActionTarget(user);
    setLifecycleAction(action);
  };

  const closeLifecycleDialog = () => {
    if (isLoading) return;

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
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-base-content">
                {user.name || user.username || user.email}
              </span>
              {user.username && (
                <span className="text-caption text-base-content opacity-50 text-xs">
                  (@{user.username})
                </span>
              )}
            </div>
            <div className="text-caption text-base-content opacity-60 text-xs">
              {user.email}
            </div>
          </div>
        ),
      },
      {
        key: ADMIN_USER_TABLE_KEYS.ROLE,
        header: ADMIN_USER_TABLE_HEADERS.ROLE,
        render: (user) => renderUserRoles(user),
      },
      {
        key: ADMIN_USER_TABLE_KEYS.LIFECYCLE_DATE,
        header:
          view === ADMIN_VIEW_MODES.ACTIVE
            ? ADMIN_TABLE_HEADERS.CREATED
            : "Discarded",
        render: (user) =>
          formatDate(
            view === ADMIN_VIEW_MODES.ACTIVE
              ? user.created_at
              : user.discarded_at,
          ),
      },
      {
        key: ADMIN_USER_TABLE_KEYS.ACTIONS,
        header: ADMIN_TABLE_HEADERS.ACTIONS,
        className: "text-right",
        render: (user) => (
          <AdminTableActions
            resource={ADMIN_RESOURCES.USERS}
            actions={
              view === "active"
                ? [
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
                      onClick: () =>
                        openLifecycleDialog(user, ADMIN_ACTIONS.DISCARD),
                    },
                  ]
                : [
                    {
                      type: ADMIN_ACTIONS.UNDISCARD,
                      onClick: () =>
                        openLifecycleDialog(user, ADMIN_ACTIONS.UNDISCARD),
                    },
                  ]
            }
          />
        ),
      },
    ],
    [navigate, view],
  );

  const handleLifecycleAction = async () => {
    if (
      !actionTarget ||
      !lifecycleAction ||
      !can(ADMIN_ACTIONS.DELETE, ADMIN_RESOURCES.USERS)
    )
      return;

    setLoading(true);

    const onSuccess = (message: string) => {
      toast.success(message);
      setLoading(false);
      setActionTarget(null);
      setLifecycleAction(null);
      void loadUsers();
    };

    const onError = (message: string) => {
      toast.error(message);
      setLoading(false);
    };

    if (lifecycleAction === "discard") {
      await UserController.discardUser(actionTarget.id, onSuccess, onError);
      return;
    }

    if (lifecycleAction === "undiscard") {
      await UserController.undiscardUser(actionTarget.id, onSuccess, onError);
      return;
    }
  };

  const lifecycleDialog =
    lifecycleAction === "discard"
      ? {
          title: "Discard User",
          message: `Move ${actionTarget?.email || "this user"} to the recycle bin? You can restore this account later.`,
          confirmLabel: ADMIN_COMMON_LABELS.DISCARD,
          isDestructive: true,
        }
      : {
          title: "Restore User",
          message: `Restore ${actionTarget?.email || "this user"}? This account will return to the active users list.`,
          confirmLabel: ADMIN_COMMON_LABELS.UNDISCARD,
          isDestructive: false,
        };

  const canCreate = can(ADMIN_ACTIONS.CREATE, ADMIN_RESOURCES.USERS);

  return (
    <div className="space-y-6">
      <PageHeader
        title={view === "active" ? "Users" : "User Recycle Bin"}
        description={
          view === "active"
            ? "Manage customer accounts, assign IAM roles, and oversee account access."
            : "Review and restore discarded user accounts."
        }
        action={
          view === "active" && canCreate ? (
            <Button
              onClick={() =>
                navigate(AppRoutes.client.protected.admin.USER_CREATE)
              }
            >
              <iconsLib.plus className="mr-2 h-4 w-4" />
              Create User
            </Button>
          ) : null
        }
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Tabs
            value={view}
            onChange={(tab) => {
              navigate(
                tab === ADMIN_VIEW_MODES.ACTIVE
                  ? AppRoutes.client.protected.admin.USERS
                  : AppRoutes.client.protected.admin.USERS_RECYCLE_BIN,
              );
              updateFilters({ page: 1 });
            }}
            items={[
              { value: ADMIN_VIEW_MODES.ACTIVE, label: "Active Users" },
              { value: ADMIN_VIEW_MODES.DISCARDED, label: "Recycle Bin" },
            ]}
          />
          <div className="w-full sm:w-72">
            <SearchInput
              placeholder="Search by name, username or email..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onClear={() => setSearchInput("")}
            />
          </div>
        </div>
      </PageHeader>

      {/* Table & States */}
      {error ? (
        <AdminState
          icon={iconsLib.warning}
          title="Unable to load users"
          message={error}
        />
      ) : !isLoading && users.length === 0 ? (
        <AdminState
          icon={iconsLib.user}
          title={
            view === ADMIN_VIEW_MODES.ACTIVE
              ? "No active users"
              : "No discarded users in recycle bin"
          }
          message={
            view === ADMIN_VIEW_MODES.ACTIVE
              ? "No user accounts found matching your filter criteria."
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
          <AdminPagination
            pagination={pagination}
            onPageChange={(nextPage) => updateFilters({ page: nextPage })}
          />
        </>
      )}

      {/* Discard / Restore Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(actionTarget && lifecycleAction)}
        title={lifecycleDialog.title}
        message={lifecycleDialog.message}
        confirmLabel={lifecycleDialog.confirmLabel}
        isDestructive={lifecycleDialog.isDestructive}
        isLoading={isLoading}
        onClose={closeLifecycleDialog}
        onConfirm={handleLifecycleAction}
      />
    </div>
  );
};

export const AdminDiscardedUsersPage: React.FC = () => (
  <AdminUsersPage view={ADMIN_VIEW_MODES.DISCARDED} />
);
