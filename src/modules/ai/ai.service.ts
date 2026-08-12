// src/services/ai.service.ts
import { IApiEnvelope, IApiResponse } from "../../models";
import AppRoutes from "../../AppRoutes";
import { api } from "../../services";
import {
  IChatRequest,
  IChatResponse,
  IHistoryResponse,
  IRoom,
  IRoomsResponse,
} from "./types";

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
