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
