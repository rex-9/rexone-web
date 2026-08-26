import type {
  AdminRoleName,
  IUserPermissionMap,
} from "../modules/admin/roles/types";

export interface IUser {
  id?: string;
  username: string;
  name: string;
  email: string;
  provider: string;
  bio: string;
  profile_pic_url: string;
  role_ids?: string[];
  role_names?: AdminRoleName[];
  permissions?: IUserPermissionMap;
  created_at: Date;
  updated_at: Date;
}
