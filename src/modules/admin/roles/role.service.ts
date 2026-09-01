import AppRoutes from "../../../AppRoutes";
import { IApiEnvelope, IApiResponse, IJsonApiResource } from "../../../models";
import { api } from "../../../services";
import { ADMIN_COMMON_PAGINATION_LABELS } from "../constants";
import { IAdminPermissionListParams } from "./types";
import { IAdminPermission, IAdminRole, IAdminRoleFormValues } from "./types";

type AdminRoleResponse = IAdminRole | { role: IAdminRole };
type AdminRoleListResponse =
  | IJsonApiResource<IAdminRole>[]
  | { roles: IJsonApiResource<IAdminRole>[] };
type AdminPermissionListResponse =
  | IJsonApiResource<IAdminPermission>[]
  | { permissions: IJsonApiResource<IAdminPermission>[] };

class RoleService {
  async getRoles(): Promise<IApiResponse<IApiEnvelope<AdminRoleListResponse>>> {
    return api.get<AdminRoleListResponse>(
      AppRoutes.server.protected.admin.IAM_ROLES,
    );
  }

  async getRole(
    id: string,
  ): Promise<IApiResponse<IApiEnvelope<AdminRoleResponse>>> {
    return api.get<AdminRoleResponse>(
      AppRoutes.withId(AppRoutes.server.protected.admin.IAM_ROLE_DETAIL, id),
    );
  }

  async getPermissions(
    params?: IAdminPermissionListParams,
  ): Promise<IApiResponse<IApiEnvelope<AdminPermissionListResponse>>> {
    const queryParams: Record<string, unknown> = {
      page: 1,
      limit: ADMIN_COMMON_PAGINATION_LABELS.POFF,
      ...params,
    };

    return api.get<AdminPermissionListResponse>(
      AppRoutes.server.protected.admin.IAM_ROLE_PERMISSIONS,
      queryParams,
    );
  }

  async createRole(
    values: IAdminRoleFormValues,
  ): Promise<IApiResponse<IApiEnvelope<AdminRoleResponse>>> {
    return api.post<AdminRoleResponse>(
      AppRoutes.server.protected.admin.IAM_ROLES,
      values,
    );
  }

  async updateRole(
    id: string,
    values: IAdminRoleFormValues,
  ): Promise<IApiResponse<IApiEnvelope<AdminRoleResponse>>> {
    return api.put<AdminRoleResponse>(
      AppRoutes.withId(AppRoutes.server.protected.admin.IAM_ROLE_DETAIL, id),
      values,
    );
  }

  async discardRole(id: string): Promise<IApiResponse<IApiEnvelope<null>>> {
    return api.delete<null>(
      AppRoutes.withId(AppRoutes.server.protected.admin.IAM_ROLE_DETAIL, id),
    );
  }
}

export default new RoleService();
