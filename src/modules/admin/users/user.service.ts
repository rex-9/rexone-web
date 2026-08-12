import AppRoutes from "../../../AppRoutes";
import { IJsonApiResource, IUser } from "../../../models";
import { api } from "../../../services";

class UserService {
  async getUsers(params?: { page?: number; limit?: number }) {
    return api.get<IJsonApiResource<IUser>[]>(
      AppRoutes.server.protected.admin.USERS,
      params,
    );
  }
}

export default new UserService();
