import { Admin } from ".";
import { IApiPagination, IUser } from "../../../models";
import { parseFromList } from "../../../services/api.service";

class UserController {
  async getUsers(params?: { page?: number; limit?: number }): Promise<{
    success: boolean;
    users: IUser[];
    pagination?: IApiPagination | null;
    error?: string;
  }> {
    const response = await Admin.UserService.getUsers(params);
    const { status, data, meta } = response.data || {};

    if (status?.success && data) {
      const users = parseFromList<IUser>(data);
      return {
        success: true,
        users,
        pagination: meta?.pagination ?? null,
      };
    }

    return {
      success: false,
      users: [],
      pagination: null,
      error: status?.error || response.error || "Failed to load users",
    };
  }
}

export default new UserController();
