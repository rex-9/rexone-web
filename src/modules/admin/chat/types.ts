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
  role: "user" | "assistant" | string;
  content: string;
  room_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface IAdminChatMessageFormValues {
  role: "user" | "assistant" | string;
  content: string;
}
