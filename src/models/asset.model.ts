// src/models/asset.model.ts

export interface IChildAsset {
  id: string;
  url: string;
  status: string;
  size_bytes?: number | null;
}

export interface IAsset {
  id: string;
  name: string;
  display_name?: string | null;
  description?: string | null;
  metadata?: Record<string, unknown>;
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

export interface IAssetChild {
  id: IAsset["id"];
  name: IAsset["name"];
  display_name?: string | null;
  description?: string | null;
  metadata?: Record<string, unknown>;
  url: IAsset["url"];
  type: IAsset["type"];
  format?: IAsset["format"];
  extension?: IAsset["extension"];
  status?: IAsset["status"];
  size_bytes?: IAsset["size_bytes"];
  duration_secs?: IAsset["duration_secs"];
  parent_asset_id?: IAsset["parent_asset_id"];
  created_at: IAsset["created_at"];
  updated_at: IAsset["updated_at"];
}

export interface IAssetUploadResponse {
  asset: IAsset;
  storage_details: {
    storage_key: string;
    bytes: number;
    format: string;
  };
}

export interface IAssetPlaybackDelivery {
  type: "progressive";
  url: string;
  expires_at: string;
}

export interface IAssetPlaybackMedia {
  content_type: string;
  format?: string | null;
  size_bytes?: number | null;
  duration_secs?: number | null;
  thumbnail?: IAssetChild | null;
  subtitles: IAssetChild[];
}

export interface IAssetPlaybackResponse {
  asset_id: string;
  delivery: IAssetPlaybackDelivery;
  media: IAssetPlaybackMedia;
}

export interface IAssetUploadOptions {
  type?: string;
  assetable_type?: string;
  assetable_id?: string;
  duration_secs?: number;
  folder?: string;
}
