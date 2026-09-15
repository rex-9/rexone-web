// src/modules/admin/ai/ai.controller.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import AiController from "./ai.controller";
import AiService from "./ai.service";
import type { IAdminAiProfileFormValues } from "./types";

vi.mock("./ai.service", () => ({
  default: {
    getProfiles: vi.fn(),
    getProfile: vi.fn(),
    createProfile: vi.fn(),
    updateProfile: vi.fn(),
    getRuns: vi.fn(),
    getRun: vi.fn(),
  },
}));

describe("AiController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getProfiles", () => {
    it("returns parsed profiles and pagination", async () => {
      const mockProfiles = [
        {
          id: "profile_1",
          type: "profile",
          attributes: {
            id: "profile_1",
            key: "chat_default",
            name: "Default Assistant",
            enabled: true,
            provider: "gemini",
            model: "gemini-2.5-flash",
          },
        },
      ];
      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: mockProfiles,
          meta: {
            pagination: { page: 1, limit: 20, total_count: 1, total_pages: 1 },
          },
        },
      };

      vi.mocked(AiService.getProfiles).mockResolvedValue(mockResponse as never);

      const result = await AiController.getProfiles({ page: 1 });

      expect(AiService.getProfiles).toHaveBeenCalledWith({ page: 1 });
      expect(result.success).toBe(true);
      expect(result.profiles).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: "profile_1", name: "Default Assistant" }),
        ]),
      );
      expect(result.pagination).toEqual(
        expect.objectContaining({ total_count: 1 }),
      );
    });

    it("returns error on failure", async () => {
      vi.mocked(AiService.getProfiles).mockResolvedValue({
        data: {
          status: { code: 500, success: false, message: "Error" },
          data: null,
        },
      } as never);

      const result = await AiController.getProfiles();

      expect(result.success).toBe(false);
      expect(result.profiles).toEqual([]);
      expect(result.error).toBeTruthy();
    });
  });

  describe("getProfile", () => {
    it("returns parsed profile", async () => {
      const mockProfile = {
        id: "profile_1",
        type: "profile",
        attributes: {
          id: "profile_1",
          name: "Default Assistant",
          model: "gemini-2.5-flash",
        },
      };
      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: mockProfile,
        },
      };

      vi.mocked(AiService.getProfile).mockResolvedValue(mockResponse as never);

      const result = await AiController.getProfile("profile_1");

      expect(AiService.getProfile).toHaveBeenCalledWith("profile_1");
      expect(result.success).toBe(true);
      expect(result.profile).toEqual(
        expect.objectContaining({ id: "profile_1", name: "Default Assistant" }),
      );
    });

    it("returns error when not found", async () => {
      vi.mocked(AiService.getProfile).mockResolvedValue({
        data: {
          status: { code: 404, success: false, message: "Not found" },
          data: null,
        },
      } as never);

      const result = await AiController.getProfile("nonexistent");

      expect(result.success).toBe(false);
      expect(result.profile).toBeUndefined();
      expect(result.error).toBeTruthy();
    });
  });

  describe("createProfile", () => {
    it("creates and returns parsed profile", async () => {
      const values: IAdminAiProfileFormValues = {
        key: "custom_agent",
        provider: "deepseek",
        name: "Custom Agent",
        enabled: true,
        model: "deepseek-chat",
        temperature: 0.7,
      };
      const mockResponse = {
        data: {
          status: { code: 201, success: true, message: "Created" },
          data: {
            id: "profile_2",
            type: "profile",
            attributes: {
              id: "profile_2",
              key: "custom_agent",
              provider: "deepseek",
              name: "Custom Agent",
              model: "deepseek-chat",
            },
          },
        },
      };

      vi.mocked(AiService.createProfile).mockResolvedValue(
        mockResponse as never,
      );

      const result = await AiController.createProfile(values);

      expect(AiService.createProfile).toHaveBeenCalledWith(values);
      expect(result.success).toBe(true);
      expect(result.profile).toEqual(
        expect.objectContaining({
          id: "profile_2",
          key: "custom_agent",
          name: "Custom Agent",
        }),
      );
    });

    it("returns error on validation failure", async () => {
      vi.mocked(AiService.createProfile).mockResolvedValue({
        data: {
          status: { code: 422, success: false, message: "Validation error" },
          data: null,
        },
      } as never);

      const result = await AiController.createProfile({
        key: "invalid",
        name: "",
        enabled: true,
        model: "",
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
    });
  });

  describe("updateProfile", () => {
    it("updates and returns parsed profile", async () => {
      const values: IAdminAiProfileFormValues = {
        name: "Updated Assistant",
        enabled: true,
        model: "gemini-2.5-pro",
        temperature: 0.8,
      };
      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: {
            id: "profile_1",
            type: "profile",
            attributes: {
              id: "profile_1",
              name: "Updated Assistant",
              model: "gemini-2.5-pro",
            },
          },
        },
      };

      vi.mocked(AiService.updateProfile).mockResolvedValue(mockResponse as never);

      const result = await AiController.updateProfile("profile_1", values);

      expect(AiService.updateProfile).toHaveBeenCalledWith("profile_1", values);
      expect(result.success).toBe(true);
      expect(result.profile).toEqual(
        expect.objectContaining({ id: "profile_1", name: "Updated Assistant" }),
      );
    });

    it("returns error on validation failure", async () => {
      vi.mocked(AiService.updateProfile).mockResolvedValue({
        data: {
          status: { code: 422, success: false, message: "Invalid parameters" },
          data: null,
        },
      } as never);

      const result = await AiController.updateProfile("profile_1", {
        name: "",
        enabled: true,
        model: "",
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
    });
  });

  describe("getRuns", () => {
    it("returns parsed runs and pagination", async () => {
      const mockRuns = [
        {
          id: "run_1",
          type: "run",
          attributes: {
            id: "run_1",
            feature: "chat",
            model: "gemini-2.5-flash",
            status: "completed",
            total_tokens: 150,
            latency_ms: 450,
          },
        },
      ];
      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: mockRuns,
          meta: {
            pagination: { page: 1, limit: 20, total_count: 1, total_pages: 1 },
          },
        },
      };

      vi.mocked(AiService.getRuns).mockResolvedValue(mockResponse as never);

      const result = await AiController.getRuns({ page: 1 });

      expect(AiService.getRuns).toHaveBeenCalledWith({ page: 1 });
      expect(result.success).toBe(true);
      expect(result.runs).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: "run_1", status: "completed" }),
        ]),
      );
      expect(result.pagination).toEqual(
        expect.objectContaining({ total_count: 1 }),
      );
    });

    it("returns error on failure", async () => {
      vi.mocked(AiService.getRuns).mockResolvedValue({
        data: {
          status: { code: 500, success: false, message: "Error" },
          data: null,
        },
      } as never);

      const result = await AiController.getRuns();

      expect(result.success).toBe(false);
      expect(result.runs).toEqual([]);
      expect(result.error).toBeTruthy();
    });
  });

  describe("getRun", () => {
    it("returns parsed run", async () => {
      const mockRun = {
        id: "run_1",
        type: "run",
        attributes: {
          id: "run_1",
          feature: "chat",
          status: "completed",
          total_tokens: 200,
        },
      };
      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: mockRun,
        },
      };

      vi.mocked(AiService.getRun).mockResolvedValue(mockResponse as never);

      const result = await AiController.getRun("run_1");

      expect(AiService.getRun).toHaveBeenCalledWith("run_1");
      expect(result.success).toBe(true);
      expect(result.run).toEqual(
        expect.objectContaining({ id: "run_1", status: "completed" }),
      );
    });

    it("returns error when not found", async () => {
      vi.mocked(AiService.getRun).mockResolvedValue({
        data: {
          status: { code: 404, success: false, message: "Not found" },
          data: null,
        },
      } as never);

      const result = await AiController.getRun("nonexistent");

      expect(result.success).toBe(false);
      expect(result.run).toBeUndefined();
      expect(result.error).toBeTruthy();
    });
  });
});
