import AppRoutes from "../../../AppRoutes";
import { IApiEnvelope, IApiResponse, IJsonApiResource } from "../../../models";
import { api } from "../../../services";
import {
  IAdminUser,
  IAdminUserFormValues,
  IAdminUserListParams,
} from "./types";
import { IAdminRole } from "../roles";

const buildAdminUserPath = (id: string): string =>
  AppRoutes.server.protected.ADMIN_USER_DETAIL.replace(":id", id);

export type AdminUserResponse =
  | IJsonApiResource<IAdminUser>
  | { user: IAdminUser };

class UserService {
  async getUsers(
    params?: IAdminUserListParams,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IAdminUser>[]>>> {
    return api.get<IJsonApiResource<IAdminUser>[]>(
      AppRoutes.server.protected.ADMIN_USERS,
      params ? { page: params.page, limit: params.limit } : undefined,
    );
  }

  async getUser(
    id: string,
  ): Promise<IApiResponse<IApiEnvelope<AdminUserResponse>>> {
    return api.get<AdminUserResponse>(buildAdminUserPath(id));
  }

  async createUser(
    values: IAdminUserFormValues,
  ): Promise<IApiResponse<IApiEnvelope<AdminUserResponse>>> {
    return api.post<AdminUserResponse>(AppRoutes.server.protected.ADMIN_USERS, {
      user: values,
    });
  }

  async updateUser(
    id: string,
    values: IAdminUserFormValues,
  ): Promise<IApiResponse<IApiEnvelope<AdminUserResponse>>> {
    return api.patch<AdminUserResponse>(buildAdminUserPath(id), {
      user: values,
    });
  }

  async deleteUser(id: string): Promise<IApiResponse<IApiEnvelope<null>>> {
    return api.delete<null>(buildAdminUserPath(id));
  }

  async getRoles(): Promise<
    IApiResponse<IApiEnvelope<{ roles: IJsonApiResource<IAdminRole>[] }>>
  > {
    return api.get<{ roles: IJsonApiResource<IAdminRole>[] }>(
      AppRoutes.server.protected.ADMIN_USER_ROLES,
    );
  }
}

export default new UserService();
