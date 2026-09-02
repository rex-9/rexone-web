// src/modules/admin/chat/chat.controller.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import ChatController from "./chat.controller";
import ChatService from "./chat.service";
import type {
  IAdminChatMessageFormValues,
  IAdminChatRoomFormValues,
} from "./types";

vi.mock("./chat.service", () => ({
  default: {
    getRooms: vi.fn(),
    getRoom: vi.fn(),
    updateRoom: vi.fn(),
    discardRoom: vi.fn(),
    undiscardRoom: vi.fn(),
    deleteRoom: vi.fn(),
    getMessages: vi.fn(),
    getMessage: vi.fn(),
    updateMessage: vi.fn(),
    discardMessage: vi.fn(),
    undiscardMessage: vi.fn(),
    deleteMessage: vi.fn(),
  },
}));

describe("ChatController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getRooms", () => {
    it("returns parsed rooms and pagination", async () => {
      const mockRooms = [
        {
          id: "room_1",
          type: "room",
          attributes: { id: "room_1", title: "General Support", message_count: 5 },
        },
      ];
      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: mockRooms,
          meta: {
            pagination: { page: 1, limit: 20, total_count: 1, total_pages: 1 },
          },
        },
      };

      vi.mocked(ChatService.getRooms).mockResolvedValue(mockResponse as never);

      const result = await ChatController.getRooms({ page: 1 });

      expect(ChatService.getRooms).toHaveBeenCalledWith({ page: 1 });
      expect(result.success).toBe(true);
      expect(result.rooms).toEqual(
        expect.arrayContaining([expect.objectContaining({ id: "room_1" })]),
      );
      expect(result.pagination).toEqual(
        expect.objectContaining({ total_count: 1 }),
      );
    });

    it("returns error on failure", async () => {
      vi.mocked(ChatService.getRooms).mockResolvedValue({
        data: {
          status: { code: 500, success: false, message: "Error" },
          data: null,
        },
      } as never);

      const result = await ChatController.getRooms({ page: 1 });

      expect(result.success).toBe(false);
      expect(result.rooms).toEqual([]);
      expect(result.error).toBeTruthy();
    });
  });

  describe("getRoom", () => {
    it("returns single room", async () => {
      const mockRoom = { id: "room_1", title: "VIP Chat" };
      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: { room: mockRoom },
        },
      };

      vi.mocked(ChatService.getRoom).mockResolvedValue(mockResponse as never);

      const result = await ChatController.getRoom("room_1");

      expect(ChatService.getRoom).toHaveBeenCalledWith("room_1");
      expect(result.success).toBe(true);
      expect(result.room).toEqual(
        expect.objectContaining({ id: "room_1", title: "VIP Chat" }),
      );
    });
  });

  describe("updateRoom", () => {
    it("returns updated room", async () => {
      const formValues: IAdminChatRoomFormValues = {
        title: "Renamed Room",
      };
      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "Room updated" },
          data: { room: { id: "room_1", title: "Renamed Room" } },
        },
      };

      vi.mocked(ChatService.updateRoom).mockResolvedValue(mockResponse as never);

      const result = await ChatController.updateRoom("room_1", formValues);

      expect(ChatService.updateRoom).toHaveBeenCalledWith("room_1", formValues);
      expect(result.success).toBe(true);
      expect(result.room).toEqual(
        expect.objectContaining({ id: "room_1", title: "Renamed Room" }),
      );
    });
  });

  describe("discardRoom", () => {
    it("returns success on discard room", async () => {
      const mockResponse = {
        data: { status: { code: 200, success: true, message: "OK" } },
      };

      vi.mocked(ChatService.discardRoom).mockResolvedValue(
        mockResponse as never,
      );

      const result = await ChatController.discardRoom("room_1");

      expect(ChatService.discardRoom).toHaveBeenCalledWith("room_1");
      expect(result.success).toBe(true);
    });
  });

  describe("undiscardRoom", () => {
    it("returns success on restore room", async () => {
      const mockResponse = {
        data: { status: { code: 200, success: true, message: "OK" } },
      };

      vi.mocked(ChatService.undiscardRoom).mockResolvedValue(
        mockResponse as never,
      );

      const result = await ChatController.undiscardRoom("room_1");

      expect(ChatService.undiscardRoom).toHaveBeenCalledWith("room_1");
      expect(result.success).toBe(true);
    });
  });

  describe("deleteRoom", () => {
    it("returns success on permanent delete room", async () => {
      const mockResponse = {
        data: { status: { code: 200, success: true, message: "OK" } },
      };

      vi.mocked(ChatService.deleteRoom).mockResolvedValue(
        mockResponse as never,
      );

      const result = await ChatController.deleteRoom("room_1");

      expect(ChatService.deleteRoom).toHaveBeenCalledWith("room_1");
      expect(result.success).toBe(true);
    });
  });

  describe("getMessages", () => {
    it("returns messages list and pagination", async () => {
      const mockMessages = [
        {
          id: "msg_1",
          type: "message",
          attributes: { id: "msg_1", content: "Hello", role: "user", room_id: "room_1" },
        },
      ];
      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: mockMessages,
          meta: {
            pagination: { page: 1, limit: 20, total_count: 1, total_pages: 1 },
          },
        },
      };

      vi.mocked(ChatService.getMessages).mockResolvedValue(
        mockResponse as never,
      );

      const result = await ChatController.getMessages({ page: 1 });

      expect(ChatService.getMessages).toHaveBeenCalledWith({ page: 1 });
      expect(result.success).toBe(true);
      expect(result.messages).toEqual(
        expect.arrayContaining([expect.objectContaining({ id: "msg_1" })]),
      );
      expect(result.pagination).toEqual(
        expect.objectContaining({ total_count: 1 }),
      );
    });
  });

  describe("getMessage", () => {
    it("returns single message", async () => {
      const mockMessage = { id: "msg_1", content: "Hello there" };
      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: { message: mockMessage },
        },
      };

      vi.mocked(ChatService.getMessage).mockResolvedValue(
        mockResponse as never,
      );

      const result = await ChatController.getMessage("msg_1");

      expect(ChatService.getMessage).toHaveBeenCalledWith("msg_1");
      expect(result.success).toBe(true);
      expect(result.message).toEqual(
        expect.objectContaining({ id: "msg_1", content: "Hello there" }),
      );
    });
  });

  describe("updateMessage", () => {
    it("returns updated message", async () => {
      const formValues: IAdminChatMessageFormValues = {
        content: "Updated message content",
        role: "assistant",
      };
      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: { message: { id: "msg_1", content: "Updated message content" } },
        },
      };

      vi.mocked(ChatService.updateMessage).mockResolvedValue(
        mockResponse as never,
      );

      const result = await ChatController.updateMessage("msg_1", formValues);

      expect(ChatService.updateMessage).toHaveBeenCalledWith("msg_1", formValues);
      expect(result.success).toBe(true);
      expect(result.message).toEqual(
        expect.objectContaining({ id: "msg_1" }),
      );
    });
  });

  describe("discardMessage", () => {
    it("returns success on discard message", async () => {
      const mockResponse = {
        data: { status: { code: 200, success: true, message: "OK" } },
      };

      vi.mocked(ChatService.discardMessage).mockResolvedValue(
        mockResponse as never,
      );

      const result = await ChatController.discardMessage("msg_1");

      expect(ChatService.discardMessage).toHaveBeenCalledWith("msg_1");
      expect(result.success).toBe(true);
    });
  });

  describe("undiscardMessage", () => {
    it("returns success on restore message", async () => {
      const mockResponse = {
        data: { status: { code: 200, success: true, message: "OK" } },
      };

      vi.mocked(ChatService.undiscardMessage).mockResolvedValue(
        mockResponse as never,
      );

      const result = await ChatController.undiscardMessage("msg_1");

      expect(ChatService.undiscardMessage).toHaveBeenCalledWith("msg_1");
      expect(result.success).toBe(true);
    });
  });

  describe("deleteMessage", () => {
    it("returns success on permanent delete message", async () => {
      const mockResponse = {
        data: { status: { code: 200, success: true, message: "OK" } },
      };

      vi.mocked(ChatService.deleteMessage).mockResolvedValue(
        mockResponse as never,
      );

      const result = await ChatController.deleteMessage("msg_1");

      expect(ChatService.deleteMessage).toHaveBeenCalledWith("msg_1");
      expect(result.success).toBe(true);
    });
  });
});
