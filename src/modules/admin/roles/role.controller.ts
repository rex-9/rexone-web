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
  }

  async getRole(
    id: string,
    onSuccess?: (role: IAdminRole) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
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
  }

  async getPermissions(
    onSuccess?: (permissions: IAdminPermission[]) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
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
  }

  async createRole(
    values: IAdminRoleFormValues,
    onSuccess?: (role: IAdminRole) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
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
  }

  async updateRole(
    id: string,
    values: IAdminRoleFormValues,
    onSuccess?: (role: IAdminRole) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
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
  }

  async deleteRole(
    id: string,
    onSuccess?: () => void,
    onError?: (error: string) => void,
  ): Promise<void> {
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
  }
}

export default new RoleController();
