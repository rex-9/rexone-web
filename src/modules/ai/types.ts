export interface IChatRequest {
  message: string;
  room_id?: string;
  system_prompt?: string;
  temperature?: number;
  max_tokens?: number;
}

export interface IChatResponse {
  message: IMessage;
  room_id: string;
  status: "queued";
  job_id: string;
}

export interface IMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  room_id?: string;
  metadata?: {
    status?: "queued" | "processing" | "retrying" | "completed" | "failed";
    system_prompt?: string;
    temperature?: number;
    max_tokens?: number;
    error?: string | null;
    assistant_message_id?: string;
    usage?: Record<string, number>;
    model?: string;
  };
  created_at: string;
}

export interface IRoom {
  id: string;
  title: string;
  message_count: number;
  last_message: string | null;
  created_at: string;
  updated_at: string;
  processing: boolean;
}

export interface IRoomsResponse {
  rooms: IRoom[];
}
