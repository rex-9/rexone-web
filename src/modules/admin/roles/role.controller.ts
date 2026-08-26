import { getApiError, parseRecord } from "../../../services/api.service";
import { AppLocales, translate } from "../../../locales";
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

      if (!status?.success || !data) {
        onError?.(
          getApiError(response, translate(AppLocales.Admin.Roles.Errors.LoadList)),
        );
        return;
      }

      onSuccess?.(data.map(parseRecord));
  }

  async getRole(
    id: string,
    onSuccess?: (role: IAdminRole) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
      const response = await RoleService.getRole(id);
      const { status, data } = response.data || {};

      if (!status?.success || !data) {
        onError?.(
          getApiError(response, translate(AppLocales.Admin.Roles.Errors.LoadOne)),
        );
        return;
      }

      onSuccess?.(parseRecord(data));
  }

  async getPermissions(
    onSuccess?: (permissions: IAdminPermission[]) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
      const response = await RoleService.getPermissions();
      const { status, data } = response.data || {};

      if (!status?.success || !data) {
        onError?.(
          getApiError(
            response,
            translate(AppLocales.Admin.Roles.Errors.LoadPermissions),
          ),
        );
        return;
      }

      onSuccess?.(data.map(parseRecord));
  }

  async createRole(
    values: IAdminRoleFormValues,
    onSuccess?: (role: IAdminRole) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
      const response = await RoleService.createRole(values);
      const { status, data } = response.data || {};

      if (!status?.success || !data) {
        onError?.(
          getApiError(response, translate(AppLocales.Admin.Roles.Errors.Create)),
        );
        return;
      }

      onSuccess?.(parseRecord(data));
  }

  async updateRole(
    id: string,
    values: IAdminRoleFormValues,
    onSuccess?: (role: IAdminRole) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
      const response = await RoleService.updateRole(id, values);
      const { status, data } = response.data || {};

      if (!status?.success || !data) {
        onError?.(
          getApiError(response, translate(AppLocales.Admin.Roles.Errors.Update)),
        );
        return;
      }

      onSuccess?.(parseRecord(data));
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
          getApiError(response, translate(AppLocales.Admin.Roles.Errors.Delete)),
        );
        return;
      }

      onSuccess?.();
  }
}

export default new RoleController();
