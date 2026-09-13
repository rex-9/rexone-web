import { IAssetPlaybackResponse } from "../../models";
import { getApiError } from "../../services";
import AssetService from "./asset.service";

class AssetController {
  async getPlayback(id: string): Promise<{
    success: boolean;
    playback?: IAssetPlaybackResponse;
    message?: string;
    error?: string;
  }> {
    const response = await AssetService.getPlayback(id);
    const { status, data } = response.data || {};

    if (status?.success && data) {
      return {
        success: true,
        playback: data,
        message: status.message,
      };
    }

    return {
      success: false,
      error: getApiError(response, "Failed to load playback URL"),
    };
  }
}

export default new AssetController();
