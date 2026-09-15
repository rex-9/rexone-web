import { IApiPagination, IJsonApiResource } from "../../../models";
import { AppLocales, translate } from "../../../locales";
import {
  getApiError,
  parsePagyList,
  parseRecord,
} from "../../../services/api.service";
import AiService from "./ai.service";
import {
  IAdminAiProfile,
  IAdminAiProfileFormValues,
  IAdminAiProfileListParams,
  IAdminAiRun,
  IAdminAiRunListParams,
} from "./types";

class AiController {
  async getProfiles(params?: IAdminAiProfileListParams): Promise<{
    success: boolean;
    profiles: IAdminAiProfile[];
    pagination: IApiPagination | null;
    error?: string;
  }> {
    const response = await AiService.getProfiles(params);
    const { status, data } = response.data || {};

    if (status?.success && data) {
      const { records, pagination } = parsePagyList<IAdminAiProfile>(response);
      return { success: true, profiles: records, pagination };
    }

    return {
      success: false,
      profiles: [],
      pagination: null,
      error: getApiError(
        response,
        translate(AppLocales.Admin.Ai.Errors.LoadProfiles),
      ),
    };
  }

  async getProfile(id: string): Promise<{
    success: boolean;
    profile?: IAdminAiProfile;
    error?: string;
  }> {
    const response = await AiService.getProfile(id);
    const { status, data } = response.data || {};

    if (status?.success && data) {
      const raw =
        typeof data === "object" && data !== null && "profile" in data
          ? (data as { profile: IAdminAiProfile }).profile
          : data;
      return {
        success: true,
        profile: parseRecord<IAdminAiProfile>(
          raw as IJsonApiResource<IAdminAiProfile> | IAdminAiProfile,
        ),
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
      const raw =
        typeof data === "object" && data !== null && "profile" in data
          ? (data as { profile: IAdminAiProfile }).profile
          : data;
      return {
        success: true,
        profile: parseRecord<IAdminAiProfile>(
          raw as IJsonApiResource<IAdminAiProfile> | IAdminAiProfile,
        ),
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
      const raw =
        typeof data === "object" && data !== null && "profile" in data
          ? (data as { profile: IAdminAiProfile }).profile
          : data;
      return {
        success: true,
        profile: parseRecord<IAdminAiProfile>(
          raw as IJsonApiResource<IAdminAiProfile> | IAdminAiProfile,
        ),
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

  async getRuns(params?: IAdminAiRunListParams): Promise<{
    success: boolean;
    runs: IAdminAiRun[];
    pagination: IApiPagination | null;
    error?: string;
  }> {
    const response = await AiService.getRuns(params);
    const { status, data } = response.data || {};

    if (status?.success && data) {
      const { records, pagination } = parsePagyList<IAdminAiRun>(response);
      return { success: true, runs: records, pagination };
    }

    return {
      success: false,
      runs: [],
      pagination: null,
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
      const raw =
        typeof data === "object" && data !== null && "run" in data
          ? (data as { run: IAdminAiRun }).run
          : data;
      return {
        success: true,
        run: parseRecord<IAdminAiRun>(
          raw as IJsonApiResource<IAdminAiRun> | IAdminAiRun,
        ),
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
