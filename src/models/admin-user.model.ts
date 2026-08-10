import { IUser } from "./user.model";

export interface IAdminUser extends IUser {
  id: string;
  confirmed?: boolean;
  locked?: boolean;
  permission_ids?: string[];
}

export interface IAdminUserFormValues {
  username: string;
  name: string;
  email: string;
  password?: string;
  password_confirmation?: string;
  role_ids?: string[];
  permission_ids?: string[];
}

export interface IAdminUserListParams {
  page?: number;
  limit?: number;
}

export interface IAdminRole {
  id: string;
  name: string;
  description?: string;
  permission_ids?: string[];
  permissions?: Record<string, string[]>;
}

export interface IAdminPermission {
  id: string;
  name: string;
  action: string;
  resource: string;
}
