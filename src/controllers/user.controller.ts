import { UserService } from "../services";
import {
  IAdminUser,
  IAdminUserFormValues,
  IAdminPermission,
  IAdminRole,
  IApiEnvelope,
  IApiPagination,
  IApiResponse,
  IUser,
} from "../models";
import { parseFromList } from "../services/api.service";
import { AdminUserResponse } from "../services/user.service";

const parseAdminUser = (data: AdminUserResponse): IAdminUser => {
  if ("attributes" in data) {
    return { ...data.attributes, id: data.id };
  }

  return data.user;
};

class UserController {
  async getUsers(
    params?: { page?: number; limit?: number },
    onSuccess?: (users: IUser[], pagination?: IApiPagination) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
    try {
      const response = await UserService.getUsers(params);
      const { status, data, meta } = response.data || {};

      if (!status?.success || !data) {
        onError?.(status?.error || "Failed to load users");
        return;
      }

      const users = parseFromList<IUser>(data);

      onSuccess?.(users, meta?.pagination);
    } catch (error) {
      console.error("Error fetching users:", error);
      onError?.("An error occurred while loading users.");
    }
  }

  async getAdminUsers(
    params: { page?: number; limit?: number },
    onSuccess?: (users: IAdminUser[], pagination?: IApiPagination) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
    try {
      const response = await UserService.getAdminUsers(params);
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

      onSuccess?.(parseFromList<IAdminUser>(data), meta?.pagination);
    } catch (error) {
      console.error("Error fetching admin users:", error);
      onError?.("An error occurred while loading admin users.");
    }
  }

  async getAdminUser(
    id: string,
    onSuccess?: (user: IAdminUser) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
    try {
      const response = await UserService.getAdminUser(id);
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

  async createAdminUser(
    values: IAdminUserFormValues,
    onSuccess?: (user: IAdminUser) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
    try {
      const response = await UserService.createAdminUser(values);
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

  async updateAdminUser(
    id: string,
    values: IAdminUserFormValues,
    onSuccess?: (user: IAdminUser) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
    try {
      const response = await UserService.updateAdminUser(id, values);
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

  async deleteAdminUser(
    id: string,
    onSuccess?: () => void,
    onError?: (error: string) => void,
  ): Promise<void> {
    try {
      const response = await UserService.deleteAdminUser(id);
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

  async getAdminRoles(
    onSuccess?: (roles: IAdminRole[]) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
    try {
      const response = await UserService.getAdminRoles();
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

  async getAdminPermissions(
    onSuccess?: (permissions: IAdminPermission[]) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
    try {
      const response = await UserService.getAdminPermissions();
      const { status, data } = response.data || {};

      if (!status?.success || !data?.permissions) {
        onError?.(
          status?.error ||
            status?.message ||
            response.error ||
            "Failed to load permissions",
        );
        return;
      }

      onSuccess?.(parseFromList<IAdminPermission>(data.permissions));
    } catch (error) {
      console.error("Error fetching admin permissions:", error);
      onError?.("An error occurred while loading permissions.");
    }
  }

  async peekUser(
    email: string,
    setError: (message: string) => void,
  ): Promise<
    "exists_confirmed" | "exists_unconfirmed" | "not_exists" | undefined
  > {
    const response = await UserService.peekUser(email);
    const data = response.data?.data;

    if (!data) {
      console.error("Error peeking user:", response.error);
      setError("Failed to peek user");
      return undefined;
    }

    if (!data.user_exists) {
      return "not_exists";
    }

    return data.confirmed ? "exists_confirmed" : "exists_unconfirmed";
  }

  async getCurrentUser(
    setCurrentUser: (user: IUser | null) => void,
  ): Promise<void> {
    try {
      const response = await UserService.getCurrentUser();
      const user = response.data?.data?.user;
      setCurrentUser(user || null);
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
