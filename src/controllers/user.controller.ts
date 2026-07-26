import { UserService } from "../services";
import { IApiResponse, IUser } from "../models";

class UserController {
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
      const response: IApiResponse<{ url: string }> =
        await UserService.uploadImage(file);
      console.log("Image uploaded:", response.data?.url);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  }
}

export default new UserController();
