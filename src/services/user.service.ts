import AppRoutes from "../AppRoutes";
import {
  IApiEnvelope,
  IApiResponse,
  IJsonApiResource,
  IUser,
  IAssetUploadResponse,
  IAssetUploadOptions,
} from "../models";
import { api } from "./api.service";

class UserService {
  async getUsers(params?: { search?: string; limit?: number; page?: number }): Promise<
    IApiResponse<IApiEnvelope<IJsonApiResource<IUser>[]>>
  > {
    return api.get<IJsonApiResource<IUser>[]>(
      AppRoutes.server.protected.USERS,
      params,
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
    options?: IAssetUploadOptions,
  ): Promise<IApiResponse<IApiEnvelope<IAssetUploadResponse>>> {
    const formData = new FormData();
    formData.append("file", file);
    if (options?.type) formData.append("type", options.type);
    if (options?.resource_model)
      formData.append("resource_model", options.resource_model);
    if (options?.resource_id)
      formData.append("resource_id", options.resource_id);
    if (options?.duration_secs !== undefined)
      formData.append("duration_secs", String(options.duration_secs));
    if (options?.folder) formData.append("folder", options.folder);

    return api.post<IAssetUploadResponse>(
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
