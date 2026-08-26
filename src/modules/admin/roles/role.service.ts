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

class RoleService {
  async getRoles(): Promise<
    IApiResponse<IApiEnvelope<IJsonApiResource<IAdminRole>[]>>
  > {
    return api.get<IJsonApiResource<IAdminRole>[]>(
      AppRoutes.server.protected.admin.IAM_ROLES,
    );
  }

  async getRole(
    id: string,
  ): Promise<IApiResponse<IApiEnvelope<IAdminRole>>> {
    return api.get<IAdminRole>(
      AppRoutes.withId(AppRoutes.server.protected.admin.IAM_ROLE_DETAIL, id),
    );
  }

  async getPermissions(): Promise<
    IApiResponse<IApiEnvelope<IJsonApiResource<IAdminPermission>[]>>
  > {
    return api.get<IJsonApiResource<IAdminPermission>[]>(
      AppRoutes.server.protected.admin.IAM_ROLE_PERMISSIONS,
    );
  }

  async createRole(
    values: IAdminRoleFormValues,
  ): Promise<IApiResponse<IApiEnvelope<IAdminRole>>> {
    return api.post<IAdminRole>(
      AppRoutes.server.protected.admin.IAM_ROLES,
      values,
    );
  }

  async updateRole(
    id: string,
    values: IAdminRoleFormValues,
  ): Promise<IApiResponse<IApiEnvelope<IAdminRole>>> {
    return api.put<IAdminRole>(
      AppRoutes.withId(AppRoutes.server.protected.admin.IAM_ROLE_DETAIL, id),
      values,
    );
  }

  async deleteRole(id: string): Promise<IApiResponse<IApiEnvelope<null>>> {
    return api.delete<null>(
      AppRoutes.withId(AppRoutes.server.protected.admin.IAM_ROLE_DETAIL, id),
    );
  }
}

export default new RoleService();
