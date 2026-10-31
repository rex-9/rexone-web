// src/modules/ai/ai.controller.ts
import AiService from "./ai.service";
import {
  getApiError,
  parsePagyList,
  parseRecord,
} from "../../services/api.service";
import { IChatMeta, IChatRequest, IChatResult, IMessage, IRoom } from "./types";
import SocketService, { ISocketMessage } from "../../services/socket.service";
import { IApiPagination } from "../../models";
import { AppLocales, translate } from "../../locales";
import { AI_MESSAGE_STATUS, AI_SOCKET_EVENTS } from "./constants";
import { SpeechController } from "../speech";

const AI_SOCKET_EVENT_TYPES: readonly string[] = [
  AI_SOCKET_EVENTS.RESPONSE_READY,
  AI_SOCKET_EVENTS.RESPONSE_FAILED,
  AI_SOCKET_EVENTS.TTS_READY,
  AI_SOCKET_EVENTS.TTS_FAILED,
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

  subscribeToAiMessages(callback: (eventType: string) => void): () => void {
    const handleAiMessage = (event: ISocketMessage) => {
      const eventType =
        typeof event.data?.type === "string" ? event.data.type : "";
      const roomId =
        typeof event.data?.room_id === "string" ? event.data.room_id : "";

      if (
        event.type !== "notification" ||
        !AI_SOCKET_EVENT_TYPES.includes(eventType)
      ) {
        return;
      }

      if (roomId && this.currentRoomId && roomId !== this.currentRoomId) {
        return;
      }

      callback(eventType);
    };

    SocketService.addListener(handleAiMessage);
    return () => SocketService.removeListener(handleAiMessage);
  }

  async queueTextToSpeech(messageId: string): Promise<{
    success: boolean;
    message?: string;
    error?: string;
  }> {
    return SpeechController.queueTextToSpeech(messageId);
  }

  async getRooms(params?: { page?: number; limit?: number }): Promise<{
    success: boolean;
    rooms: IRoom[];
    pagination?: IApiPagination | null;
    error?: string;
  }> {
    const response = await AiService.getRooms(params);
    const { status, data, meta } = response.data || {};

    if (status?.success && data) {
      const { records, pagination } = parsePagyList<IRoom>(response);
      return {
        success: true,
        rooms: records,
        pagination: pagination ?? meta?.pagination,
      };
    }

    return {
      success: false,
      rooms: [],
      pagination: null,
      error: getApiError(response, translate(AppLocales.Ai.Errors.LoadRooms)),
    };
  }

  async createRoom(title: string): Promise<{
    success: boolean;
    room?: IRoom;
    error?: string;
  }> {
    const response = await AiService.createRoom(title);
    const { status, data } = response.data || {};

    if (status?.success && data) {
      const parsedRoom = parseRecord<IRoom>(data);
      this.currentRoomId = parsedRoom.id;
      return {
        success: true,
        room: parsedRoom,
      };
    }

    return {
      success: false,
      error: getApiError(response, translate(AppLocales.Ai.Errors.CreateRoom)),
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
      const { records: messages } = parsePagyList(response);
      const rId = messages[0]?.room_id ?? roomId ?? "";
      const processing = messages.some((m) =>
        AI_PROCESSING_MESSAGE_STATUSES.includes(m.metadata?.status ?? ""),
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
      error: getApiError(response, translate(AppLocales.Ai.Errors.LoadHistory)),
    };
  }

  async chat(
    message: string,
    roomId: string | null = null,
  ): Promise<IChatResult> {
    const request: IChatRequest = { message };
    const activeRoomId = roomId || this.currentRoomId;
    if (activeRoomId) {
      request.room_id = activeRoomId;
    }

    const response = await AiService.chat(request);
    const { status, data, meta } = response.data || {};
    const chatMeta = meta as IChatMeta | undefined;

    if (status?.success && data) {
      const rawMessages = chatMeta?.messages;
      const parsedMessages =
        Array.isArray(rawMessages) && rawMessages.length > 0
          ? rawMessages.map((item) => parseRecord<IMessage>(item))
          : [parseRecord<IMessage>(data)];

      const resolvedRoomId =
        chatMeta?.room_id ||
        parsedMessages[0]?.room_id ||
        roomId ||
        this.currentRoomId ||
        "";

      if (resolvedRoomId) {
        this.currentRoomId = resolvedRoomId;
      }

      return {
        success: true,
        messages: parsedMessages,
        roomId: resolvedRoomId,
        notice: status.message || undefined,
      };
    }

    return {
      success: false,
      messages: [],
      error: getApiError(response, translate(AppLocales.Ai.Errors.GetResponse)),
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
      error: getApiError(
        response,
        translate(AppLocales.Ai.Errors.ClearHistory),
      ),
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

    if (status?.success && data) {
      const parsedRoom = parseRecord<IRoom>(data);
      return {
        success: true,
        title: parsedRoom.title || title,
      };
    }

    return {
      success: false,
      error: getApiError(response, translate(AppLocales.Ai.Errors.RenameRoom)),
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
      error: getApiError(response, translate(AppLocales.Ai.Errors.DeleteRoom)),
    };
  }
}

export default new AiController();
