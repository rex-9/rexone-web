import AppRoutes from "../../AppRoutes";
import { IApiEnvelope, IApiResponse, IAssetPlaybackResponse } from "../../models";
import { api } from "../../services/api.service";

class AssetService {
  async getPlayback(
    id: string,
  ): Promise<IApiResponse<IApiEnvelope<IAssetPlaybackResponse>>> {
    return api.get<IAssetPlaybackResponse>(
      AppRoutes.withId(AppRoutes.server.protected.ASSET_PLAYBACK, id),
    );
  }
}

export default new AssetService();
