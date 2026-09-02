import { describe, it, expect, vi, beforeEach } from "vitest";
import AdminLogsController from "./log.controller";
import AdminLogsService from "./log.service";

vi.mock("./log.service", () => ({
  default: {
    getLogs: vi.fn(),
    getLog: vi.fn(),
    resolveLog: vi.fn(),
    unresolveLog: vi.fn(),
    discardLog: vi.fn(),
    undiscardLog: vi.fn(),
    deleteLog: vi.fn(),
  },
}));

describe("AdminLogsController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getLogs", () => {
    it("returns paginated telemetry logs on success", async () => {
      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: [
            {
              id: "log_1",
              type: "client_log",
              attributes: {
                id: "log_1",
                message: "Uncaught TypeError: Cannot read property",
                severity: "error",
                platform: "web",
                occurrence_count: 5,
                created_at: "2026-09-01T00:00:00Z",
                updated_at: "2026-09-01T00:00:00Z",
              },
            },
          ],
          meta: {
            pagination: {
              page: 1,
              limit: 20,
              total_count: 1,
              total_pages: 1,
            },
          },
        },
      };

      vi.mocked(AdminLogsService.getLogs).mockResolvedValue(
        mockResponse as never,
      );

      const result = await AdminLogsController.getLogs();

      expect(result.success).toBe(true);
      expect(result.logs.length).toBe(1);
      expect(result.logs[0].occurrence_count).toBe(5);
    });
  });

  describe("resolveLog", () => {
    it("marks log as resolved", async () => {
      vi.mocked(AdminLogsService.resolveLog).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "Resolved" },
          data: {
            id: "log_1",
            type: "client_log",
            attributes: {
              id: "log_1",
              resolved_at: "2026-09-01T01:00:00Z",
            },
          },
        },
      } as never);

      const result = await AdminLogsController.resolveLog("log_1");

      expect(result.success).toBe(true);
      expect(result.log?.resolved_at).toBeDefined();
    });
  });

  describe("discardLog", () => {
    it("discards log successfully", async () => {
      vi.mocked(AdminLogsService.discardLog).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "Discarded" },
          data: {},
        },
      } as never);

      const result = await AdminLogsController.discardLog("log_1");

      expect(result.success).toBe(true);
      expect(AdminLogsService.discardLog).toHaveBeenCalledWith("log_1");
    });
  });

  describe("undiscardLog", () => {
    it("restores log successfully", async () => {
      vi.mocked(AdminLogsService.undiscardLog).mockResolvedValue({
        data: {
          status: { code: 200, success: true, message: "Restored" },
          data: {
            id: "log_1",
            type: "client_log",
            attributes: { id: "log_1" },
          },
        },
      } as never);

      const result = await AdminLogsController.undiscardLog("log_1");

      expect(result.success).toBe(true);
      expect(AdminLogsService.undiscardLog).toHaveBeenCalledWith("log_1");
    });
  });
});
