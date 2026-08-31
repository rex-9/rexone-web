import { AppLocales, translate } from "../../../locales";
import { IApiPagination } from "../../../models";
import {
  getApiError,
  parsePagyList,
  parseRecord,
} from "../../../services/api.service";
import UserService from "./user.service";
import {
  IAdminUser,
  IAdminUserFormValues,
  IAdminUserListParams,
} from "./";
import { IAdminRole } from "../roles";

class UserController {
  async getUsers(
    params?: IAdminUserListParams,
    onSuccess?: (users: IAdminUser[], pagination?: IApiPagination) => void,
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

      const { records, pagination } = parsePagyList(response);
      onSuccess?.(records, pagination ?? undefined);
  }

  // async getUsers(params?: { page?: number; limit?: number }): Promise<{
  //   success: boolean;
  //   users: IUser[];
  //   pagination?: IApiPagination | null;
  //   error?: string;
  // }> {
  //   const response = await Admin.UserService.getUsers(params);
  // const { records, pagination } = parsePagyList(response);
  //   const { status, data, meta } = response.data || {};

  //   if (status?.success && data) {
  //     const users = parseFromList<IUser>(data);
  //     return {
  //       success: true,
  //       users,
  //       pagination: meta?.pagination ?? null,
  //     };
  //   }

  //   return {
  //     success: false,
  //     users: [],
  //     pagination: null,
  //     error: getApiError(
          //   response,
          //   translate(AppLocales.Admin.Users.Errors.LoadListFailed),
          // ),
  //   };
  // }

  async getUser(
    id: string,
    onSuccess?: (user: IAdminUser) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
      const response = await UserService.getUser(id);
      const { status, data } = response.data || {};

      if (!status?.success || !data) {
        onError?.(
          getApiError(
            response,
            translate(AppLocales.Admin.Users.Errors.LoadOneFailed),
          ),
        );
        return;
      }

      onSuccess?.(parseRecord("user" in data ? data.user : data));
  }

  async getDiscardedUsers(
    params?: { page?: number; limit?: number },
    onSuccess?: (users: IAdminUser[], pagination?: IApiPagination) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
    const response = await UserService.getDiscardedUsers(params);
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

    const { records, pagination } = parsePagyList(response);
    onSuccess?.(records, pagination ?? undefined);
  }

  async createUser(
    values: IAdminUserFormValues,
    onSuccess?: (user: IAdminUser, message: string) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
      const response = await UserService.createUser(values);
      const { status, data } = response.data || {};

      if (!status?.success || !data) {
        onError?.(
          getApiError(
            response,
            translate(AppLocales.Admin.Users.Errors.CreateFailed),
          ),
        );
        return;
      }

      onSuccess?.(
        parseRecord("user" in data ? data.user : data),
        status.message,
      );
  }

  async updateUser(
    id: string,
    values: IAdminUserFormValues,
    onSuccess?: (user: IAdminUser, message: string) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
      const response = await UserService.updateUser(id, values);
      const { status, data } = response.data || {};

      if (!status?.success || !data) {
        onError?.(
          getApiError(
            response,
            translate(AppLocales.Admin.Users.Errors.UpdateFailed),
          ),
        );
        return;
      }

      onSuccess?.(
        parseRecord("user" in data ? data.user : data),
        status.message,
      );
  }

  async discardUser(
    id: string,
    onSuccess?: (message: string) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
    const response = await UserService.discardUser(id);
    const { status, data } = response.data || {};

    if (!status?.success || !data) {
      onError?.(
        getApiError(
          response,
          translate(AppLocales.Admin.Users.Errors.DeleteFailed),
        ),
      );
      return;
    }

    onSuccess?.(status.message);
  }

  async restoreUser(
    id: string,
    onSuccess?: (message: string) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
    const response = await UserService.restoreUser(id);
    const { status, data } = response.data || {};

    if (!status?.success || !data) {
      onError?.(
        getApiError(
          response,
          translate(AppLocales.Admin.Users.Errors.UpdateFailed),
        ),
      );
      return;
    }

    onSuccess?.(status.message);
  }

  async getRoles(
    onSuccess?: (roles: IAdminRole[]) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
      const response = await UserService.getRoles();
      const { status, data } = response.data || {};

      if (!status?.success || !data) {
        onError?.(
          getApiError(response, translate(AppLocales.Admin.Users.Errors.LoadRolesFailed)),
        );
        return;
      }

      const roles = Array.isArray(data) ? data : data.roles;
      onSuccess?.(roles.map(parseRecord));
  }
}

export default new UserController();
