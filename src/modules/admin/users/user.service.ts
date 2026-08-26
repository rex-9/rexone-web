import AppRoutes from "../../../AppRoutes";
import { IApiEnvelope, IApiResponse, IJsonApiResource } from "../../../models";
import { api } from "../../../services";
import {
  IAdminUser,
  IAdminUserFormValues,
  IAdminUserListParams,
} from "./types";
import { IAdminRole } from "../roles";

export type AdminUserResponse =
  | IJsonApiResource<IAdminUser>
  | { user: IAdminUser };

class UserService {
  async getUsers(
    params?: IAdminUserListParams,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IAdminUser>[]>>> {
    return api.get<IJsonApiResource<IAdminUser>[]>(
      AppRoutes.server.protected.admin.USERS,
      params ? { page: params.page, limit: params.limit } : undefined,
    );
  }

  async getUser(
    id: string,
  ): Promise<IApiResponse<IApiEnvelope<AdminUserResponse>>> {
    return api.get<AdminUserResponse>(
      AppRoutes.withId(AppRoutes.server.protected.admin.USER_DETAIL, id),
    );
  }

  async getDiscardedUsers(
    params?: IAdminUserListParams,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IAdminUser>[]>>> {
    return api.get<IJsonApiResource<IAdminUser>[]>(
      AppRoutes.server.protected.admin.DISCARDED_USERS,
      params ? { page: params.page, limit: params.limit } : undefined,
    );
  }

  async createUser(
    values: IAdminUserFormValues,
  ): Promise<IApiResponse<IApiEnvelope<AdminUserResponse>>> {
    return api.post<AdminUserResponse>(AppRoutes.server.protected.admin.USERS, {
      user: values,
    });
  }

  async updateUser(
    id: string,
    values: IAdminUserFormValues,
  ): Promise<IApiResponse<IApiEnvelope<AdminUserResponse>>> {
    return api.put<AdminUserResponse>(
      AppRoutes.withId(AppRoutes.server.protected.admin.USER_DETAIL, id),
      {
      user: values,
      },
    );
  }

  async deleteUser(id: string): Promise<IApiResponse<IApiEnvelope<null>>> {
    return api.delete<null>(
      AppRoutes.withId(AppRoutes.server.protected.admin.USER_DETAIL, id),
    );
  }

  async discardUser(
    id: string,
  ): Promise<IApiResponse<IApiEnvelope<AdminUserResponse>>> {
    return api.post<AdminUserResponse>(
      AppRoutes.withId(AppRoutes.server.protected.admin.USER_DISCARD, id),
    );
  }

  async restoreUser(
    id: string,
  ): Promise<IApiResponse<IApiEnvelope<AdminUserResponse>>> {
    return api.post<AdminUserResponse>(
      AppRoutes.withId(AppRoutes.server.protected.admin.USER_UNDISCARD, id),
    );
  }

  async getRoles(): Promise<
    IApiResponse<IApiEnvelope<IJsonApiResource<IAdminRole>[]>>
  > {
    return api.get<IJsonApiResource<IAdminRole>[]>(
      AppRoutes.server.protected.admin.USER_ROLES,
    );
  }
}

export default new UserService();
