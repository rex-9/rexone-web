import { IUser } from "../../../models";
import type { TSortOrder } from "../../../hooks/useSort";

export interface IAdminUser extends IUser {
  id: string;
  confirmed?: boolean;
  discarded_at?: Date | null;
  locked?: boolean;
}

export interface IAdminUserFormValues {
  username: string;
  name: string;
  email: string;
  role_ids?: string[];
}

export interface IAdminUserListParams {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  sort_order?: TSortOrder;
}
