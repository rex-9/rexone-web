import type { ADMIN_ROLE_NAMES } from "./constants";

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

export interface IAdminPermission {
  id: string;
  name: string;
  action: string;
  resource: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface IAdminRole {
  id: string;
  name: string;
  description?: string;
  system?: boolean;
  permission_ids?: string[];
  permissions?: Record<string, string[]>;
  user_count?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface IAdminRoleFormValues {
  name: string;
  description?: string;
  permission_ids: string[];
}
