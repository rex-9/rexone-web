// src/controllers/ai.controller.ts
import AiService from "./ai.service";
import { parseFromList } from "../../services/api.service";
import { IMessage, IRoom } from "./types";
import SocketService, { ISocketMessage } from "../../services/socket.service";
import { IApiPagination } from "../../models";
import { AI_DEFAULTS, AI_MESSAGE_STATUS, AI_SOCKET_EVENTS } from "./constants";

class AiController {
  private currentRoomId: string | null = null;

  setRoomId(id: string) {
    this.currentRoomId = id;
  }

  getCurrentRoomId(): string | null {
    return this.currentRoomId;
  }

  subscribeToAiMessages(callback: () => void): () => void {
    const handleAiMessage = (event: ISocketMessage) => {
      const eventType = typeof event.data?.type === "string" ? event.data.type : "";
      const roomId = typeof event.data?.room_id === "string" ? event.data.room_id : "";

      if (
        event.type !== "notification" ||
        ![
          AI_SOCKET_EVENTS.RESPONSE_READY,
          AI_SOCKET_EVENTS.RESPONSE_FAILED,
        ].includes(eventType as any) ||
        roomId !== this.currentRoomId
      ) {
        return;
      }

      callback();
    };

    SocketService.addListener(handleAiMessage);
    return () => SocketService.removeListener(handleAiMessage);
  }

  async getRooms(params?: { page?: number; limit?: number }): Promise<{
    success: boolean;
    rooms: IRoom[];
    pagination?: IApiPagination | null;
    error?: string;
  }> {
    const response = await AiService.getRooms(params);
    const { status, data, meta } = response.data || {};

    if (status?.success && data?.rooms) {
      return {
        success: true,
        rooms: data.rooms,
        pagination: meta?.pagination,
      };
    }

    return {
      success: false,
      rooms: [],
      pagination: null,
      error: status?.error || response.error || "Failed to load rooms",
    };
  }

  async createRoom(title: string): Promise<{
    success: boolean;
    room?: IRoom;
    error?: string;
  }> {
    const response = await AiService.createRoom(title);
    const { status, data } = response.data || {};

    if (status?.success && data?.room) {
      this.currentRoomId = data.room.id;
      return {
        success: true,
        room: data.room,
      };
    }

    return {
      success: false,
      error: status?.error || response.error || "Failed to create room",
    };
  }

  async loadHistory(
    roomId: string | null = null,
    params?: { page?: number; limit?: number },
  ): Promise<{
    success: boolean;
    messages: IMessage[];
    roomId: string;
    processing: boolean;
    pagination?: IApiPagination | null;
    error?: string;
  }> {
    const response = await AiService.getHistory(
      roomId || this.currentRoomId || undefined,
      params,
    );
    const { status, data, meta } = response.data || {};

    if (status?.success && data) {
      const messages = parseFromList<IMessage>(data);
      const rId = messages[0]?.room_id ?? roomId ?? "";
      const processing = messages.some((m) =>
        [
          AI_MESSAGE_STATUS.QUEUED,
          AI_MESSAGE_STATUS.PROCESSING,
          AI_MESSAGE_STATUS.RETRYING,
        ].includes((m.metadata?.status ?? "") as any),
      );
      this.currentRoomId = rId || null;
      return {
        success: true,
        messages,
        roomId: rId,
        processing,
        pagination: meta?.pagination,
      };
    }

    return {
      success: false,
      messages: [],
      roomId: roomId || this.currentRoomId || "",
      processing: false,
      pagination: null,
      error: status?.error || response.error || "Failed to load history",
    };
  }

  async chat(
    message: string,
    roomId: string | null = null,
  ): Promise<{
    success: boolean;
    message?: IMessage;
    roomId?: string;
    error?: string;
  }> {
    const response = await AiService.chat({
      message,
      room_id: roomId || this.currentRoomId || undefined,
      temperature: AI_DEFAULTS.TEMPERATURE,
      max_tokens: AI_DEFAULTS.MAX_TOKENS,
    });

    const { status, data } = response.data || {};

    if (status?.success && data?.message) {
      this.currentRoomId = data.room_id;
      return {
        success: true,
        message: data.message,
        roomId: data.room_id,
      };
    }

    return {
      success: false,
      error: status?.error || response.error || "Failed to get AI response",
    };
  }

  async clearHistory(roomId: string | null = null): Promise<{
    success: boolean;
    error?: string;
  }> {
    const response = await AiService.clearHistory(
      roomId || this.currentRoomId || undefined,
    );
    const { status } = response.data || {};

    if (status?.success) {
      return { success: true };
    }

    return {
      success: false,
      error: status?.error || response.error || "Failed to clear history",
    };
  }

  async renameRoom(
    roomId: string,
    title: string,
  ): Promise<{
    success: boolean;
    title?: string;
    error?: string;
  }> {
    const response = await AiService.renameRoom(roomId, title);
    const { status, data } = response.data || {};

    if (status?.success && data?.title) {
      return {
        success: true,
        title: data.title,
      };
    }

    return {
      success: false,
      error: status?.error || response.error || "Failed to rename room",
    };
  }

  async deleteRoom(roomId: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    const response = await AiService.deleteRoom(roomId);
    const { status } = response.data || {};

    if (status?.success) {
      if (this.currentRoomId === roomId) {
        this.currentRoomId = null;
      }
      return { success: true };
    }

    return {
      success: false,
      error: status?.error || response.error || "Failed to delete room",
    };
  }
}

export default new AiController();
