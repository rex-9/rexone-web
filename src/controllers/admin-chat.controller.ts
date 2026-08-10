import { AdminChatService } from "../services";
import {
  IAdminChatMessage,
  IAdminChatMessageFormValues,
  IAdminChatRoom,
  IAdminChatRoomFormValues,
  IApiPagination,
} from "../models";
import { parseFromList } from "../services/api.service";

class AdminChatController {
  async getRooms(
    params: { page?: number; limit?: number },
    onSuccess?: (rooms: IAdminChatRoom[], pagination?: IApiPagination) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
    try {
      const response = await AdminChatService.getRooms(params);
      const { status, data, meta } = response.data || {};

      if (!status?.success || !data) {
        onError?.(status?.error || response.error || "Failed to load rooms");
        return;
      }

      onSuccess?.(parseFromList<IAdminChatRoom>(data), meta?.pagination);
    } catch (error) {
      console.error("Error fetching admin chat rooms:", error);
      onError?.("An error occurred while loading chat rooms.");
    }
  }

  async deleteRoom(
    id: string,
    onSuccess?: () => void,
    onError?: (error: string) => void,
  ): Promise<void> {
    const response = await AdminChatService.deleteRoom(id);
    const { status } = response.data || {};

    if (!status?.success) {
      onError?.(status?.error || response.error || "Failed to delete room");
      return;
    }

    onSuccess?.();
  }

  async getRoom(
    id: string,
    onSuccess?: (room: IAdminChatRoom) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
    try {
      const response = await AdminChatService.getRoom(id);
      const { status, data } = response.data || {};

      if (!status?.success || !data?.room) {
        onError?.(status?.error || response.error || "Failed to load room");
        return;
      }

      onSuccess?.(data.room);
    } catch (error) {
      console.error("Error fetching admin chat room:", error);
      onError?.("An error occurred while loading the chat room.");
    }
  }

  async updateRoom(
    id: string,
    values: IAdminChatRoomFormValues,
    onSuccess?: (room: IAdminChatRoom) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
    try {
      const response = await AdminChatService.updateRoom(id, values);
      const { status, data } = response.data || {};

      if (!status?.success || !data?.room) {
        onError?.(status?.error || response.error || "Failed to update room");
        return;
      }

      onSuccess?.(data.room);
    } catch (error) {
      console.error("Error updating admin chat room:", error);
      onError?.("An error occurred while updating the chat room.");
    }
  }

  async getMessages(
    params: { page?: number; limit?: number },
    onSuccess?: (
      messages: IAdminChatMessage[],
      pagination?: IApiPagination,
    ) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
    try {
      const response = await AdminChatService.getMessages(params);
      const { status, data, meta } = response.data || {};

      if (!status?.success || !data) {
        onError?.(
          status?.error || response.error || "Failed to load messages",
        );
        return;
      }

      onSuccess?.(parseFromList<IAdminChatMessage>(data), meta?.pagination);
    } catch (error) {
      console.error("Error fetching admin chat messages:", error);
      onError?.("An error occurred while loading chat messages.");
    }
  }

  async deleteMessage(
    id: string,
    onSuccess?: () => void,
    onError?: (error: string) => void,
  ): Promise<void> {
    const response = await AdminChatService.deleteMessage(id);
    const { status } = response.data || {};

    if (!status?.success) {
      onError?.(status?.error || response.error || "Failed to delete message");
      return;
    }

    onSuccess?.();
  }

  async getMessage(
    id: string,
    onSuccess?: (message: IAdminChatMessage) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
    try {
      const response = await AdminChatService.getMessage(id);
      const { status, data } = response.data || {};

      if (!status?.success || !data?.message) {
        onError?.(
          status?.error || response.error || "Failed to load message",
        );
        return;
      }

      onSuccess?.(data.message);
    } catch (error) {
      console.error("Error fetching admin chat message:", error);
      onError?.("An error occurred while loading the chat message.");
    }
  }

  async updateMessage(
    id: string,
    values: IAdminChatMessageFormValues,
    onSuccess?: (message: IAdminChatMessage) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
    try {
      const response = await AdminChatService.updateMessage(id, values);
      const { status, data } = response.data || {};

      if (!status?.success || !data?.message) {
        onError?.(
          status?.error || response.error || "Failed to update message",
        );
        return;
      }

      onSuccess?.(data.message);
    } catch (error) {
      console.error("Error updating admin chat message:", error);
      onError?.("An error occurred while updating the chat message.");
    }
  }
}

export default new AdminChatController();
