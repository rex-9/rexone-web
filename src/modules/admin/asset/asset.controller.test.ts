// src/modules/admin/asset/asset.controller.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import AdminAssetController from "./asset.controller";
import AdminAssetService from "./asset.service";

vi.mock("./asset.service", () => ({
  default: {
    getAssets: vi.fn(),
    getAsset: vi.fn(),
    getDiscardedAssets: vi.fn(),
    uploadAsset: vi.fn(),
    updateAsset: vi.fn(),
    discardAsset: vi.fn(),
    restoreAsset: vi.fn(),
    destroyAsset: vi.fn(),
  },
}));

describe("AdminAssetController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAssets", () => {
    it("returns parsed assets filtered by type and search", async () => {
      const mockAssets = [
        {
          id: "a1",
          type: "asset",
          attributes: {
            id: "a1",
            name: "avatar.png",
            url: "https://example.com/avatar.png",
            type: "avatar",
            format: "image",
            size_bytes: 1024,
          },
        },
      ];
      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: mockAssets,
          meta: {
            pagination: {
              current_page: 1,
              limit: 12,
              total_count: 1,
              total_pages: 1,
              next_page: null,
              prev_page: null,
            },
          },
        },
      };

      vi.mocked(AdminAssetService.getAssets).mockResolvedValue(
        mockResponse as never,
      );

      const result = await AdminAssetController.getAssets({
        type: "avatar",
        search: "avatar",
      });

      expect(result.success).toBe(true);
      expect(result.assets).toHaveLength(1);
      expect(result.assets[0].name).toBe("avatar.png");
      expect(AdminAssetService.getAssets).toHaveBeenCalledWith({
        type: "avatar",
        search: "avatar",
      });
    });
  });

  describe("uploadAsset", () => {
    it("uploads asset with metadata and folder", async () => {
      const file = new File(["test-content"], "test.png", { type: "image/png" });
      const mockResponse = {
        data: {
          status: { code: 201, success: true, message: "Uploaded" },
          data: {
            id: "a2",
            type: "asset",
            attributes: {
              id: "a2",
              name: "test.png",
              url: "https://example.com/test.png",
              type: "cover",
            },
          },
        },
      };

      vi.mocked(AdminAssetService.uploadAsset).mockResolvedValue(
        mockResponse as never,
      );

      const result = await AdminAssetController.uploadAsset(file, {
        type: "cover",
        folder: "admin_uploads",
      });

      expect(result.success).toBe(true);
      expect(result.asset?.name).toBe("test.png");
      expect(AdminAssetService.uploadAsset).toHaveBeenCalledWith(
        file,
        expect.objectContaining({
          type: "cover",
          folder: "admin_uploads",
        }),
      );
    });
  });
});
