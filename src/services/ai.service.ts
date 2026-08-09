// src/services/ai.service.ts
import { api } from "./api.service";
import { IApiEnvelope, IApiResponse, IJsonApiResource } from "../models";
import AppRoutes from "../AppRoutes";

export interface IChatRequest {
  message: string;
  room_id?: string;
  system_prompt?: string;
  temperature?: number;
  max_tokens?: number;
}

export interface IChatResponse {
  response: string;
  room_id: string;
  usage?: any;
}

export interface IMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface IHistoryResponse {
  messages: IJsonApiResource<IMessage>[];
  room_id: string;
  room_title: string;
}

export interface IRoom {
  id: string;
  title: string;
  message_count: number;
  last_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface IRoomsResponse {
  rooms: IRoom[];
}

class AiService {
  // Chat
  async chat(
    request: IChatRequest,
  ): Promise<IApiResponse<IApiEnvelope<IChatResponse>>> {
    const response = await api.post<IChatResponse>(
      AppRoutes.server.protected.AI_CHAT,
      request,
    );
    return response;
  }

  // History
  async getHistory(
    roomId?: string,
  ): Promise<IApiResponse<IApiEnvelope<IHistoryResponse>>> {
    const params: Record<string, string> = {};
    if (roomId) params.room_id = roomId;

    const response = await api.get<IHistoryResponse>(
      AppRoutes.server.protected.AI_HISTORY,
      params,
    );
    return response;
  }

  // Clear
  async clearHistory(
    roomId?: string,
  ): Promise<IApiResponse<IApiEnvelope<null>>> {
    const params: Record<string, string> = {};
    if (roomId) params.room_id = roomId;

    const response = await api.delete<null>(
      AppRoutes.server.protected.AI_CLEAR,
      params,
    );
    return response;
  }

  // Rename
  async renameRoom(
    roomId: string,
    title: string,
  ): Promise<IApiResponse<IApiEnvelope<{ title: string }>>> {
    const response = await api.put<{ title: string }>(
      AppRoutes.server.protected.AI_RENAME,
      { room_id: roomId, title },
    );
    return response;
  }

  // Rooms
  async getRooms(): Promise<IApiResponse<IApiEnvelope<IRoomsResponse>>> {
    const response = await api.get<IRoomsResponse>(
      AppRoutes.server.protected.AI_ROOMS,
    );
    return response;
  }

  async createRoom(
    title: string,
  ): Promise<IApiResponse<IApiEnvelope<{ room: IRoom }>>> {
    const response = await api.post<{ room: IRoom }>(
      AppRoutes.server.protected.AI_ROOMS,
      { title },
    );
    return response;
  }

  async deleteRoom(roomId: string): Promise<IApiResponse<IApiEnvelope<null>>> {
    const response = await api.delete<null>(
      AppRoutes.server.protected.AI_DELETE_ROOM.replace(":id", roomId),
    );
    return response;
  }
}

export default new AiService();
