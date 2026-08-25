import { AppLocales } from "../../../locales";
import { IApiPagination } from "../../../models";
import { parsePaginatedResponse, parseRecord } from "../../../services/api.service";
import UserService from "./user.service";
import {
  IAdminUser,
  IAdminUserFormValues,
} from "./";
import { IAdminRole } from "../roles";

class UserController {
  async getUsers(
    params?: { page?: number; limit?: number },
    onSuccess?: (users: IAdminUser[], pagination?: IApiPagination) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
      const response = await UserService.getUsers(params);
      const { status, data } = response.data || {};

      if (!status?.success || !data) {
        onError?.(
            status?.error ||
            status?.message ||
            response.error ||
            AppLocales.Admin.Users.Errors.LoadListFailed,
        );
        return;
      }

      const { records, pagination } = parsePaginatedResponse(response);
      onSuccess?.(records, pagination ?? undefined);
  }

  async getUser(
    id: string,
    onSuccess?: (user: IAdminUser) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
      const response = await UserService.getUser(id);
      const { status, data } = response.data || {};

      if (!status?.success || !data) {
        onError?.(
            status?.error ||
            status?.message ||
            response.error ||
            AppLocales.Admin.Users.Errors.LoadOneFailed,
        );
        return;
      }

      onSuccess?.(parseRecord("attributes" in data ? data : data.user));
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
        status?.error ||
          status?.message ||
          response.error ||
          AppLocales.Admin.Users.Errors.LoadListFailed,
      );
      return;
    }

    const { records, pagination } = parsePaginatedResponse(response);
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
            status?.error ||
            status?.message ||
            response.error ||
            AppLocales.Admin.Users.Errors.CreateFailed,
        );
        return;
      }

      onSuccess?.(
        parseRecord("attributes" in data ? data : data.user),
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
            status?.error ||
            status?.message ||
            response.error ||
            AppLocales.Admin.Users.Errors.UpdateFailed,
        );
        return;
      }

      onSuccess?.(
        parseRecord("attributes" in data ? data : data.user),
        status.message,
      );
  }

  async deleteUser(
    id: string,
    onSuccess?: (message: string) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
      const response = await UserService.deleteUser(id);
      const { status } = response.data || {};

      if (!status?.success) {
        onError?.(
            status?.error ||
            status?.message ||
            response.error ||
            AppLocales.Admin.Users.Errors.DeleteFailed,
        );
        return;
      }

      onSuccess?.(status.message);
  }

  async discardUser(
    id: string,
    onSuccess?: (message: string) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
    const response = await UserService.discardUser(id);
    const { status, data } = response.data || {};

    if (!status?.success || !data) {
      onError?.(status?.error || status?.message || response.error || AppLocales.Admin.Users.Errors.DeleteFailed);
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
      onError?.(status?.error || status?.message || response.error || AppLocales.Admin.Users.Errors.UpdateFailed);
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

      if (!status?.success || !data?.roles) {
        onError?.(
            status?.error ||
            status?.message ||
            response.error ||
            AppLocales.Admin.Users.Errors.LoadRolesFailed,
        );
        return;
      }

      onSuccess?.(data.roles.map(parseRecord));
  }
}

export default new UserController();
