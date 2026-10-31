import { IApiPagination } from "../../../models";
import { AppLocales, translate } from "../../../locales";
import {
  getApiError,
  parsePagyList,
  parseRecord,
} from "../../../services/api.service";
import AiService from "./ai.service";
import {
  IAdminAiConfig,
  IAdminAiProfile,
  IAdminAiProfileFormValues,
  IAdminAiProfileListParams,
  IAdminAiRun,
  IAdminAiRunListParams,
} from "./types";

class AiController {
  async getConfig(): Promise<{
    success: boolean;
    config?: IAdminAiConfig;
    error?: string;
  }> {
    const response = await AiService.getConfig();
    const { status, data } = response.data || {};

    if (status?.success && data) {
      return { success: true, config: data };
    }

    return {
      success: false,
      error: getApiError(
        response,
        translate(AppLocales.Admin.Ai.Errors.LoadProviders),
      ),
    };
  }

  async syncPrices(): Promise<{
    success: boolean;
    config?: IAdminAiConfig;
    error?: string;
  }> {
    const response = await AiService.syncPrices();
    const { status, data } = response.data || {};

    if (status?.success && data) {
      return { success: true, config: data };
    }

    return {
      success: false,
      error: getApiError(
        response,
        translate(AppLocales.Admin.Ai.Errors.SyncPrices),
      ),
    };
  }

  async getProfiles(params?: IAdminAiProfileListParams): Promise<{
    success: boolean;
    profiles: IAdminAiProfile[];
    pagination: IApiPagination | null;
    config: IAdminAiConfig | null;
    error?: string;
  }> {
    const response = await AiService.getProfiles(params);
    const { status, data, meta } = response.data || {};
    const config =
      (meta as { config?: IAdminAiConfig } | undefined)?.config ||
      null;

    if (status?.success && data) {
      const { records, pagination } = parsePagyList<IAdminAiProfile>(response);
      return {
        success: true,
        profiles: records,
        pagination,
        config,
      };
    }

    return {
      success: false,
      profiles: [],
      pagination: null,
      config: null,
      error: getApiError(
        response,
        translate(AppLocales.Admin.Ai.Errors.LoadProfiles),
      ),
    };
  }

  async getProfile(id: string): Promise<{
    success: boolean;
    profile?: IAdminAiProfile;
    config?: IAdminAiConfig | null;
    error?: string;
  }> {
    const response = await AiService.getProfile(id);
    const { status, data, meta } = response.data || {};
    const config =
      (meta as { config?: IAdminAiConfig } | undefined)?.config ||
      null;

    if (status?.success && data) {
      return {
        success: true,
        profile: parseRecord<IAdminAiProfile>(data),
        config,
      };
    }

    return {
      success: false,
      error: getApiError(
        response,
        translate(AppLocales.Admin.Ai.Errors.LoadProfile),
      ),
    };
  }

  async createProfile(values: IAdminAiProfileFormValues): Promise<{
    success: boolean;
    profile?: IAdminAiProfile;
    error?: string;
  }> {
    const response = await AiService.createProfile(values);
    const { status, data } = response.data || {};

    if (status?.success && data) {
      return {
        success: true,
        profile: parseRecord<IAdminAiProfile>(data),
      };
    }

    return {
      success: false,
      error: getApiError(
        response,
        translate(AppLocales.Admin.Ai.Errors.CreateProfile),
      ),
    };
  }

  async updateProfile(
    id: string,
    values: IAdminAiProfileFormValues,
  ): Promise<{
    success: boolean;
    profile?: IAdminAiProfile;
    error?: string;
  }> {
    const response = await AiService.updateProfile(id, values);
    const { status, data } = response.data || {};

    if (status?.success && data) {
      return {
        success: true,
        profile: parseRecord<IAdminAiProfile>(data),
      };
    }

    return {
      success: false,
      error: getApiError(
        response,
        translate(AppLocales.Admin.Ai.Errors.UpdateProfile),
      ),
    };
  }

  async destroyProfile(id: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    const response = await AiService.destroyProfile(id);
    const { status } = response.data || {};

    if (status?.success) {
      return { success: true };
    }

    return {
      success: false,
      error: getApiError(
        response,
        translate(AppLocales.Admin.Ai.Errors.DestroyProfile),
      ),
    };
  }

  async getRuns(params?: IAdminAiRunListParams): Promise<{
    success: boolean;
    runs: IAdminAiRun[];
    pagination: IApiPagination | null;
    config: IAdminAiConfig | null;
    error?: string;
  }> {
    const response = await AiService.getRuns(params);
    const { status, data, meta } = response.data || {};
    const config =
      (meta as { config?: IAdminAiConfig } | undefined)?.config ||
      null;

    if (status?.success && data) {
      const { records, pagination } = parsePagyList<IAdminAiRun>(response);
      return { success: true, runs: records, pagination, config };
    }

    return {
      success: false,
      runs: [],
      pagination: null,
      config: null,
      error: getApiError(
        response,
        translate(AppLocales.Admin.Ai.Errors.LoadRuns),
      ),
    };
  }

  async getRun(id: string): Promise<{
    success: boolean;
    run?: IAdminAiRun;
    error?: string;
  }> {
    const response = await AiService.getRun(id);
    const { status, data } = response.data || {};

    if (status?.success && data) {
      return {
        success: true,
        run: parseRecord<IAdminAiRun>(data),
      };
    }

    return {
      success: false,
      error: getApiError(
        response,
        translate(AppLocales.Admin.Ai.Errors.LoadRun),
      ),
    };
  }
}

export default new AiController();
