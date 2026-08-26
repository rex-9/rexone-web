import { IApiPagination } from "../../../models";
import { AppLocales, translate } from "../../../locales";
import {
  getApiError,
  parsePageList,
  parseRecord,
} from "../../../services/api.service";
import ChatService from "./chat.service";
import {
  IAdminChatMessage,
  IAdminChatMessageFormValues,
  IAdminChatRoom,
  IAdminChatRoomFormValues,
} from "./types";

class ChatController {
  async getRooms(
    params: { page?: number; limit?: number },
    onSuccess?: (rooms: IAdminChatRoom[], pagination?: IApiPagination) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
      const response = await ChatService.getRooms(params);
      const { status, data } = response.data || {};

      if (!status?.success || !data) {
        onError?.(
          getApiError(response, translate(AppLocales.Admin.Chat.Errors.LoadRooms)),
        );
        return;
      }

      const { records, pagination } = parsePageList(response);
      onSuccess?.(records, pagination ?? undefined);
  }

  async deleteRoom(
    id: string,
    onSuccess?: () => void,
    onError?: (error: string) => void,
  ): Promise<void> {
    const response = await ChatService.deleteRoom(id);
    const { status } = response.data || {};

    if (!status?.success) {
      onError?.(
        getApiError(response, translate(AppLocales.Admin.Chat.Errors.DeleteRoom)),
      );
      return;
    }

    onSuccess?.();
  }

  async getRoom(
    id: string,
    onSuccess?: (room: IAdminChatRoom) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
      const response = await ChatService.getRoom(id);
      const { status, data } = response.data || {};

      if (!status?.success || !data) {
        onError?.(
          getApiError(response, translate(AppLocales.Admin.Chat.Errors.LoadRoom)),
        );
        return;
      }

      onSuccess?.(parseRecord("room" in data ? data.room : data));
  }

  async updateRoom(
    id: string,
    values: IAdminChatRoomFormValues,
    onSuccess?: (room: IAdminChatRoom) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
      const response = await ChatService.updateRoom(id, values);
      const { status, data } = response.data || {};

      if (!status?.success || !data) {
        onError?.(
          getApiError(response, translate(AppLocales.Admin.Chat.Errors.UpdateRoom)),
        );
        return;
      }

      onSuccess?.(parseRecord("room" in data ? data.room : data));
  }

  async getMessages(
    params: { page?: number; limit?: number },
    onSuccess?: (
      messages: IAdminChatMessage[],
      pagination?: IApiPagination,
    ) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
      const response = await ChatService.getMessages(params);
      const { status, data } = response.data || {};

      if (!status?.success || !data) {
        onError?.(
          getApiError(
            response,
            translate(AppLocales.Admin.Chat.Errors.LoadMessages),
          ),
        );
        return;
      }

      const { records, pagination } = parsePageList(response);
      onSuccess?.(records, pagination ?? undefined);
  }

  async deleteMessage(
    id: string,
    onSuccess?: () => void,
    onError?: (error: string) => void,
  ): Promise<void> {
    const response = await ChatService.deleteMessage(id);
    const { status } = response.data || {};

    if (!status?.success) {
      onError?.(
        getApiError(
          response,
          translate(AppLocales.Admin.Chat.Errors.DeleteMessage),
        ),
      );
      return;
    }

    onSuccess?.();
  }

  async getMessage(
    id: string,
    onSuccess?: (message: IAdminChatMessage) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
      const response = await ChatService.getMessage(id);
      const { status, data } = response.data || {};

      if (!status?.success || !data) {
        onError?.(
          getApiError(response, translate(AppLocales.Admin.Chat.Errors.LoadMessage)),
        );
        return;
      }

      onSuccess?.(parseRecord("message" in data ? data.message : data));
  }

  async updateMessage(
    id: string,
    values: IAdminChatMessageFormValues,
    onSuccess?: (message: IAdminChatMessage) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
      const response = await ChatService.updateMessage(id, values);
      const { status, data } = response.data || {};

      if (!status?.success || !data) {
        onError?.(
          getApiError(
            response,
            translate(AppLocales.Admin.Chat.Errors.UpdateMessage),
          ),
        );
        return;
      }

      onSuccess?.(parseRecord("message" in data ? data.message : data));
  }
}

export default new ChatController();
