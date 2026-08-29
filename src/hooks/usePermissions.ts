// src/hooks/usePermissions.ts

import { useMemo } from "react";
import { useAuth } from "../contexts/AuthContext";

export interface IUsePermissionsResult {
  can: (action: string, resource: string) => boolean;
  hasRole: (role: string) => boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

export const usePermissions = (): IUsePermissionsResult => {
  const { currentUser } = useAuth();

  const isSuperAdmin = useMemo(() => {
    if (!currentUser) return false;
    if (currentUser.is_super_admin) return true;
    return currentUser.roles?.includes("super_admin") ?? false;
  }, [currentUser]);

  const isAdmin = useMemo(() => {
    if (!currentUser) return false;
    if (isSuperAdmin) return true;
    if (currentUser.is_admin) return true;
    return (
      currentUser.roles?.some((r) => r.toLowerCase().includes("admin")) ?? false
    );
  }, [currentUser, isSuperAdmin]);

  const hasRole = (role: string): boolean => {
    if (!currentUser) return false;
    if (isSuperAdmin) return true;
    return currentUser.roles?.includes(role) ?? false;
  };

  const can = (action: string, resource: string): boolean => {
    if (!currentUser) return false;
    if (isSuperAdmin) return true;

    const perms = currentUser.permissions;
    if (!perms) return false;

    // If permissions is Record<string, string[]> (resource => actions[])
    if (typeof perms === "object" && !Array.isArray(perms)) {
      const resourceActions = (perms as Record<string, string[]>)[resource];
      return resourceActions?.includes(action) ?? false;
    }

    // If permissions is string[] (e.g. "read_users", "create_payments")
    if (Array.isArray(perms)) {
      const target = `${action}_${resource}`;
      return perms.includes(target);
    }

    return false;
  };

  return {
    can,
    hasRole,
    isAdmin,
    isSuperAdmin,
  };
};
