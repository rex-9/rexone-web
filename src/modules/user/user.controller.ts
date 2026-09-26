import UserService from "./user.service";
import { USER_PEEK_STATUS, type TUserPeekStatus } from "./constants";
import {
  IUser,
  IAsset,
  IAssetUploadResponse,
  IAssetUploadOptions,
} from "../../models";
import { AppLocales, translate } from "../../locales";
import { getApiError, parseRecord } from "../../services/api.service";
import type { ICurrentUserUpdateValues } from "./types";

class UserController {
  async peekUser(email: string): Promise<TUserPeekStatus> {
    const response = await UserService.peekUser(email);
    const { status } = response.data || {};
    if (
      status?.code === 403 &&
      response.data?.status?.error ===
        translate(AppLocales.Auth.Initial.AccountDiscarded)
    ) {
      return USER_PEEK_STATUS.DISCARDED;
    }

    if (response.error || !response.data?.data) {
      console.error("Error peeking user:", response.error);
      throw new Error(translate(response.error || AppLocales.Auth.Initial.UserCheckFailed));
    }

    const { user_exists, confirmed } = response.data.data;

    if (!user_exists) {
      return USER_PEEK_STATUS.NOT_EXISTS;
    }

    return confirmed
      ? USER_PEEK_STATUS.EXISTS_CONFIRMED
      : USER_PEEK_STATUS.EXISTS_UNCONFIRMED;
  }

  async getCurrentUser(): Promise<IUser | null> {
    const response = await UserService.getCurrentUser();
    const data = response.data?.data;
    if (!data) return null;
    return parseRecord<IUser>(data);
  }

  async updateCurrentUser(values: ICurrentUserUpdateValues): Promise<{
    success: boolean;
    user?: IUser;
    message?: string;
    error?: string;
  }> {
    const response = await UserService.updateCurrentUser(values);
    const { status, data } = response.data || {};

    if (status?.success && data) {
      return {
        success: true,
        user: parseRecord<IUser>(data),
        message: status.message,
      };
    }

    return {
      success: false,
      error: getApiError(
        response,
        translate(AppLocales.User.Errors.Update),
      ),
    };
  }

  async uploadImage(
    file: File,
    options?: IAssetUploadOptions,
  ): Promise<IAssetUploadResponse | null> {
    const response = await UserService.uploadImage(file, options);
    const { status, data, meta } = response.data || {};
    if (!status?.success || !data) return null;
    return {
      asset: parseRecord<IAsset>(data),
      storage_details: meta?.storage_details || {
        storage_key: "",
        bytes: 0,
        format: "",
      },
    };
  }
}

export default new UserController();
