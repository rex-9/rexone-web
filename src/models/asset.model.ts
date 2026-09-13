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
  status?: string | null;
  assetable_type?: string | null;
  assetable_id?: string | null;
  parent_asset_id?: string | null;
  children?: {
    thumbnail?: IAssetChild | null;
    subtitles?: IAssetChild[];
  };
  created_by_id?: string | null;
  created_at: string;
  updated_at: string;
}

export type IAssetChild = Pick<
  IAsset,
  | "id"
  | "name"
  | "url"
  | "type"
  | "format"
  | "extension"
  | "status"
  | "size_bytes"
  | "duration_secs"
  | "parent_asset_id"
  | "created_at"
  | "updated_at"
>;

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
  assetable_type?: string;
  assetable_id?: string;
  duration_secs?: number;
  folder?: string;
}
