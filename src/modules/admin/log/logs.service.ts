// src/modules/admin/log/logs.service.ts
import { api } from "../../../services/api.service";
import AppRoutes from "../../../AppRoutes";
import type {
  IApiEnvelope,
  IApiResponse,
  IJsonApiResource,
} from "../../../models";
import type { IAdminLog, IAdminLogFilters } from "./types";

class AdminLogsService {
  async getLogs(
    params?: IAdminLogFilters,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IAdminLog>[]>>> {
    return api.get<IJsonApiResource<IAdminLog>[]>(
      AppRoutes.server.protected.admin.LOGS,
      params as Record<string, unknown>,
    );
  }

  async getLog(
    id: string,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IAdminLog>>>> {
    return api.get<IJsonApiResource<IAdminLog>>(
      AppRoutes.withId(AppRoutes.server.protected.admin.LOG_DETAIL, id),
    );
  }

  async resolveLog(
    id: string,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IAdminLog>>>> {
    return api.put<IJsonApiResource<IAdminLog>>(
      AppRoutes.withId(AppRoutes.server.protected.admin.LOG_RESOLVE, id),
    );
  }

  async unresolveLog(
    id: string,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IAdminLog>>>> {
    return api.put<IJsonApiResource<IAdminLog>>(
      AppRoutes.withId(AppRoutes.server.protected.admin.LOG_UNRESOLVE, id),
    );
  }

  async deleteLog(
    id: string,
  ): Promise<IApiResponse<IApiEnvelope<Record<string, unknown>>>> {
    return api.delete<Record<string, unknown>>(
      AppRoutes.withId(AppRoutes.server.protected.admin.LOG_DETAIL, id),
    );
  }
}

export default new AdminLogsService();
