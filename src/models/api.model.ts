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
