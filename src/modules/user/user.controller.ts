import { UserService } from "../../services";
import {
  IApiEnvelope,
  IApiResponse,
  IUser,
  IAssetUploadResponse,
  IAssetUploadOptions,
} from "../../models";

class UserController {
  async peekUser(
    email: string,
  ): Promise<"exists_confirmed" | "exists_unconfirmed" | "not_exists"> {
    const response = await UserService.peekUser(email);

    if (response.error || !response.data?.data) {
      console.error("Error peeking user:", response.error);

      throw new Error("Failed to check user.");
    }

    const { user_exists, confirmed } = response.data.data;

    if (!user_exists) {
      return "not_exists";
    }

    return confirmed ? "exists_confirmed" : "exists_unconfirmed";
  }

  async getCurrentUser(): Promise<IUser | null> {
    const response = await UserService.getCurrentUser();
    return response.data?.data?.user || null;
  }

  async uploadImage(
    file: File,
    options?: IAssetUploadOptions,
  ): Promise<IAssetUploadResponse | null> {
    const response: IApiResponse<IApiEnvelope<IAssetUploadResponse>> =
      await UserService.uploadImage(file, options);
    return response.data?.data || null;
  }
}

export default new UserController();
