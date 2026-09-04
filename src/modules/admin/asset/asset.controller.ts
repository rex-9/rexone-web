import { IApiPagination, IAsset } from "../../../models";
import {
  getApiError,
  parsePagyList,
  parseRecord,
} from "../../../services/api.service";
import AdminAssetService from "./asset.service";
import { ASSET_STATUSES } from "./constants";
import { IAdminAsset } from "./types";

class AdminAssetController {
  async getAssets(params?: Record<string, string | number>): Promise<{
    success: boolean;
    assets: IAdminAsset[];
    pagination: IApiPagination | null;
    error?: string;
  }> {
    const response = await AdminAssetService.getAssets(params);
    const { status, data } = response.data || {};

    if (status?.success && data) {
      const { records, pagination } = parsePagyList<IAdminAsset>(response as any);
      return { success: true, assets: records, pagination };
    }

    return {
      success: false,
      assets: [],
      pagination: null,
      error: getApiError(
        response,
        "Failed to load assets", // Assuming we will add locales later
      ),
    };
  }

  async getAsset(id: string): Promise<{
    success: boolean;
    asset?: IAdminAsset;
    error?: string;
  }> {
    const response = await AdminAssetService.getAsset(id);
    const { status, data } = response.data || {};

    if (status?.success && data) {
      return {
        success: true,
        asset: parseRecord("asset" in data ? data.asset : data),
      };
    }

    return {
      success: false,
      error: getApiError(response, "Failed to load asset"),
    };
  }

  async getDiscardedAssets(params?: Record<string, string | number>): Promise<{
    success: boolean;
    assets: IAdminAsset[];
    pagination: IApiPagination | null;
    error?: string;
  }> {
    const response = await AdminAssetService.getDiscardedAssets(params);
    const { status, data } = response.data || {};

    if (status?.success && data) {
      const { records, pagination } = parsePagyList<IAdminAsset>(response as any);
      return { success: true, assets: records, pagination };
    }

    return {
      success: false,
      assets: [],
      pagination: null,
      error: getApiError(response, "Failed to load discarded assets"),
    };
  }

  async uploadAsset(
    file: File,
    options?: { type?: string; assetable_type?: string; assetable_id?: string; folder?: string },
  ): Promise<{
    success: boolean;
    asset?: IAsset;
    message?: string;
    error?: string;
  }> {
    const response = await AdminAssetService.uploadAsset(file, options);
    const { status, data } = response.data || {};

    if (status?.success && data) {
      return {
        success: true,
        asset: parseRecord("asset" in data ? (data as any).asset : data),
        message: status.message,
      };
    }

    return {
      success: false,
      error: getApiError(response, "Failed to upload asset"),
    };
  }

  async updateAsset(
    id: string,
    values: Partial<Pick<IAsset, "name" | "type" | "assetable_type" | "assetable_id">>,
  ): Promise<{
    success: boolean;
    asset?: IAdminAsset;
    message?: string;
    error?: string;
  }> {
    const response = await AdminAssetService.updateAsset(id, values);
    const { status, data } = response.data || {};

    if (status?.success && data) {
      return {
        success: true,
        asset: parseRecord("asset" in data ? data.asset : data),
        message: status.message,
      };
    }

    return {
      success: false,
      error: getApiError(response, "Failed to update asset"),
    };
  }

  async discardAsset(id: string): Promise<{
    success: boolean;
    message?: string;
    error?: string;
  }> {
    const response = await AdminAssetService.discardAsset(id);
    const { status } = response.data || {};

    if (status?.success) {
      return {
        success: true,
        message: status.message,
      };
    }

    return {
      success: false,
      error: getApiError(response, "Failed to discard asset"),
    };
  }

  async undiscardAsset(id: string): Promise<{
    success: boolean;
    message?: string;
    error?: string;
  }> {
    const response = await AdminAssetService.undiscardAsset(id);
    const { status } = response.data || {};

    if (status?.success) {
      return {
        success: true,
        message: status.message,
      };
    }

    return {
      success: false,
      error: getApiError(response, "Failed to restore asset"),
    };
  }

  async destroyAsset(id: string): Promise<{
    success: boolean;
    message?: string;
    error?: string;
  }> {
    const response = await AdminAssetService.destroyAsset(id);
    const { status } = response.data || {};

    if (status?.success) {
      return {
        success: true,
        message: status.message,
      };
    }

    return {
      success: false,
      error: getApiError(response, "Failed to destroy asset"),
    };
  }

  async compressAsset(id: string): Promise<{
    success: boolean;
    asset?: IAdminAsset;
    isOptimal?: boolean;
    message?: string;
    error?: string;
  }> {
    const response = await AdminAssetService.compressAsset(id);
    const { status, data } = response.data || {};

    if (status?.success && data) {
      const asset = parseRecord("asset" in data ? data.asset : data);
      return {
        success: true,
        asset,
        isOptimal: asset.status === ASSET_STATUSES.OPTIMAL,
        message: status.message,
      };
    }

    const err = getApiError(response, "Failed to compress asset");
    const rawAsset = data ? ("asset" in data ? data.asset : data) : undefined;
    const parsedAsset = rawAsset ? parseRecord(rawAsset) : undefined;
    const isOptimal =
      parsedAsset?.status === ASSET_STATUSES.OPTIMAL ||
      err?.toLowerCase().includes("optimal") ||
      err?.toLowerCase().includes("minimum") ||
      err?.toLowerCase().includes("max");

    return {
      success: false,
      isOptimal,
      asset: parsedAsset,
      error: err,
    };
  }
}

export default new AdminAssetController();
