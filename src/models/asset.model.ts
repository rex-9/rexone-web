// src/models/asset.model.ts

export interface IAsset {
  id: string;
  name: string;
  url: string;
  type: string;
  format?: string | null;
  extension?: string | null;
  size_bytes?: number | null;
  duration_secs?: number | null;
  source: string;
  resource_model?: string | null;
  resource_id?: string | null;
  created_by_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface IAssetUploadResponse {
  asset: IAsset;
  storage_details: {
    storage_key: string;
    bytes: number;
    format: string;
  };
}

export interface IAssetUploadOptions {
  type?: string;
  resource_model?: string;
  resource_id?: string;
  duration_secs?: number;
  folder?: string;
}
