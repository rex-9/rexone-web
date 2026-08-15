import AppRoutes from "../../../AppRoutes";
import {
  IApiEnvelope,
  IApiResponse,
  IJsonApiResource,
} from "../../../models";
import { api } from "../../../services";
import {
  IAdminPermission,
  IAdminRole,
  IAdminRoleFormValues,
} from "./types";

const buildRolePath = (id: string): string =>
  AppRoutes.server.protected.ADMIN_IAM_ROLE_DETAIL.replace(":id", id);

class RoleService {
  async getRoles(): Promise<
    IApiResponse<IApiEnvelope<{ roles: IJsonApiResource<IAdminRole>[] }>>
  > {
    return api.get<{ roles: IJsonApiResource<IAdminRole>[] }>(
      AppRoutes.server.protected.ADMIN_IAM_ROLES,
    );
  }

  async getRole(
    id: string,
  ): Promise<IApiResponse<IApiEnvelope<{ role: IAdminRole }>>> {
    return api.get<{ role: IAdminRole }>(buildRolePath(id));
  }

  async getPermissions(): Promise<
    IApiResponse<
      IApiEnvelope<{ permissions: IJsonApiResource<IAdminPermission>[] }>
    >
  > {
    return api.get<{ permissions: IJsonApiResource<IAdminPermission>[] }>(
      AppRoutes.server.protected.ADMIN_IAM_ROLE_PERMISSIONS,
    );
  }

  async createRole(
    values: IAdminRoleFormValues,
  ): Promise<IApiResponse<IApiEnvelope<{ role: IAdminRole }>>> {
    return api.post<{ role: IAdminRole }>(
      AppRoutes.server.protected.ADMIN_IAM_ROLES,
      values,
    );
  }

  async updateRole(
    id: string,
    values: IAdminRoleFormValues,
  ): Promise<IApiResponse<IApiEnvelope<{ role: IAdminRole }>>> {
    return api.patch<{ role: IAdminRole }>(buildRolePath(id), values);
  }

  async deleteRole(id: string): Promise<IApiResponse<IApiEnvelope<null>>> {
    return api.delete<null>(buildRolePath(id));
  }
}

export default new RoleService();
