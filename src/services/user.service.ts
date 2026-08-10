import AppRoutes from "../AppRoutes";
import {
  IAdminUser,
  IAdminUserFormValues,
  IAdminUserListParams,
  IAdminPermission,
  IAdminRole,
  IApiEnvelope,
  IApiResponse,
  IJsonApiResource,
  IUser,
} from "../models";
import { api } from "../services";

const buildAdminUserPath = (id: string): string =>
  AppRoutes.server.protected.ADMIN_USER_DETAIL.replace(":id", id);

export type AdminUserResponse =
  | IJsonApiResource<IAdminUser>
  | { user: IAdminUser };

class UserService {
  async getUsers(params?: { page?: number; limit?: number }) {
    return api.get<IJsonApiResource<IUser>[]>(
      AppRoutes.server.protected.USERS,
      params,
    );
  }

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
    return api.post<AdminUserResponse>(
      AppRoutes.server.protected.ADMIN_USERS,
      { user: values },
    );
  }

  async updateAdminUser(
    id: string,
    values: IAdminUserFormValues,
  ): Promise<IApiResponse<IApiEnvelope<AdminUserResponse>>> {
    return api.patch<AdminUserResponse>(buildAdminUserPath(id), {
      user: values,
    });
  }

  async replaceAdminUser(
    id: string,
    values: IAdminUserFormValues,
  ): Promise<IApiResponse<IApiEnvelope<AdminUserResponse>>> {
    return api.put<AdminUserResponse>(buildAdminUserPath(id), {
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
    return api.get<{ roles: IJsonApiResource<IAdminRole>[] }>("/iam/roles");
  }

  async getAdminPermissions(): Promise<
    IApiResponse<
      IApiEnvelope<{ permissions: IJsonApiResource<IAdminPermission>[] }>
    >
  > {
    return api.get<{ permissions: IJsonApiResource<IAdminPermission>[] }>(
      "/iam/permissions",
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
    const response = await api.get<{
      user_exists: boolean;
      confirmed: boolean;
    }>(AppRoutes.server.protected.PEEK_USER, { email });
    return response;
  }

  async getCurrentUser(): Promise<
    IApiResponse<IApiEnvelope<{ user: IUser; token: string }>>
  > {
    const response = await api.get<{ user: IUser; token: string }>(
      AppRoutes.server.protected.CURRENT_USER,
    );
    return response;
  }

  async uploadImage(
    file: File,
  ): Promise<IApiResponse<IApiEnvelope<{ url: string }>>> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<{ url: string }>(
      AppRoutes.server.protected.UPLOAD_ASSET,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response;
  }
}

export default new UserService();
