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
            "Failed to load admin users",
        );
        return;
      }

      const users = parseFromList<IAdminUser>(data);

      onSuccess?.(users, meta?.pagination);
    } catch (error) {
      console.error("Error fetching admin users:", error);
      onError?.("An error occurred while loading admin users.");
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
            "Failed to load admin user",
        );
        return;
      }

      onSuccess?.(parseAdminUser(data));
    } catch (error) {
      console.error("Error fetching admin user:", error);
      onError?.("An error occurred while loading the user.");
    }
  }

  async createUser(
    values: IAdminUserFormValues,
    onSuccess?: (user: IAdminUser) => void,
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
            "Failed to create user",
        );
        return;
      }

      onSuccess?.(parseAdminUser(data));
    } catch (error) {
      console.error("Error creating admin user:", error);
      onError?.("An error occurred while creating the user.");
    }
  }

  async updateUser(
    id: string,
    values: IAdminUserFormValues,
    onSuccess?: (user: IAdminUser) => void,
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
            "Failed to update user",
        );
        return;
      }

      onSuccess?.(parseAdminUser(data));
    } catch (error) {
      console.error("Error updating admin user:", error);
      onError?.("An error occurred while updating the user.");
    }
  }

  async deleteUser(
    id: string,
    onSuccess?: () => void,
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
            "Failed to delete user",
        );
        return;
      }

      onSuccess?.();
    } catch (error) {
      console.error("Error deleting admin user:", error);
      onError?.("An error occurred while deleting the user.");
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
            "Failed to load roles",
        );
        return;
      }

      onSuccess?.(parseFromList<IAdminRole>(data.roles));
    } catch (error) {
      console.error("Error fetching admin roles:", error);
      onError?.("An error occurred while loading roles.");
    }
  }
}

export default new UserController();
