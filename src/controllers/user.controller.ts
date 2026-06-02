import { userService } from "../services";
import { IApiResponse, IUser } from "../models";

class UserController {
  async peekUser(
    email: string,
    setError: (message: string) => void,
  ): Promise<boolean | undefined> {
    const response = await userService.peekUser(email);
    const userExists = response.data?.data?.user_exists;
    if (userExists == undefined) {
      console.error("Error peeking user:");
      setError("Failed to peek user");
    }
    return userExists;
  }

  async getCurrentUser(
    setCurrentUser: (user: IUser | null) => void,
  ): Promise<void> {
    try {
      const response = await userService.getCurrentUser();
      const user = response.data?.data?.user;
      setCurrentUser(user || null);
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  }

  async uploadImage(file: File): Promise<void> {
    try {
      const response: IApiResponse<{ url: string }> =
        await userService.uploadImage(file);
      console.log("Image uploaded:", response.data?.url);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  }
}

export default new UserController();
