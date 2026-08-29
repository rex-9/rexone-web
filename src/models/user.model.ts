// src/models/user.model.ts

export interface IUser {
  id: string;
  username: string;
  name: string;
  email: string;
  provider: string;
  bio?: string;
  profile_pic_url?: string;
  role?: string;
  roles?: string[];
  permissions?: Record<string, string[]> | string[];
  is_admin?: boolean;
  is_super_admin?: boolean;
  created_at: Date | string;
  updated_at: Date | string;
}
