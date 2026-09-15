import AppRoutes from "../../../AppRoutes";
import {
  IApiEnvelope,
  IApiResponse,
  IJsonApiResource,
} from "../../../models";
import { api } from "../../../services";
import {
  IAdminAiProfile,
  IAdminAiProfileFormValues,
  IAdminAiProfileListParams,
  IAdminAiRun,
  IAdminAiRunListParams,
} from "./types";

type AdminAiProfileResponse = IAdminAiProfile | { profile: IAdminAiProfile };
type AdminAiRunResponse = IAdminAiRun | { run: IAdminAiRun };

class AiService {
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
  ): Promise<IApiResponse<IApiEnvelope<AdminAiProfileResponse>>> {
    return api.get<AdminAiProfileResponse>(
      AppRoutes.withId(AppRoutes.server.protected.admin.AI_PROFILE_DETAIL, id),
    );
  }

  async createProfile(
    values: IAdminAiProfileFormValues,
  ): Promise<IApiResponse<IApiEnvelope<AdminAiProfileResponse>>> {
    return api.post<AdminAiProfileResponse>(
      AppRoutes.server.protected.admin.AI_PROFILES,
      { profile: values },
    );
  }

  async updateProfile(
    id: string,
    values: IAdminAiProfileFormValues,
  ): Promise<IApiResponse<IApiEnvelope<AdminAiProfileResponse>>> {
    return api.put<AdminAiProfileResponse>(
      AppRoutes.withId(AppRoutes.server.protected.admin.AI_PROFILE_DETAIL, id),
      { profile: values },
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
  ): Promise<IApiResponse<IApiEnvelope<AdminAiRunResponse>>> {
    return api.get<AdminAiRunResponse>(
      AppRoutes.withId(AppRoutes.server.protected.admin.AI_RUN_DETAIL, id),
    );
  }
}

export default new AiService();
