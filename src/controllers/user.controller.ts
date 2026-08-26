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
    const { status } = response.data || {};

    if (
      status?.code === 403 &&
      response.data?.status?.error ===
        translate(AppLocales.Auth.Initial.AccountDiscarded)
    ) {
      return "discarded";
    }

    if (response.error || !response.data?.data) {
      console.error("Error peeking user:", response.error);

      throw new Error(translate(AppLocales.User.Errors.CheckFailed));
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
    const response = await UserService.getCurrentUser();
    const user = response.data?.data?.user;

    if (response.error || !user) {
      return;
    }
    //setting current user in the state
    setCurrentUser(user);
  }

  async uploadImage(file: File): Promise<void> {
    const response: IApiResponse<IApiEnvelope<{ url: string }>> =
      await UserService.uploadImage(file);

    if (response.error) {
      console.error("Error uploading image:", response.error);
      return;
    }

  }
}

export default new UserController();
