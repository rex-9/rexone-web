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
  IAdminChatListParams,
} from "./types";

class ChatService {
  async getRooms(
    params?: IAdminChatListParams,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IAdminChatRoom>[]>>> {
    return api.get<IJsonApiResource<IAdminChatRoom>[]>(
      AppRoutes.server.protected.admin.CHAT_ROOMS,
      params as Record<string, unknown>,
    );
  }

  async getRoom(
    id: string,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IAdminChatRoom>>>> {
    return api.get<IJsonApiResource<IAdminChatRoom>>(
      AppRoutes.withId(AppRoutes.server.protected.admin.CHAT_ROOM_DETAIL, id),
    );
  }

  async updateRoom(
    id: string,
    values: IAdminChatRoomFormValues,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IAdminChatRoom>>>> {
    return api.put<IJsonApiResource<IAdminChatRoom>>(
      AppRoutes.withId(AppRoutes.server.protected.admin.CHAT_ROOM_DETAIL, id),
      { room: values },
    );
  }

  async discardRoom(id: string): Promise<IApiResponse<IApiEnvelope<null>>> {
    return api.post<null>(
      AppRoutes.withId(AppRoutes.server.protected.admin.CHAT_ROOM_DISCARD, id),
    );
  }

  async undiscardRoom(
    id: string,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IAdminChatRoom>>>> {
    return api.post<IJsonApiResource<IAdminChatRoom>>(
      AppRoutes.withId(AppRoutes.server.protected.admin.CHAT_ROOM_UNDISCARD, id),
    );
  }

  async deleteRoom(id: string): Promise<IApiResponse<IApiEnvelope<null>>> {
    return api.delete<null>(
      AppRoutes.withId(AppRoutes.server.protected.admin.CHAT_ROOM_DETAIL, id),
    );
  }

  async getMessages(
    params?: IAdminChatListParams,
  ): Promise<
    IApiResponse<IApiEnvelope<IJsonApiResource<IAdminChatMessage>[]>>
  > {
    return api.get<IJsonApiResource<IAdminChatMessage>[]>(
      AppRoutes.server.protected.admin.CHAT_MESSAGES,
      params as Record<string, unknown>,
    );
  }

  async getMessage(
    id: string,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IAdminChatMessage>>>> {
    return api.get<IJsonApiResource<IAdminChatMessage>>(
      AppRoutes.withId(AppRoutes.server.protected.admin.CHAT_MESSAGE_DETAIL, id),
    );
  }

  async updateMessage(
    id: string,
    values: IAdminChatMessageFormValues,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IAdminChatMessage>>>> {
    return api.put<IJsonApiResource<IAdminChatMessage>>(
      AppRoutes.withId(AppRoutes.server.protected.admin.CHAT_MESSAGE_DETAIL, id),
      { message: values },
    );
  }

  async discardMessage(id: string): Promise<IApiResponse<IApiEnvelope<null>>> {
    return api.post<null>(
      AppRoutes.withId(AppRoutes.server.protected.admin.CHAT_MESSAGE_DISCARD, id),
    );
  }

  async undiscardMessage(
    id: string,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IAdminChatMessage>>>> {
    return api.post<IJsonApiResource<IAdminChatMessage>>(
      AppRoutes.withId(
        AppRoutes.server.protected.admin.CHAT_MESSAGE_UNDISCARD,
        id,
      ),
    );
  }

  async deleteMessage(id: string): Promise<IApiResponse<IApiEnvelope<null>>> {
    return api.delete<null>(
      AppRoutes.withId(AppRoutes.server.protected.admin.CHAT_MESSAGE_DETAIL, id),
    );
  }
}

export default new ChatService();
