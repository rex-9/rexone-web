import { UserService } from "../services";
import { IApiEnvelope, IApiResponse, IUser } from "../models";
import { AppLocales, translate } from "../locales";

class UserController {
  async peekUser(
    email: string,
  ): Promise<
    "exists_confirmed" | "exists_unconfirmed" | "not_exists" | "discarded"
  > {
    const response = await UserService.peekUser(email);

    if (response.error || !response.data?.data) {
      console.error("Error peeking user:", response.error);

      throw new Error(translate(AppLocales.User.Errors.CheckFailed));
    }

    const { user_exists, confirmed, discarded } = response.data.data;

    if (!user_exists) {
      return "not_exists";
    }

    if (discarded) {
      return "discarded";
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
