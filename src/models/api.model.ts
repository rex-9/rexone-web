export interface IApiPagination {
  current_page: number;
  total_pages: number;
  total_count: number;
  limit: number;
  next_page: number | null;
  prev_page: number | null;
}

export interface IApiMeta {
  pagination?: IApiPagination;
  token?: string;
  cooldown_remaining?: number;
  remaining_attempts?: number;
  otp_sent?: boolean;
  password_required?: boolean;
  challenge_token?: string;
  storage_details?: {
    storage_key: string;
    bytes: number;
    format: string;
  };
  operation_id?: string;
  operation_type?: string;
  operation_status?: string;
  link?: string;
  room_id?: string;
  user_id?: string;
  [key: string]: unknown;
}

export interface IApiEnvelope<T = unknown> {
  status: IApiResponseStatus;
  data: T;
  meta?: IApiMeta;
}

export interface IApiResponseStatus {
  code: number;
  success: boolean;
  message: string;
  error?: string;
}

export interface IApiResponse<T = unknown> {
  data: T | null;
  error?: string;
}

export interface IJsonApiResource<T> {
  id: string;
  type: string;
  attributes: T;
}
