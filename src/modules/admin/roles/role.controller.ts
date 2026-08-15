import { parseFromList } from "../../../services/api.service";
import RoleService from "./role.service";
import {
  IAdminPermission,
  IAdminRole,
  IAdminRoleFormValues,
} from "./types";

class RoleController {
  async getRoles(
    onSuccess?: (roles: IAdminRole[]) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
    try {
      const response = await RoleService.getRoles();
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

  async getRole(
    id: string,
    onSuccess?: (role: IAdminRole) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
    try {
      const response = await RoleService.getRole(id);
      const { status, data } = response.data || {};

      if (!status?.success || !data?.role) {
        onError?.(
          status?.error ||
            status?.message ||
            response.error ||
            "Failed to load role",
        );
        return;
      }

      onSuccess?.(data.role);
    } catch (error) {
      console.error("Error fetching admin role:", error);
      onError?.("An error occurred while loading the role.");
    }
  }

  async getPermissions(
    onSuccess?: (permissions: IAdminPermission[]) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
    try {
      const response = await RoleService.getPermissions();
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

  async createRole(
    values: IAdminRoleFormValues,
    onSuccess?: (role: IAdminRole) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
    try {
      const response = await RoleService.createRole(values);
      const { status, data } = response.data || {};

      if (!status?.success || !data?.role) {
        onError?.(
          status?.error ||
            status?.message ||
            response.error ||
            "Failed to create role",
        );
        return;
      }

      onSuccess?.(data.role);
    } catch (error) {
      console.error("Error creating admin role:", error);
      onError?.("An error occurred while creating the role.");
    }
  }

  async updateRole(
    id: string,
    values: IAdminRoleFormValues,
    onSuccess?: (role: IAdminRole) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
    try {
      const response = await RoleService.updateRole(id, values);
      const { status, data } = response.data || {};

      if (!status?.success || !data?.role) {
        onError?.(
          status?.error ||
            status?.message ||
            response.error ||
            "Failed to update role",
        );
        return;
      }

      onSuccess?.(data.role);
    } catch (error) {
      console.error("Error updating admin role:", error);
      onError?.("An error occurred while updating the role.");
    }
  }

  async deleteRole(
    id: string,
    onSuccess?: () => void,
    onError?: (error: string) => void,
  ): Promise<void> {
    try {
      const response = await RoleService.deleteRole(id);
      const { status } = response.data || {};

      if (!status?.success) {
        onError?.(
          status?.error ||
            status?.message ||
            response.error ||
            "Failed to delete role",
        );
        return;
      }

      onSuccess?.();
    } catch (error) {
      console.error("Error deleting admin role:", error);
      onError?.("An error occurred while deleting the role.");
    }
  }
}

export default new RoleController();
