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
  title?: string | null;
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
  title?: string | null;
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
  discarded_at?: string | null;
  undiscarded_at?: string | null;
  created_at: IAsset["created_at"];
  /**
   * Pre-fetched raw subtitle text content (FAST PATH).
   * When present, the player converts this directly into an in-memory WebVTT Data URI,
   * avoiding secondary HTTP roundtrips, CORS restrictions, and network latency.
   */
  content?: string | null;
  /**
   * Fallback HTTP streaming endpoint on RexOne Core (e.g. /v1/assets/:id/subtitles/:subtitle_id).
   * Used when `content` is absent or when an external client (VLC, standalone player)
   * requires a direct HTTP URL with CORS headers.
   */
  core_url?: string | null;
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
