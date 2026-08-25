import AppRoutes from "../AppRoutes";
import { IApiEnvelope, IApiResponse, IUser } from "../models";
import { api } from "./api.service";

class UserService {
  async peekUser(email: string): Promise<
    IApiResponse<
      IApiEnvelope<{
        user_exists: boolean;
        confirmed: boolean;
        discarded: boolean;
      }>
    >
  > {
    return api.get<{
      user_exists: boolean;
      confirmed: boolean;
      discarded: boolean;
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
