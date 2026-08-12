import { IJsonApiResource } from "../../models";

export interface IChatRequest {
  message: string;
  room_id?: string;
  system_prompt?: string;
  temperature?: number;
  max_tokens?: number;
}

export interface IChatResponse {
  response: string;
  room_id: string;
  usage?: any;
}

export interface IMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface IHistoryResponse {
  messages: IJsonApiResource<IMessage>[];
  room_id: string;
  room_title: string;
}

export interface IRoom {
  id: string;
  title: string;
  message_count: number;
  last_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface IRoomsResponse {
  rooms: IRoom[];
}
