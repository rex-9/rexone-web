import AppRoutes from "../../../AppRoutes";
import {
  IApiEnvelope,
  IApiResponse,
  IJsonApiResource,
} from "../../../models";
import { api } from "../../../services";
import {
  IAdminAiConfig,
  IAdminAiProfile,
  IAdminAiProfileFormValues,
  IAdminAiProfileListParams,
  IAdminAiRun,
  IAdminAiRunListParams,
} from "./types";

class AiService {
  async getConfig(): Promise<IApiResponse<IApiEnvelope<IAdminAiConfig>>> {
    return api.get<IAdminAiConfig>(
      AppRoutes.server.protected.admin.AI_PROFILES_CONFIG,
    );
  }

  async syncPrices(): Promise<IApiResponse<IApiEnvelope<IAdminAiConfig>>> {
    return api.post<IAdminAiConfig>(
      AppRoutes.server.protected.admin.AI_PROFILES_SYNC_PRICES,
      {},
    );
  }

  async getProfiles(
    params?: IAdminAiProfileListParams,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IAdminAiProfile>[]>>> {
    return api.get<IJsonApiResource<IAdminAiProfile>[]>(
      AppRoutes.server.protected.admin.AI_PROFILES,
      params as Record<string, unknown>,
    );
  }

  async getProfile(
    id: string,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IAdminAiProfile>>>> {
    return api.get<IJsonApiResource<IAdminAiProfile>>(
      AppRoutes.withId(AppRoutes.server.protected.admin.AI_PROFILE_DETAIL, id),
    );
  }

  async createProfile(
    values: IAdminAiProfileFormValues,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IAdminAiProfile>>>> {
    return api.post<IJsonApiResource<IAdminAiProfile>>(
      AppRoutes.server.protected.admin.AI_PROFILES,
      { profile: values },
    );
  }

  async updateProfile(
    id: string,
    values: IAdminAiProfileFormValues,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IAdminAiProfile>>>> {
    return api.put<IJsonApiResource<IAdminAiProfile>>(
      AppRoutes.withId(AppRoutes.server.protected.admin.AI_PROFILE_DETAIL, id),
      { profile: values },
    );
  }

  async destroyProfile(id: string): Promise<IApiResponse<IApiEnvelope<null>>> {
    return api.delete<null>(
      AppRoutes.withId(AppRoutes.server.protected.admin.AI_PROFILE_DETAIL, id),
    );
  }

  async getRuns(
    params?: IAdminAiRunListParams,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IAdminAiRun>[]>>> {
    return api.get<IJsonApiResource<IAdminAiRun>[]>(
      AppRoutes.server.protected.admin.AI_RUNS,
      params as Record<string, unknown>,
    );
  }

  async getRun(
    id: string,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IAdminAiRun>>>> {
    return api.get<IJsonApiResource<IAdminAiRun>>(
      AppRoutes.withId(AppRoutes.server.protected.admin.AI_RUN_DETAIL, id),
    );
  }
}

export default new AiService();
