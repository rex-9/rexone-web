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
  permissions?: string[];
  created_at: Date;
  updated_at: Date;
}
