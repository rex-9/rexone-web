import { useCallback, useMemo } from "react";
import { useAuth } from "../contexts";
import { ADMIN_ACTIONS, ADMIN_RESOURCES } from "../modules/admin/constants";
import type {
  AdminAction,
  AdminRoleName,
  AdminResource,
  IPermission,
} from "../modules/admin/roles";

const ADMIN_ROLE_RESOURCE_PREFIXES: Record<AdminResource, readonly string[]> = {
  [ADMIN_RESOURCES.USERS]: ["user", "users"],
  [ADMIN_RESOURCES.ROLES]: ["role", "roles"],
  [ADMIN_RESOURCES.PRODUCTS]: ["product", "products"],
  [ADMIN_RESOURCES.NOTIFICATIONS]: ["notification", "notifications"],
  [ADMIN_RESOURCES.ROOMS]: ["chat", "room", "rooms"],
  [ADMIN_RESOURCES.MESSAGES]: ["chat", "message", "messages"],
};

interface IUsePermissionsResult {
  permissions: IPermission[];
  isLoading: boolean;
  error: string;
  can: (action: AdminAction, resource: AdminResource) => boolean;
  refresh: () => Promise<void>;
}

const getAdminRoleResourceScope = (
  roleNames: AdminRoleName[] | null | undefined,
): Set<AdminResource> => {
  const scopedResources = new Set<AdminResource>();

  roleNames
    ?.filter((roleName) => roleName !== "user")
    .forEach((roleName) => {
      if (roleName === "admin") {
        Object.values(ADMIN_RESOURCES).forEach((resource) =>
          scopedResources.add(resource),
        );
        return;
      }

      if (!roleName.endsWith("_admin")) return;

      const rolePrefix = roleName.replace(/_admin$/, "");
      Object.entries(ADMIN_ROLE_RESOURCE_PREFIXES).forEach(
        ([resource, prefixes]) => {
          if (prefixes.includes(rolePrefix)) {
            scopedResources.add(resource as AdminResource);
          }
        },
      );
    });

  return scopedResources;
};

export const usePermissions = (): IUsePermissionsResult => {
  const { currentUser, isAuthenticated } = useAuth();
  const isLoading = isAuthenticated && !currentUser;

  const isSuperAdmin = useMemo(
    () => currentUser?.role_names?.includes("super_admin") ?? false,
    [currentUser?.role_names],
  );

  const permissions = useMemo<IPermission[]>(
    () => {
      const scopedResources = getAdminRoleResourceScope(currentUser?.role_names);

      return Object.entries(currentUser?.permissions ?? {}).flatMap(
        ([resource, actions]) => {
          const adminResource = resource as AdminResource;

          if (scopedResources.has(adminResource)) {
            return (actions ?? []).map((action) => ({
              action,
              resource: adminResource,
            }));
          }

          if (
            adminResource === ADMIN_RESOURCES.USERS &&
            actions?.includes(ADMIN_ACTIONS.READ)
          ) {
            return [
              {
                action: ADMIN_ACTIONS.READ,
                resource: adminResource,
              },
            ];
          }

          return [];
        },
      );
    },
    [currentUser?.permissions, currentUser?.role_names],
  );

  const permissionKeys = useMemo(
    () =>
      new Set(
        permissions.map(
          (permission) => `${permission.action}:${permission.resource}`,
        ),
      ),
    [permissions],
  );

  const can = useCallback(
    (action: AdminAction, resource: AdminResource) =>
      isSuperAdmin ||
      permissionKeys.has(`${action}:${resource}`),
    [isSuperAdmin, permissionKeys],
  );

  const refresh = useCallback(async () => undefined, []);

  return { permissions, isLoading, error: "", can, refresh };
};
