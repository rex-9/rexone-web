import AppRoutes from "../AppRoutes";
import { IApiEnvelope, IApiResponse, IJsonApiResource, IUser } from "../models";
import { api } from "../services";

class UserService {
  async getUsers(params?: { page?: number; limit?: number }) {
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
    return await api.get<{ user: IUser; token: string }>(
      AppRoutes.server.protected.CURRENT_USER,
    );
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
