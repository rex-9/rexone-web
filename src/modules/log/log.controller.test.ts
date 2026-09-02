import { describe, it, expect, vi, beforeEach } from "vitest";
import LogController from "./log.controller";
import LogService from "./log.service";
import { LOG_SEVERITIES } from "./constants";

vi.mock("./log.service", () => ({
  default: {
    createLog: vi.fn(),
  },
}));

vi.mock("../../services/atom.service", () => ({
  default: {
    getKeys: vi.fn().mockReturnValue(["auth_token", "user_prefs"]),
  },
}));

describe("LogController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("logError", () => {
    it("captures client error telemetry and sends to LogService", async () => {
      vi.mocked(LogService.createLog).mockResolvedValue(undefined as any);

      await LogController.logError(new Error("Test crash"), { feature: "checkout" });

      expect(LogService.createLog).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Test crash",
          severity: LOG_SEVERITIES.ERROR,
          context: { feature: "checkout" },
          local_storage_keys: ["auth_token", "user_prefs"],
        }),
      );
    });

    it("handles string error messages", async () => {
      vi.mocked(LogService.createLog).mockResolvedValue(undefined as any);

      await LogController.logError("Raw error string");

      expect(LogService.createLog).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Raw error string",
        }),
      );
    });
  });

  describe("logStorageIssue", () => {
    it("logs storage mismatches with storage context", async () => {
      vi.mocked(LogService.createLog).mockResolvedValue(undefined as any);

      await LogController.logStorageIssue("user_id", "123", null);

      expect(LogService.createLog).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Storage mismatch for key: user_id",
          context: expect.objectContaining({
            storageKey: "user_id",
            expectedValue: "123",
            actualValue: null,
            type: "storage_issue",
          }),
        }),
      );
    });
  });
});
