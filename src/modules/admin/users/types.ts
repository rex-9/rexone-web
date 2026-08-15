import { IUser } from "../../../models";

export interface IAdminUser extends IUser {
  id: string;
  confirmed?: boolean;
  locked?: boolean;
}

export interface IAdminUserFormValues {
  username: string;
  name: string;
  email: string;
  password?: string;
  password_confirmation?: string;
  role_ids?: string[];
}

export interface IAdminUserListParams {
  page?: number;
  limit?: number;
}
