import AppRoutes from "../../../AppRoutes";
import {
  IApiEnvelope,
  IApiResponse,
  IJsonApiResource,
} from "../../../models";
import { api } from "../../../services";
import {
  IAdminChatMessage,
  IAdminChatMessageFormValues,
  IAdminChatRoom,
  IAdminChatRoomFormValues,
} from "./types";

class ChatService {
  async getRooms(params?: {
    page?: number;
    limit?: number;
  }): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IAdminChatRoom>[]>>> {
    return api.get<IJsonApiResource<IAdminChatRoom>[]>(
      AppRoutes.server.protected.admin.CHAT_ROOMS,
      params,
    );
  }

  async getRoom(
    id: string,
  ): Promise<IApiResponse<IApiEnvelope<IAdminChatRoom>>> {
    return api.get<IAdminChatRoom>(
      AppRoutes.withId(AppRoutes.server.protected.admin.CHAT_ROOM_DETAIL, id),
    );
  }

  async updateRoom(
    id: string,
    values: IAdminChatRoomFormValues,
  ): Promise<IApiResponse<IApiEnvelope<IAdminChatRoom>>> {
    return api.put<IAdminChatRoom>(
      AppRoutes.withId(AppRoutes.server.protected.admin.CHAT_ROOM_DETAIL, id),
      { room: values },
    );
  }

  async deleteRoom(id: string): Promise<IApiResponse<IApiEnvelope<null>>> {
    return api.delete<null>(
      AppRoutes.withId(AppRoutes.server.protected.admin.CHAT_ROOM_DETAIL, id),
    );
  }

  async getMessages(params?: {
    page?: number;
    limit?: number;
  }): Promise<
    IApiResponse<IApiEnvelope<IJsonApiResource<IAdminChatMessage>[]>>
  > {
    return api.get<IJsonApiResource<IAdminChatMessage>[]>(
      AppRoutes.server.protected.admin.CHAT_MESSAGES,
      params,
    );
  }

  async getMessage(
    id: string,
  ): Promise<IApiResponse<IApiEnvelope<IAdminChatMessage>>> {
    return api.get<IAdminChatMessage>(
      AppRoutes.withId(AppRoutes.server.protected.admin.CHAT_MESSAGE_DETAIL, id),
    );
  }

  async updateMessage(
    id: string,
    values: IAdminChatMessageFormValues,
  ): Promise<IApiResponse<IApiEnvelope<IAdminChatMessage>>> {
    return api.put<IAdminChatMessage>(
      AppRoutes.withId(AppRoutes.server.protected.admin.CHAT_MESSAGE_DETAIL, id),
      { message: values },
    );
  }

  async deleteMessage(id: string): Promise<IApiResponse<IApiEnvelope<null>>> {
    return api.delete<null>(
      AppRoutes.withId(AppRoutes.server.protected.admin.CHAT_MESSAGE_DETAIL, id),
    );
  }
}

export default new ChatService();
