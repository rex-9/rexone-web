import type { IAssetChild } from "../../../models";
import { AppLocales } from "../../../locales";

export const ADMIN_ASSET_COLUMNS = {
  ACTIONS: "actions",
  PREVIEW: "preview",
  NAME: "name",
  TYPE: "type",
  FORMAT: "format",
  STATUS: "status",
  SIZE: "size_bytes",
  SOURCE: "source",
  CREATED_AT: "created_at",
  DISCARDED_AT: "discarded_at",
} as const;

export const ADMIN_ASSET_FILTERS = {
  RECORD_SCOPE: "record_scope",
  TYPE: "type",
  FORMAT: "format",
  SOURCE: "source",
  STATUS: "status",
} as const;

export const ASSET_RECORD_SCOPES = {
  PARENTS: "parents",
  CHILDREN: "children",
  ALL: "all",
} as const;

export type TAssetRecordScope =
  (typeof ASSET_RECORD_SCOPES)[keyof typeof ASSET_RECORD_SCOPES];

export const ASSET_TYPES = {
  AVATAR: "avatar",
  THUMBNAIL: "thumbnail",
  SUBTITLE: "subtitle",
  TTS: "tts",
  ATTACHMENT: "attachment",
  GENERAL: "general",
} as const;

export type TAssetType = (typeof ASSET_TYPES)[keyof typeof ASSET_TYPES];

export const ASSET_FORMATS = {
  IMAGE: "image",
  AUDIO: "audio",
  VIDEO: "video",
  DOC: "doc",
  ZIP: "zip",
  SUBTITLE: "subtitle",
} as const;

export type TAssetFormat = (typeof ASSET_FORMATS)[keyof typeof ASSET_FORMATS];

export const ASSET_SOURCES = {
  UPLOAD: "upload",
  GOOGLE: "google",
} as const;

export type TAssetSource = (typeof ASSET_SOURCES)[keyof typeof ASSET_SOURCES];

export const ASSET_STATUSES = {
  PENDING: "pending",
  PROCESSING: "processing",
  READY: "ready",
  OPTIMAL: "optimal",
  FAILED: "failed",
} as const;

export type TAssetStatus = (typeof ASSET_STATUSES)[keyof typeof ASSET_STATUSES];

export const STORAGE_PARTITIONS = {
  DEV: "dev",
  UAT: "uat",
  PROD: "prod",
} as const;

export type TStoragePartition =
  (typeof STORAGE_PARTITIONS)[keyof typeof STORAGE_PARTITIONS];

export const STORAGE_PARTITION_VALUES = Object.values(STORAGE_PARTITIONS);

export const IMAGE_ASSET_TYPES: readonly string[] = [
  ASSET_TYPES.AVATAR,
  ASSET_TYPES.THUMBNAIL,
];

export const FILE_SIZE_UNITS = ["B", "KB", "MB", "GB", "TB"] as const;

export const formatAssetFileSize = (bytes?: number | null): string => {
  if (!bytes || bytes <= 0) return "0 B";
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const unitIndex = Math.min(i, FILE_SIZE_UNITS.length - 1);
  return (
    parseFloat((bytes / Math.pow(k, unitIndex)).toFixed(2)) +
    " " +
    FILE_SIZE_UNITS[unitIndex]
  );
};

export const isImageAsset = (
  asset?: {
    format?: string | null;
    type?: string | null;
    url?: string | null;
  } | null,
): boolean => {
  if (!asset) return false;
  if (asset.format === ASSET_FORMATS.IMAGE) return true;
  if (asset.type && IMAGE_ASSET_TYPES.includes(asset.type)) return true;
  if (
    asset.url &&
    (asset.url.includes("googleusercontent.com") ||
      /\.(jpe?g|png|gif|webp|svg|bmp|ico)($|\?)/i.test(asset.url))
  ) {
    return true;
  }
  return false;
};

export const getAssetThumbnail = <
  T extends { children?: { thumbnail?: { url?: string | null } | null } },
>(
  asset?: T | null,
) => asset?.children?.thumbnail ?? null;

export const getAssetChildren = <
  T extends {
    children?: {
      thumbnail?: IAssetChild | null;
      subtitles?: IAssetChild[];
    };
  },
>(
  asset?: T | null,
) => [
  ...(asset?.children?.thumbnail ? [asset.children.thumbnail] : []),
  ...(asset?.children?.subtitles ?? []),
];

export const ASSET_TYPE_OPTIONS = [
  { value: "", label: "All Types" },
  { value: ASSET_TYPES.AVATAR, label: "Avatar" },
  { value: ASSET_TYPES.THUMBNAIL, label: "Thumbnail" },
  { value: ASSET_TYPES.SUBTITLE, label: "Subtitle" },
  { value: ASSET_TYPES.TTS, label: "TTS" },
  { value: ASSET_TYPES.ATTACHMENT, label: "Attachment" },
  { value: ASSET_TYPES.GENERAL, label: "General" },
] as const;

export const ASSET_RECORD_SCOPE_OPTIONS = [
  {
    value: ASSET_RECORD_SCOPES.PARENTS,
    labelKey: AppLocales.Admin.Assets.Filters.ParentAssets,
  },
  {
    value: ASSET_RECORD_SCOPES.CHILDREN,
    labelKey: AppLocales.Admin.Assets.Filters.ChildAssets,
  },
  {
    value: ASSET_RECORD_SCOPES.ALL,
    labelKey: AppLocales.Admin.Assets.Filters.AllAssets,
  },
] as const;

export const ASSET_FORMAT_OPTIONS = [
  { value: "", label: "All Formats" },
  { value: ASSET_FORMATS.IMAGE, label: "Image" },
  { value: ASSET_FORMATS.AUDIO, label: "Audio" },
  { value: ASSET_FORMATS.VIDEO, label: "Video" },
  { value: ASSET_FORMATS.DOC, label: "Document" },
  { value: ASSET_FORMATS.ZIP, label: "Zip" },
  { value: ASSET_FORMATS.SUBTITLE, label: "Subtitle" },
] as const;

export const ASSET_SOURCE_OPTIONS = [
  { value: "", label: "All Sources" },
  { value: ASSET_SOURCES.UPLOAD, label: "Upload" },
  { value: ASSET_SOURCES.GOOGLE, label: "Google" },
] as const;

export const ASSET_STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: ASSET_STATUSES.PENDING, label: "Pending" },
  { value: ASSET_STATUSES.PROCESSING, label: "Processing" },
  { value: ASSET_STATUSES.READY, label: "Ready" },
  { value: ASSET_STATUSES.OPTIMAL, label: "Optimal" },
  { value: ASSET_STATUSES.FAILED, label: "Failed" },
] as const;
