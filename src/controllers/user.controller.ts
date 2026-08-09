import { UserService } from "../services";
import { IApiEnvelope, IApiPagination, IApiResponse, IUser } from "../models";
import { parseFromList } from "../services/api.service";

class UserController {
  async getUsers(
    params?: { page?: number; limit?: number },
    onSuccess?: (users: IUser[], pagination?: IApiPagination) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
    try {
      const response = await UserService.getUsers(params);
      const { status, data, meta } = response.data || {};

      if (!status?.success || !data) {
        onError?.(status?.error || "Failed to load users");
        return;
      }

      const users = parseFromList<IUser>(data);

      onSuccess?.(users, meta?.pagination);
    } catch (error) {
      console.error("Error fetching users:", error);
      onError?.("An error occurred while loading users.");
    }
  }

  async peekUser(
    email: string,
    setError: (message: string) => void,
  ): Promise<
    "exists_confirmed" | "exists_unconfirmed" | "not_exists" | undefined
  > {
    const response = await UserService.peekUser(email);
    const data = response.data?.data;

    if (!data) {
      console.error("Error peeking user:", response.error);
      setError("Failed to peek user");
      return undefined;
    }

    if (!data.user_exists) {
      return "not_exists";
    }

    return data.confirmed ? "exists_confirmed" : "exists_unconfirmed";
  }

  async getCurrentUser(
    setCurrentUser: (user: IUser | null) => void,
  ): Promise<void> {
    try {
      const response = await UserService.getCurrentUser();
      const user = response.data?.data?.user;
      setCurrentUser(user || null);
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  }

  async uploadImage(file: File): Promise<void> {
    try {
      const response: IApiResponse<IApiEnvelope<{ url: string }>> =
        await UserService.uploadImage(file);
      console.log("Image uploaded:", response.data?.data.url);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  }
}

export default new UserController();
