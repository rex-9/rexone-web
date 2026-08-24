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
      AppRoutes.server.protected.ADMIN_CHAT_ROOMS,
      params,
    );
  }

  async getRoom(
    id: string,
  ): Promise<IApiResponse<IApiEnvelope<{ room: IAdminChatRoom }>>> {
    return api.get<{ room: IAdminChatRoom }>(
      AppRoutes.withId(AppRoutes.server.protected.ADMIN_CHAT_ROOM_DETAIL, id),
    );
  }

  async updateRoom(
    id: string,
    values: IAdminChatRoomFormValues,
  ): Promise<IApiResponse<IApiEnvelope<{ room: IAdminChatRoom }>>> {
    return api.put<{ room: IAdminChatRoom }>(
      AppRoutes.withId(AppRoutes.server.protected.ADMIN_CHAT_ROOM_DETAIL, id),
      { room: values },
    );
  }

  async deleteRoom(id: string): Promise<IApiResponse<IApiEnvelope<null>>> {
    return api.delete<null>(
      AppRoutes.withId(AppRoutes.server.protected.ADMIN_CHAT_ROOM_DETAIL, id),
    );
  }

  async getMessages(params?: {
    page?: number;
    limit?: number;
  }): Promise<
    IApiResponse<IApiEnvelope<IJsonApiResource<IAdminChatMessage>[]>>
  > {
    return api.get<IJsonApiResource<IAdminChatMessage>[]>(
      AppRoutes.server.protected.ADMIN_CHAT_MESSAGES,
      params,
    );
  }

  async getMessage(
    id: string,
  ): Promise<IApiResponse<IApiEnvelope<{ message: IAdminChatMessage }>>> {
    return api.get<{ message: IAdminChatMessage }>(
      AppRoutes.withId(AppRoutes.server.protected.ADMIN_CHAT_MESSAGE_DETAIL, id),
    );
  }

  async updateMessage(
    id: string,
    values: IAdminChatMessageFormValues,
  ): Promise<IApiResponse<IApiEnvelope<{ message: IAdminChatMessage }>>> {
    return api.put<{ message: IAdminChatMessage }>(
      AppRoutes.withId(AppRoutes.server.protected.ADMIN_CHAT_MESSAGE_DETAIL, id),
      { message: values },
    );
  }

  async deleteMessage(id: string): Promise<IApiResponse<IApiEnvelope<null>>> {
    return api.delete<null>(
      AppRoutes.withId(AppRoutes.server.protected.ADMIN_CHAT_MESSAGE_DETAIL, id),
    );
  }
}

export default new ChatService();
