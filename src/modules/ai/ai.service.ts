// src/modules/ai/ai.service.ts
import { IApiEnvelope, IApiResponse, IJsonApiResource } from "../../models";
import AppRoutes from "../../AppRoutes";
import { api } from "../../services";
import { IChatRequest, IMessage, IRoom } from "./types";

class AiService {
  // Chat
  async chat(
    request: IChatRequest,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IMessage>>>> {
    return api.post<IJsonApiResource<IMessage>>(
      AppRoutes.server.protected.AI_CHAT,
      request,
    );
  }

  // History
  async getHistory(
    roomId?: string,
    params?: { page?: number; limit?: number },
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IMessage>[]>>> {
    const queryParams: Record<string, string | number | undefined> = {
      ...params,
    };
    if (roomId) queryParams.room_id = roomId;

    return api.get<IJsonApiResource<IMessage>[]>(
      AppRoutes.server.protected.AI_HISTORY,
      queryParams,
    );
  }

  // Clear
  async clearHistory(
    roomId?: string,
  ): Promise<IApiResponse<IApiEnvelope<null>>> {
    const params: Record<string, string> = {};
    if (roomId) params.room_id = roomId;

    return api.delete<null>(AppRoutes.server.protected.AI_CLEAR, params);
  }

  // Rename
  async renameRoom(
    roomId: string,
    title: string,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IRoom>>>> {
    return api.put<IJsonApiResource<IRoom>>(
      AppRoutes.withId(AppRoutes.server.protected.AI_ROOM, roomId),
      { title },
    );
  }

  // Rooms
  async getRooms(params?: {
    page?: number;
    limit?: number,
  }): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IRoom>[]>>> {
    return api.get<IJsonApiResource<IRoom>[]>(
      AppRoutes.server.protected.AI_ROOMS,
      params,
    );
  }

  async createRoom(
    title: string,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IRoom>>>> {
    return api.post<IJsonApiResource<IRoom>>(
      AppRoutes.server.protected.AI_ROOMS,
      { title },
    );
  }

  async deleteRoom(roomId: string): Promise<IApiResponse<IApiEnvelope<null>>> {
    return api.delete<null>(
      AppRoutes.withId(AppRoutes.server.protected.AI_DELETE_ROOM, roomId),
    );
  }
}

export default new AiService();
