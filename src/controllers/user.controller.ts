import { UserService } from "../services";
import { IApiEnvelope, IApiResponse, IUser } from "../models";

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

  async getCurrentUser(
    setCurrentUser: (user: IUser | null) => void,
  ): Promise<void> {
    try {
      const response = await UserService.getCurrentUser();
      const user = response.data?.data?.user;

      if (response.error || !user) {
        return;
      }
      //setting current user in the state
      setCurrentUser(user);
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
