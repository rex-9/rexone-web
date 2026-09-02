import type { TSortOrder } from "../../../hooks/useSort";
import type { TAdminChatRole } from "./constants";

export type { TAdminChatRole };

export interface IAdminChatRoom {
  id: string;
  title: string;
  user_id: string;
  message_count: number;
  last_message?: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface IAdminChatRoomFormValues {
  title: string;
}

export interface IAdminChatMessage {
  id: string;
  role: TAdminChatRole | string;
  content: string;
  room_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface IAdminChatMessageFormValues {
  role: TAdminChatRole | string;
  content: string;
}

export interface IAdminChatListParams {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: TSortOrder;
}
