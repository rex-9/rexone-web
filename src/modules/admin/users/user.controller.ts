import { AppLocales, translate } from "../../../locales";
import { IApiPagination } from "../../../models";
import { parseFromList } from "../../../services/api.service";
import UserService from "./user.service";
import {
  AdminUserResponse,
  IAdminUser,
  IAdminUserFormValues,
} from "./";
import { IAdminRole } from "../roles";

const parseAdminUser = (data: AdminUserResponse): IAdminUser => {
  if ("attributes" in data) {
    return { ...data.attributes, id: data.id };
  }

  return data.user;
};

const userErrorMessage = (key: string): string => translate(key);

class UserController {
  async getUsers(
    params?: { page?: number; limit?: number },
    onSuccess?: (users: IAdminUser[], pagination?: IApiPagination) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
    try {
      const response = await UserService.getUsers(params);
      const { status, data, meta } = response.data || {};

      if (!status?.success || !data) {
        onError?.(
            status?.error ||
            status?.message ||
            response.error ||
            userErrorMessage(AppLocales.Admin.Users.Errors.LoadListFailed),
        );
        return;
      }

      const users = parseFromList<IAdminUser>(data);

      onSuccess?.(users, meta?.pagination);
    } catch (error) {
      console.error("Error fetching admin users:", error);
      onError?.(userErrorMessage(AppLocales.Admin.Users.Errors.LoadListUnexpected));
    }
  }

  async getUser(
    id: string,
    onSuccess?: (user: IAdminUser) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
    try {
      const response = await UserService.getUser(id);
      const { status, data } = response.data || {};

      if (!status?.success || !data) {
        onError?.(
            status?.error ||
            status?.message ||
            response.error ||
            userErrorMessage(AppLocales.Admin.Users.Errors.LoadOneFailed),
        );
        return;
      }

      onSuccess?.(parseAdminUser(data));
    } catch (error) {
      console.error("Error fetching admin user:", error);
      onError?.(userErrorMessage(AppLocales.Admin.Users.Errors.LoadOneUnexpected));
    }
  }

  async createUser(
    values: IAdminUserFormValues,
    onSuccess?: (user: IAdminUser, message: string) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
    try {
      const response = await UserService.createUser(values);
      const { status, data } = response.data || {};

      if (!status?.success || !data) {
        onError?.(
            status?.error ||
            status?.message ||
            response.error ||
            userErrorMessage(AppLocales.Admin.Users.Errors.CreateFailed),
        );
        return;
      }

      onSuccess?.(parseAdminUser(data), status.message);
    } catch (error) {
      console.error("Error creating admin user:", error);
      onError?.(userErrorMessage(AppLocales.Admin.Users.Errors.CreateUnexpected));
    }
  }

  async updateUser(
    id: string,
    values: IAdminUserFormValues,
    onSuccess?: (user: IAdminUser, message: string) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
    try {
      const response = await UserService.updateUser(id, values);
      const { status, data } = response.data || {};

      if (!status?.success || !data) {
        onError?.(
            status?.error ||
            status?.message ||
            response.error ||
            userErrorMessage(AppLocales.Admin.Users.Errors.UpdateFailed),
        );
        return;
      }

      onSuccess?.(parseAdminUser(data), status.message);
    } catch (error) {
      console.error("Error updating admin user:", error);
      onError?.(userErrorMessage(AppLocales.Admin.Users.Errors.UpdateUnexpected));
    }
  }

  async deleteUser(
    id: string,
    onSuccess?: (message: string) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
    try {
      const response = await UserService.deleteUser(id);
      const { status } = response.data || {};

      if (!status?.success) {
        onError?.(
            status?.error ||
            status?.message ||
            response.error ||
            userErrorMessage(AppLocales.Admin.Users.Errors.DeleteFailed),
        );
        return;
      }

      onSuccess?.(status.message);
    } catch (error) {
      console.error("Error deleting admin user:", error);
      onError?.(userErrorMessage(AppLocales.Admin.Users.Errors.DeleteUnexpected));
    }
  }

  async getRoles(
    onSuccess?: (roles: IAdminRole[]) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
    try {
      const response = await UserService.getRoles();
      const { status, data } = response.data || {};

      if (!status?.success || !data?.roles) {
        onError?.(
            status?.error ||
            status?.message ||
            response.error ||
            userErrorMessage(AppLocales.Admin.Users.Errors.LoadRolesFailed),
        );
        return;
      }

      onSuccess?.(parseFromList<IAdminRole>(data.roles));
    } catch (error) {
      console.error("Error fetching admin roles:", error);
      onError?.(userErrorMessage(AppLocales.Admin.Users.Errors.LoadRolesUnexpected));
    }
  }
}

export default new UserController();
