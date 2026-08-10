export type AdminAction = string;

export type AdminResource = string;

export type AdminRoleName = "super_admin" | "admin" | "user" | string;

export type IUserPermissionMap = Partial<Record<AdminResource, AdminAction[]>>;

export interface IPermission {
  action: AdminAction;
  resource: AdminResource;
}
