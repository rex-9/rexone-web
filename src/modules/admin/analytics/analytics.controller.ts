import analyticsService from "./analytics.service";
import { IAnalyticsOverview, IAnalyticsParams } from "./types";
import { getApiError } from "../../../services/api.service";

export interface IAnalyticsResult {
  success: boolean;
  data?: IAnalyticsOverview;
  error?: string;
}

class AnalyticsController {
  async getOverview(params?: IAnalyticsParams): Promise<IAnalyticsResult> {
    try {
      const response = await analyticsService.getOverview(params);

      if (response.data?.data && response.data?.status?.success) {
        return {
          success: true,
          data: response.data.data,
        };
      }

      return {
        success: false,
        error: getApiError(response, "Failed to load analytics"),
      };
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "An unexpected error occurred";
      return {
        success: false,
        error: errorMsg,
      };
    }
  }
}

export default new AnalyticsController();
