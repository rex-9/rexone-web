import { useCallback, useMemo } from "react";
import { useAuth } from "../contexts";
import { AdminAction, AdminResource, IPermission } from "../models";

interface IUsePermissionsResult {
  permissions: IPermission[];
  isLoading: boolean;
  error: string;
  can: (action: AdminAction, resource: AdminResource) => boolean;
  refresh: () => Promise<void>;
}

export const usePermissions = (): IUsePermissionsResult => {
  const { currentUser } = useAuth();

  const isSuperAdmin = useMemo(
    () => currentUser?.role_names?.includes("super_admin") ?? false,
    [currentUser?.role_names],
  );

  const permissions = useMemo<IPermission[]>(
    () =>
      Object.entries(currentUser?.permissions ?? {}).flatMap(
        ([resource, actions]) =>
          (actions ?? []).map((action) => ({
            action,
            resource: resource as AdminResource,
          })),
      ),
    [currentUser?.permissions],
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

  return { permissions, isLoading: false, error: "", can, refresh };
};
