import AppRoutes from "../AppRoutes";
import { IApiAuthResponse, IApiResponse, IUser } from "../models";
import { api } from "../services";

export type MailTemplate = "email_verification" | "password_reset";

export interface MailRecipient {
  user_id?: string;
  email?: string;
}

class UserService {
  async peekUser(
    email: string,
  ): Promise<IApiResponse<IApiAuthResponse<{ user_exists: boolean }>>> {
    const response = await api.get<IApiAuthResponse<{ user_exists: boolean }>>(
      AppRoutes.server.protected.PEEK_USER,
      { email },
    );
    return response;
  }

  async getCurrentUser(): Promise<
    IApiResponse<IApiAuthResponse<{ user: IUser; token: string }>>
  > {
    const response = await api.get<
      IApiAuthResponse<{ user: IUser; token: string }>
    >(AppRoutes.server.protected.GET_CURRENT_USER);
    return response;
  }

  async uploadImage(file: File): Promise<IApiResponse<{ url: string }>> {
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

  async deliverMail(
    type: MailTemplate,
    recipient: MailRecipient = {},
  ): Promise<IApiResponse<IApiAuthResponse<null>>> {
    return api.post<IApiAuthResponse<null>>(
      AppRoutes.server.protected.DELIVER_MAIL,
      {
        mail: {
          type,
          ...recipient,
        },
      },
    );
  }
}

export default new UserService();
