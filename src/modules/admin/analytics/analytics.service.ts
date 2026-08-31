import AppRoutes from "../../../AppRoutes";
import { api } from "../../../services/api.service";
import { IApiEnvelope, IApiResponse } from "../../../models";
import { IAnalyticsOverview, IAnalyticsParams } from "./types";

class AnalyticsService {
  async getOverview(
    params?: IAnalyticsParams,
  ): Promise<IApiResponse<IApiEnvelope<IAnalyticsOverview>>> {
    return api.get<IAnalyticsOverview>(
      AppRoutes.server.protected.admin.ANALYTICS_OVERVIEW,
      params as Record<string, unknown>,
    );
  }
}

export default new AnalyticsService();
