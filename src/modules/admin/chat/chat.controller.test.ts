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
    deleteRoom: vi.fn(),
    getMessages: vi.fn(),
    getMessage: vi.fn(),
    updateMessage: vi.fn(),
    discardMessage: vi.fn(),
    deleteMessage: vi.fn(),
  },
}));

describe("ChatController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getRooms", () => {
    it("calls onSuccess with parsed rooms and pagination", async () => {
      const mockRooms = [
        { id: "room_1", title: "General Support", message_count: 5 },
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

      const onSuccess = vi.fn();
      const onError = vi.fn();

      await ChatController.getRooms({ page: 1 }, onSuccess, onError);

      expect(ChatService.getRooms).toHaveBeenCalledWith({ page: 1 });
      expect(onSuccess).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ id: "room_1" })]),
        expect.objectContaining({ total_count: 1 }),
      );
      expect(onError).not.toHaveBeenCalled();
    });

    it("calls onError on failure", async () => {
      vi.mocked(ChatService.getRooms).mockResolvedValue({
        data: {
          status: { code: 500, success: false, message: "Error" },
          data: null,
        },
      } as never);

      const onSuccess = vi.fn();
      const onError = vi.fn();

      await ChatController.getRooms({ page: 1 }, onSuccess, onError);

      expect(onError).toHaveBeenCalled();
      expect(onSuccess).not.toHaveBeenCalled();
    });
  });

  describe("getRoom", () => {
    it("calls onSuccess with single room", async () => {
      const mockRoom = { id: "room_1", title: "VIP Chat" };
      const mockResponse = {
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: { room: mockRoom },
        },
      };

      vi.mocked(ChatService.getRoom).mockResolvedValue(mockResponse as never);

      const onSuccess = vi.fn();
      const onError = vi.fn();

      await ChatController.getRoom("room_1", onSuccess, onError);

      expect(ChatService.getRoom).toHaveBeenCalledWith("room_1");
      expect(onSuccess).toHaveBeenCalledWith(
        expect.objectContaining({ id: "room_1", title: "VIP Chat" }),
      );
    });
  });

  describe("updateRoom", () => {
    it("calls onSuccess with updated room", async () => {
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

      const onSuccess = vi.fn();
      const onError = vi.fn();

      await ChatController.updateRoom("room_1", formValues, onSuccess, onError);

      expect(ChatService.updateRoom).toHaveBeenCalledWith("room_1", formValues);
      expect(onSuccess).toHaveBeenCalledWith(
        expect.objectContaining({ id: "room_1", title: "Renamed Room" }),
      );
    });
  });

  describe("discardRoom", () => {
    it("calls onSuccess on discard room", async () => {
      const mockResponse = {
        data: { status: { code: 200, success: true, message: "OK" } },
      };

      vi.mocked(ChatService.discardRoom).mockResolvedValue(
        mockResponse as never,
      );

      const onSuccess = vi.fn();
      const onError = vi.fn();

      await ChatController.discardRoom("room_1", onSuccess, onError);

      expect(ChatService.discardRoom).toHaveBeenCalledWith("room_1");
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  describe("getMessages", () => {
    it("calls onSuccess with messages list and pagination", async () => {
      const mockMessages = [
        { id: "msg_1", content: "Hello", role: "user", room_id: "room_1" },
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

      const onSuccess = vi.fn();
      const onError = vi.fn();

      await ChatController.getMessages({ page: 1 }, onSuccess, onError);

      expect(ChatService.getMessages).toHaveBeenCalledWith({ page: 1 });
      expect(onSuccess).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ id: "msg_1" })]),
        expect.objectContaining({ total_count: 1 }),
      );
    });
  });

  describe("getMessage", () => {
    it("calls onSuccess with single message", async () => {
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

      const onSuccess = vi.fn();
      const onError = vi.fn();

      await ChatController.getMessage("msg_1", onSuccess, onError);

      expect(ChatService.getMessage).toHaveBeenCalledWith("msg_1");
      expect(onSuccess).toHaveBeenCalledWith(
        expect.objectContaining({ id: "msg_1", content: "Hello there" }),
      );
    });
  });

  describe("updateMessage", () => {
    it("calls onSuccess with updated message", async () => {
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

      const onSuccess = vi.fn();
      const onError = vi.fn();

      await ChatController.updateMessage("msg_1", formValues, onSuccess, onError);

      expect(ChatService.updateMessage).toHaveBeenCalledWith("msg_1", formValues);
      expect(onSuccess).toHaveBeenCalledWith(
        expect.objectContaining({ id: "msg_1" }),
      );
    });
  });

  describe("discardMessage", () => {
    it("calls onSuccess on discard message", async () => {
      const mockResponse = {
        data: { status: { code: 200, success: true, message: "OK" } },
      };

      vi.mocked(ChatService.discardMessage).mockResolvedValue(
        mockResponse as never,
      );

      const onSuccess = vi.fn();
      const onError = vi.fn();

      await ChatController.discardMessage("msg_1", onSuccess, onError);

      expect(ChatService.discardMessage).toHaveBeenCalledWith("msg_1");
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
