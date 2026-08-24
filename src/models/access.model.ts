import { ADMIN_ROLE_NAMES } from "../modules/admin/constants";

export type AdminAction = string;

export type AdminResource = string;

export type AdminRoleName =
  | (typeof ADMIN_ROLE_NAMES)[keyof typeof ADMIN_ROLE_NAMES]
  | string;

export type IUserPermissionMap = Partial<Record<AdminResource, AdminAction[]>>;

export interface IPermission {
  action: AdminAction;
  resource: AdminResource;
}

export const isAdminRoleName = (roleName: string): boolean =>
  roleName === ADMIN_ROLE_NAMES.ADMIN || roleName.endsWith("_admin");

export const hasAdminRole = (
  roleNames: AdminRoleName[] | null | undefined,
): boolean => roleNames?.some((roleName) => isAdminRoleName(roleName)) ?? false;
