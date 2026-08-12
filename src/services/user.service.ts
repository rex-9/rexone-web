import AppRoutes from "../AppRoutes";
import {
  IAdminRole,
  IAdminUser,
  IAdminUserFormValues,
  IAdminUserListParams,
  IApiEnvelope,
  IApiResponse,
  IJsonApiResource,
  IUser,
} from "../models";
import { api } from "./api.service";

const buildAdminUserPath = (id: string): string =>
  AppRoutes.server.protected.ADMIN_USER_DETAIL.replace(":id", id);

export type AdminUserResponse =
  | IJsonApiResource<IAdminUser>
  | { user: IAdminUser };

class UserService {
  async getAdminUsers(
    params?: IAdminUserListParams,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IAdminUser>[]>>> {
    return api.get<IJsonApiResource<IAdminUser>[]>(
      AppRoutes.server.protected.ADMIN_USERS,
      params ? { page: params.page, limit: params.limit } : undefined,
    );
  }

  async getAdminUser(
    id: string,
  ): Promise<IApiResponse<IApiEnvelope<AdminUserResponse>>> {
    return api.get<AdminUserResponse>(buildAdminUserPath(id));
  }

  async createAdminUser(
    values: IAdminUserFormValues,
  ): Promise<IApiResponse<IApiEnvelope<AdminUserResponse>>> {
    return api.post<AdminUserResponse>(AppRoutes.server.protected.ADMIN_USERS, {
      user: values,
    });
  }

  async updateAdminUser(
    id: string,
    values: IAdminUserFormValues,
  ): Promise<IApiResponse<IApiEnvelope<AdminUserResponse>>> {
    return api.patch<AdminUserResponse>(buildAdminUserPath(id), {
      user: values,
    });
  }

  async deleteAdminUser(
    id: string,
  ): Promise<IApiResponse<IApiEnvelope<null>>> {
    return api.delete<null>(buildAdminUserPath(id));
  }

  async getAdminRoles(): Promise<
    IApiResponse<IApiEnvelope<{ roles: IJsonApiResource<IAdminRole>[] }>>
  > {
    return api.get<{ roles: IJsonApiResource<IAdminRole>[] }>(
      AppRoutes.server.protected.IAM_ROLES,
    );
  }

  async peekUser(email: string): Promise<
    IApiResponse<
      IApiEnvelope<{
        user_exists: boolean;
        confirmed: boolean;
      }>
    >
  > {
    return api.get<{
      user_exists: boolean;
      confirmed: boolean;
    }>(AppRoutes.server.public.PEEK_USER, { email });
  }

  async getCurrentUser(): Promise<
    IApiResponse<IApiEnvelope<{ user: IUser; token: string }>>
  > {
    return api.get<{ user: IUser; token: string }>(
      AppRoutes.server.protected.CURRENT_USER,
    );
  }

  async uploadImage(
    file: File,
  ): Promise<IApiResponse<IApiEnvelope<{ url: string }>>> {
    const formData = new FormData();
    formData.append("file", file);

    return api.post<{ url: string }>(
      AppRoutes.server.protected.UPLOAD_ASSET,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
  }
}

export default new UserService();
