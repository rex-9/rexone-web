import { UserService } from "../services";
import {
  IApiEnvelope,
  IApiPagination,
  IApiResponse,
  IUser,
  IAssetUploadResponse,
  IAssetUploadOptions,
} from "../models";
import { AppLocales, translate } from "../locales";
import { getApiError, parsePagyList } from "../services/api.service";

export type UserSearchResult = IUser & { id: string };

class UserController {
  async getUsers(
    params?: { search?: string; limit?: number; page?: number },
    onSuccess?: (users: UserSearchResult[], pagination?: IApiPagination) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
    const response = await UserService.getUsers(params);
    const { status, data } = response.data || {};

    if (!status?.success || !data) {
      onError?.(
        getApiError(
          response,
          translate(AppLocales.Admin.Users.Errors.LoadListFailed),
        ),
      );
      return;
    }

    const { records, pagination } = parsePagyList<IUser>(response);
    onSuccess?.(
      records.filter((user): user is UserSearchResult => Boolean(user.id)),
      pagination ?? undefined,
    );
  }

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
      throw new Error(translate(response.error || AppLocales.Auth.Initial.UserCheckFailed));
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
