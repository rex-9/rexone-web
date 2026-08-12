import { Admin } from ".";
import { IApiPagination, IUser } from "../../../models";
import { parseFromList } from "../../../services/api.service";

class UserController {
  async getUsers(
    params?: { page?: number; limit?: number },
    onSuccess?: (users: IUser[], pagination?: IApiPagination) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
    try {
      const response = await Admin.UserService.getUsers(params);
      const { status, data, meta } = response.data || {};

      if (!status?.success || !data) {
        onError?.(status?.error || "Failed to load users");
        return;
      }

      const users = parseFromList<IUser>(data);

      onSuccess?.(users, meta?.pagination);
    } catch (error) {
      console.error("Error fetching users:", error);
      onError?.("An error occurred while loading users.");
    }
  }
}

export default new UserController();
