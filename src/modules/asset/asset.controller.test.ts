// src/modules/asset/asset.controller.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import AssetController from "./asset.controller";
import AssetService from "./asset.service";
import { IAssetPlaybackResponse } from "../../models";

vi.mock("./asset.service", () => ({
  default: {
    getPlayback: vi.fn(),
  },
}));

describe("AssetController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getPlayback", () => {
    const mockPlayback: IAssetPlaybackResponse = {
      asset_id: "asset_123",
      delivery: {
        type: "progressive",
        url: "https://storage.rexone.com/videos/sample.mp4",
        expires_at: "2026-12-31T23:59:59Z",
      },
      media: {
        content_type: "video/mp4",
        format: "mp4",
        size_bytes: 1048576,
        subtitles: [],
      },
    };

    it("returns successful playback details when service succeeds", async () => {
      vi.mocked(AssetService.getPlayback).mockResolvedValueOnce({
        data: {
          status: { code: 200, success: true, message: "Playback loaded successfully" },
          data: mockPlayback,
        },
      });

      const result = await AssetController.getPlayback("asset_123");

      expect(AssetService.getPlayback).toHaveBeenCalledWith("asset_123");
      expect(result.success).toBe(true);
      expect(result.playback).toEqual(mockPlayback);
      expect(result.message).toBe("Playback loaded successfully");
      expect(result.error).toBeUndefined();
    });

    it("returns error details when service responds with failure", async () => {
      vi.mocked(AssetService.getPlayback).mockResolvedValueOnce({
        data: {
          status: {
            code: 404,
            success: false,
            message: "Asset not found",
            error: "Resource does not exist",
          },
          data: null as unknown as IAssetPlaybackResponse,
        },
      });

      const result = await AssetController.getPlayback("non_existent");

      expect(result.success).toBe(false);
      expect(result.playback).toBeUndefined();
      expect(result.error).toBe("Resource does not exist");
    });

    it("falls back to default error message when status error is omitted", async () => {
      vi.mocked(AssetService.getPlayback).mockResolvedValueOnce({
        data: null,
      });

      const result = await AssetController.getPlayback("asset_fail");

      expect(result.success).toBe(false);
      expect(result.playback).toBeUndefined();
      expect(result.error).toBe("Failed to load playback URL");
    });
  });
});
