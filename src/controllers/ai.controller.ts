// src/controllers/ai.controller.ts
import AiService, { IMessage, IRoom } from "../services/ai.service";

class AiController {
  private currentRoomId: string | null = null;

  setRoomId(id: string) {
    this.currentRoomId = id;
  }

  getCurrentRoomId(): string | null {
    return this.currentRoomId;
  }

  async getRooms(
    onSuccess: (rooms: IRoom[]) => void,
    onError: (error: string) => void,
  ): Promise<void> {
    try {
      const response = await AiService.getRooms();
      const { status, data } = response.data || {};

      if (status?.success && data?.rooms) {
        onSuccess(data.rooms);
      } else {
        onError(status?.error || "Failed to load rooms");
      }
    } catch (error) {
      onError("An error occurred. Please try again.");
    }
  }

  async createRoom(
    title: string,
    onSuccess: (room: IRoom) => void,
    onError: (error: string) => void,
  ): Promise<void> {
    try {
      const response = await AiService.createRoom(title);
      const { status, data } = response.data || {};

      if (status?.success && data?.room) {
        this.currentRoomId = data.room.id;
        onSuccess(data.room);
      } else {
        onError(status?.error || "Failed to create room");
      }
    } catch (error) {
      onError("An error occurred. Please try again.");
    }
  }

  async loadHistory(
    roomId: string | null = null,
    onSuccess: (
      messages: IMessage[],
      roomId: string,
      roomTitle: string,
    ) => void,
    onError: (error: string) => void,
  ): Promise<void> {
    try {
      const response = await AiService.getHistory(
        roomId || this.currentRoomId || undefined,
      );
      const { status, data } = response.data || {};

      if (status?.success && data?.messages) {
        this.currentRoomId = data.room_id;
        onSuccess(data.messages, data.room_id, data.room_title);
      } else {
        onError(status?.error || "Failed to load history");
      }
    } catch (error) {
      onError("An error occurred. Please try again.");
    }
  }

  async chat(
    message: string,
    roomId: string | null = null,
    onSuccess: (response: string, roomId: string) => void,
    onError: (error: string) => void,
  ): Promise<void> {
    try {
      const response = await AiService.chat({
        message,
        room_id: roomId || this.currentRoomId || undefined,
        temperature: 0.7,
        max_tokens: 2000,
      });

      const { status, data } = response.data || {};

      if (status?.success && data?.response) {
        this.currentRoomId = data.room_id;
        onSuccess(data.response, data.room_id);
      } else {
        onError(status?.error || "Failed to get AI response");
      }
    } catch (error) {
      onError("An error occurred. Please try again.");
    }
  }

  async clearHistory(
    roomId: string | null = null,
    onSuccess?: () => void,
    onError?: (error: string) => void,
  ): Promise<void> {
    try {
      const response = await AiService.clearHistory(
        roomId || this.currentRoomId || undefined,
      );
      const { status } = response.data || {};

      if (status?.success) {
        onSuccess?.();
      } else {
        onError?.(status?.error || "Failed to clear history");
      }
    } catch (error) {
      onError?.("An error occurred. Please try again.");
    }
  }

  async renameRoom(
    roomId: string,
    title: string,
    onSuccess: (title: string) => void,
    onError: (error: string) => void,
  ): Promise<void> {
    try {
      const response = await AiService.renameRoom(roomId, title);
      const { status, data } = response.data || {};

      if (status?.success && data?.title) {
        onSuccess(data.title);
      } else {
        onError(status?.error || "Failed to rename room");
      }
    } catch (error) {
      onError("An error occurred. Please try again.");
    }
  }

  async deleteRoom(
    roomId: string,
    onSuccess: () => void,
    onError: (error: string) => void,
  ): Promise<void> {
    try {
      const response = await AiService.deleteRoom(roomId);
      const { status } = response.data || {};

      if (status?.success) {
        if (this.currentRoomId === roomId) {
          this.currentRoomId = null;
        }
        onSuccess();
      } else {
        onError(status?.error || "Failed to delete room");
      }
    } catch (error) {
      onError("An error occurred. Please try again.");
    }
  }
}

export default new AiController();
