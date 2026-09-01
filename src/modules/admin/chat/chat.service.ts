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

type AdminChatRoomResponse = IAdminChatRoom | { room: IAdminChatRoom };
type AdminChatMessageResponse = IAdminChatMessage | { message: IAdminChatMessage };

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
  ): Promise<IApiResponse<IApiEnvelope<AdminChatRoomResponse>>> {
    return api.get<AdminChatRoomResponse>(
      AppRoutes.withId(AppRoutes.server.protected.admin.CHAT_ROOM_DETAIL, id),
    );
  }

  async updateRoom(
    id: string,
    values: IAdminChatRoomFormValues,
  ): Promise<IApiResponse<IApiEnvelope<AdminChatRoomResponse>>> {
    return api.put<AdminChatRoomResponse>(
      AppRoutes.withId(AppRoutes.server.protected.admin.CHAT_ROOM_DETAIL, id),
      { room: values },
    );
  }

  async discardRoom(id: string): Promise<IApiResponse<IApiEnvelope<null>>> {
    return api.delete<null>(
      AppRoutes.withId(AppRoutes.server.protected.admin.CHAT_ROOM_DETAIL, id),
    );
  }

  async deleteRoom(id: string): Promise<IApiResponse<IApiEnvelope<null>>> {
    return this.discardRoom(id);
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
  ): Promise<IApiResponse<IApiEnvelope<AdminChatMessageResponse>>> {
    return api.get<AdminChatMessageResponse>(
      AppRoutes.withId(AppRoutes.server.protected.admin.CHAT_MESSAGE_DETAIL, id),
    );
  }

  async updateMessage(
    id: string,
    values: IAdminChatMessageFormValues,
  ): Promise<IApiResponse<IApiEnvelope<AdminChatMessageResponse>>> {
    return api.put<AdminChatMessageResponse>(
      AppRoutes.withId(AppRoutes.server.protected.admin.CHAT_MESSAGE_DETAIL, id),
      { message: values },
    );
  }

  async discardMessage(id: string): Promise<IApiResponse<IApiEnvelope<null>>> {
    return api.delete<null>(
      AppRoutes.withId(AppRoutes.server.protected.admin.CHAT_MESSAGE_DETAIL, id),
    );
  }

  async deleteMessage(id: string): Promise<IApiResponse<IApiEnvelope<null>>> {
    return this.discardMessage(id);
  }
}

export default new ChatService();
