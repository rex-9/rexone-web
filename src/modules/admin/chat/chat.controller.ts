import { IApiPagination } from "../../../models";
import { AppLocales, translate } from "../../../locales";
import {
  getApiError,
  parsePagyList,
  parseRecord,
} from "../../../services/api.service";
import ChatService from "./chat.service";
import {
  IAdminChatMessage,
  IAdminChatMessageFormValues,
  IAdminChatRoom,
  IAdminChatRoomFormValues,
  IAdminChatListParams,
} from "./types";

class ChatController {
  async getRooms(params?: IAdminChatListParams): Promise<{
    success: boolean;
    rooms: IAdminChatRoom[];
    pagination: IApiPagination | null;
    error?: string;
  }> {
    const response = await ChatService.getRooms(params);
    const { status, data } = response.data || {};

    if (status?.success && data) {
      const { records, pagination } = parsePagyList<IAdminChatRoom>(response);
      return { success: true, rooms: records, pagination };
    }

    return {
      success: false,
      rooms: [],
      pagination: null,
      error: getApiError(
        response,
        translate(AppLocales.Admin.Chat.Errors.LoadRooms),
      ),
    };
  }

  async discardRoom(id: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    const response = await ChatService.discardRoom(id);
    const { status } = response.data || {};

    if (status?.success) {
      return { success: true };
    }

    return {
      success: false,
      error: getApiError(
        response,
        translate(AppLocales.Admin.Chat.Errors.DeleteRoom),
      ),
    };
  }

  async undiscardRoom(id: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    const response = await ChatService.undiscardRoom(id);
    const { status } = response.data || {};

    if (status?.success) {
      return { success: true };
    }

    return {
      success: false,
      error: getApiError(
        response,
        "Failed to restore chat room",
      ),
    };
  }

  async deleteRoom(id: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    const response = await ChatService.deleteRoom(id);
    const { status } = response.data || {};

    if (status?.success) {
      return { success: true };
    }

    return {
      success: false,
      error: getApiError(
        response,
        "Failed to destroy chat room",
      ),
    };
  }

  async getRoom(id: string): Promise<{
    success: boolean;
    room?: IAdminChatRoom;
    error?: string;
  }> {
    const response = await ChatService.getRoom(id);
    const { status, data } = response.data || {};

    if (status?.success && data) {
      return {
        success: true,
        room: parseRecord("room" in data ? data.room : data),
      };
    }

    return {
      success: false,
      error: getApiError(
        response,
        translate(AppLocales.Admin.Chat.Errors.LoadRoom),
      ),
    };
  }

  async updateRoom(
    id: string,
    values: IAdminChatRoomFormValues,
  ): Promise<{
    success: boolean;
    room?: IAdminChatRoom;
    error?: string;
  }> {
    const response = await ChatService.updateRoom(id, values);
    const { status, data } = response.data || {};

    if (status?.success && data) {
      return {
        success: true,
        room: parseRecord("room" in data ? data.room : data),
      };
    }

    return {
      success: false,
      error: getApiError(
        response,
        translate(AppLocales.Admin.Chat.Errors.UpdateRoom),
      ),
    };
  }

  async getMessages(params?: IAdminChatListParams): Promise<{
    success: boolean;
    messages: IAdminChatMessage[];
    pagination: IApiPagination | null;
    error?: string;
  }> {
    const response = await ChatService.getMessages(params);
    const { status, data } = response.data || {};

    if (status?.success && data) {
      const { records, pagination } = parsePagyList<IAdminChatMessage>(response);
      return { success: true, messages: records, pagination };
    }

    return {
      success: false,
      messages: [],
      pagination: null,
      error: getApiError(
        response,
        translate(AppLocales.Admin.Chat.Errors.LoadMessages),
      ),
    };
  }

  async discardMessage(id: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    const response = await ChatService.discardMessage(id);
    const { status } = response.data || {};

    if (status?.success) {
      return { success: true };
    }

    return {
      success: false,
      error: getApiError(
        response,
        translate(AppLocales.Admin.Chat.Errors.DeleteMessage),
      ),
    };
  }

  async undiscardMessage(id: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    const response = await ChatService.undiscardMessage(id);
    const { status } = response.data || {};

    if (status?.success) {
      return { success: true };
    }

    return {
      success: false,
      error: getApiError(
        response,
        "Failed to restore chat message",
      ),
    };
  }

  async deleteMessage(id: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    const response = await ChatService.deleteMessage(id);
    const { status } = response.data || {};

    if (status?.success) {
      return { success: true };
    }

    return {
      success: false,
      error: getApiError(
        response,
        "Failed to destroy chat message",
      ),
    };
  }

  async getMessage(id: string): Promise<{
    success: boolean;
    message?: IAdminChatMessage;
    error?: string;
  }> {
    const response = await ChatService.getMessage(id);
    const { status, data } = response.data || {};

    if (status?.success && data) {
      return {
        success: true,
        message: parseRecord("message" in data ? data.message : data),
      };
    }

    return {
      success: false,
      error: getApiError(
        response,
        translate(AppLocales.Admin.Chat.Errors.LoadMessage),
      ),
    };
  }

  async updateMessage(
    id: string,
    values: IAdminChatMessageFormValues,
  ): Promise<{
    success: boolean;
    message?: IAdminChatMessage;
    error?: string;
  }> {
    const response = await ChatService.updateMessage(id, values);
    const { status, data } = response.data || {};

    if (status?.success && data) {
      return {
        success: true,
        message: parseRecord("message" in data ? data.message : data),
      };
    }

    return {
      success: false,
      error: getApiError(
        response,
        translate(AppLocales.Admin.Chat.Errors.UpdateMessage),
      ),
    };
  }
}

export default new ChatController();
