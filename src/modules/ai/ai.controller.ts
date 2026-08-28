// src/controllers/ai.controller.ts
import AiService from "./ai.service";
import { getApiError, parsePagyList } from "../../services/api.service";
import { IMessage, IRoom } from "./types";
import SocketService, { ISocketMessage } from "../../services/socket.service";
import { IApiPagination } from "../../models";
import { AppLocales, translate } from "../../locales";
import { AI_DEFAULTS, AI_MESSAGE_STATUS, AI_SOCKET_EVENTS } from "./constants";

const AI_RESPONSE_EVENT_TYPES: readonly string[] = [
  AI_SOCKET_EVENTS.RESPONSE_READY,
  AI_SOCKET_EVENTS.RESPONSE_FAILED,
];

const AI_PROCESSING_MESSAGE_STATUSES: readonly string[] = [
  AI_MESSAGE_STATUS.QUEUED,
  AI_MESSAGE_STATUS.PROCESSING,
  AI_MESSAGE_STATUS.RETRYING,
];

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
        !AI_RESPONSE_EVENT_TYPES.includes(eventType) ||
        roomId !== this.currentRoomId
      ) {
        return;
      }

      callback();
    };

    SocketService.addListener(handleAiMessage);
    return () => SocketService.removeListener(handleAiMessage);
  }

  async getRooms(
    onSuccess: (rooms: IRoom[], pagination?: IApiPagination | null) => void,
    onError: (error: string) => void,
    params?: { page?: number; limit?: number },
  ): Promise<void> {
    const response = await AiService.getRooms(params);
    const { status, data, meta } = response.data || {};

    if (status?.success && data?.rooms) {
      onSuccess(data.rooms, meta?.pagination);
    } else {
      onError(getApiError(response, translate(AppLocales.Ai.Errors.LoadRooms)));
    }
  }

  async createRoom(
    title: string,
    onSuccess: (room: IRoom) => void,
    onError: (error: string) => void,
  ): Promise<void> {
    const response = await AiService.createRoom(title);
    const { status, data } = response.data || {};

    if (status?.success && data?.room) {
      this.currentRoomId = data.room.id;
      onSuccess(data.room);
    } else {
      onError(getApiError(response, translate(AppLocales.Ai.Errors.CreateRoom)));
    }
  }

  async loadHistory(
    roomId: string | null = null,
    onSuccess: (
      messages: IMessage[],
      roomId: string,
      processing: boolean,
      pagination?: IApiPagination | null,
    ) => void,
    onError: (error: string) => void,
    params?: { page?: number; limit?: number },
  ): Promise<void> {
    const response = await AiService.getHistory(
      roomId || this.currentRoomId || undefined,
      params,
    );
    const { status, data } = response.data || {};

    if (status?.success && data) {
      const { records: messages, pagination } = parsePagyList(response);
      const rId = messages[0]?.room_id ?? roomId ?? "";
      const processing = messages.some((m) =>
        AI_PROCESSING_MESSAGE_STATUSES.includes(m.metadata?.status ?? ""),
      );
      this.currentRoomId = rId || null;
      onSuccess(messages, rId, processing, pagination);
    } else {
      onError(getApiError(response, translate(AppLocales.Ai.Errors.LoadHistory)));
    }
  }

  async chat(
    message: string,
    roomId: string | null = null,
    onSuccess: (message: IMessage, roomId: string) => void,
    onError: (error: string) => void,
  ): Promise<void> {
    const response = await AiService.chat({
      message,
      room_id: roomId || this.currentRoomId || undefined,
      temperature: AI_DEFAULTS.TEMPERATURE,
      max_tokens: AI_DEFAULTS.MAX_TOKENS,
    });

    const { status, data } = response.data || {};

    if (status?.success && data?.message) {
      this.currentRoomId = data.room_id;
      onSuccess(data.message, data.room_id);
    } else {
      onError(getApiError(response, translate(AppLocales.Ai.Errors.GetResponse)));
    }
  }

  async clearHistory(
    roomId: string | null = null,
    onSuccess?: () => void,
    onError?: (error: string) => void,
  ): Promise<void> {
    const response = await AiService.clearHistory(
      roomId || this.currentRoomId || undefined,
    );
    const { status } = response.data || {};

    if (status?.success) {
      onSuccess?.();
    } else {
      onError?.(getApiError(response, translate(AppLocales.Ai.Errors.ClearHistory)));
    }
  }

  async renameRoom(
    roomId: string,
    title: string,
    onSuccess: (title: string) => void,
    onError: (error: string) => void,
  ): Promise<void> {
    const response = await AiService.renameRoom(roomId, title);
    const { status, data } = response.data || {};

    if (status?.success && data?.title) {
      onSuccess(data.title);
    } else {
      onError(getApiError(response, translate(AppLocales.Ai.Errors.RenameRoom)));
    }
  }

  async deleteRoom(
    roomId: string,
    onSuccess: () => void,
    onError: (error: string) => void,
  ): Promise<void> {
    const response = await AiService.deleteRoom(roomId);
    const { status } = response.data || {};

    if (status?.success) {
      if (this.currentRoomId === roomId) {
        this.currentRoomId = null;
      }
      onSuccess();
    } else {
      onError(getApiError(response, translate(AppLocales.Ai.Errors.DeleteRoom)));
    }
  }
}

export default new AiController();
