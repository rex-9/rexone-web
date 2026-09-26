import AppRoutes from "../../../AppRoutes";
import { IApiEnvelope, IApiResponse, IJsonApiResource } from "../../../models";
import { api } from "../../../services";
import {
  IAdminUser,
  IAdminUserFormValues,
  IAdminUserListParams,
} from "./types";
import { IAdminRole } from "../role";

class UserService {
  async getUsers(
    params?: IAdminUserListParams,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IAdminUser>[]>>> {
    return api.get<IJsonApiResource<IAdminUser>[]>(
      AppRoutes.server.protected.admin.USERS,
      params
        ? {
            page: params.page,
            limit: params.limit,
            search: params.search,
            sort_by: params.sort_by,
            sort_order: params.sort_order,
          }
        : undefined,
    );
  }

  async getUser(
    id: string,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IAdminUser>>>> {
    return api.get<IJsonApiResource<IAdminUser>>(
      AppRoutes.withId(AppRoutes.server.protected.admin.USER_DETAIL, id),
    );
  }

  async getDiscardedUsers(
    params?: IAdminUserListParams,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IAdminUser>[]>>> {
    return api.get<IJsonApiResource<IAdminUser>[]>(
      AppRoutes.server.protected.admin.USERS,
      {
        page: params?.page,
        limit: params?.limit,
        search: params?.search,
        sort_by: params?.sort_by,
        sort_order: params?.sort_order,
        discarded: "true",
      },
    );
  }

  async createUser(
    values: Omit<IAdminUserFormValues, "role_ids">,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IAdminUser>>>> {
    return api.post<IJsonApiResource<IAdminUser>>(AppRoutes.server.protected.admin.USERS, {
      user: values,
    });
  }

  async updateUser(
    id: string,
    values: Omit<IAdminUserFormValues, "role_ids">,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IAdminUser>>>> {
    return api.put<IJsonApiResource<IAdminUser>>(
      AppRoutes.withId(AppRoutes.server.protected.admin.USER_DETAIL, id),
      {
        user: values,
      },
    );
  }

  async discardUser(
    id: string,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IAdminUser>>>> {
    return api.post<IJsonApiResource<IAdminUser>>(
      AppRoutes.withId(AppRoutes.server.protected.admin.USER_DISCARD, id),
    );
  }

  async undiscardUser(
    id: string,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IAdminUser>>>> {
    return api.post<IJsonApiResource<IAdminUser>>(
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

  async assignRole(
    userId: string,
    roleId: string,
  ): Promise<IApiResponse<IApiEnvelope<unknown>>> {
    const path = AppRoutes.server.protected.IAM_USER_ROLES.replace(
      ":user_id",
      userId,
    );
    return api.post(path, { role_id: roleId });
  }

  async removeRole(
    userId: string,
    roleId: string,
  ): Promise<IApiResponse<IApiEnvelope<unknown>>> {
    const path = AppRoutes.server.protected.IAM_USER_ROLE.replace(
      ":user_id",
      userId,
    ).replace(":role_id", roleId);
    return api.delete(path);
  }
}

export default new UserService();
