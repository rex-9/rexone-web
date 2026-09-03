export const ADMIN_ASSET_COLUMNS = {
  PREVIEW: "preview",
  NAME: "name",
  TYPE: "type",
  FORMAT: "format",
  SIZE: "size_bytes",
  SOURCE: "source",
  CREATED_AT: "created_at",
  DISCARDED_AT: "discarded_at",
} as const;

export const ADMIN_ASSET_FILTERS = {
  TYPE: "type",
  FORMAT: "format",
  SOURCE: "source",
} as const;

export const ASSET_TYPES = {
  AVATAR: "avatar",
  THUMBNAIL: "thumbnail",
  AUDIO: "audio",
  VIDEO: "video",
  ATTACHMENT: "attachment",
  GENERAL: "general",
} as const;

export type TAssetType = (typeof ASSET_TYPES)[keyof typeof ASSET_TYPES];

export const ASSET_FORMATS = {
  IMAGE: "image",
  AUDIO: "audio",
  VIDEO: "video",
  DOC: "doc",
} as const;

export type TAssetFormat = (typeof ASSET_FORMATS)[keyof typeof ASSET_FORMATS];

export const ASSET_SOURCES = {
  UPLOAD: "upload",
  GOOGLE: "google",
} as const;

export type TAssetSource = (typeof ASSET_SOURCES)[keyof typeof ASSET_SOURCES];

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

export const isImageAsset = (asset?: {
  format?: string | null;
  type?: string | null;
  url?: string | null;
} | null): boolean => {
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

export const ASSET_TYPE_OPTIONS = [
  { value: "", label: "All Types" },
  { value: ASSET_TYPES.AVATAR, label: "Avatar" },
  { value: ASSET_TYPES.THUMBNAIL, label: "Thumbnail" },
  { value: ASSET_TYPES.AUDIO, label: "Audio" },
  { value: ASSET_TYPES.VIDEO, label: "Video" },
  { value: ASSET_TYPES.ATTACHMENT, label: "Attachment" },
  { value: ASSET_TYPES.GENERAL, label: "General" },
] as const;

export const ASSET_FORMAT_OPTIONS = [
  { value: "", label: "All Formats" },
  { value: ASSET_FORMATS.IMAGE, label: "Image" },
  { value: ASSET_FORMATS.AUDIO, label: "Audio" },
  { value: ASSET_FORMATS.VIDEO, label: "Video" },
  { value: ASSET_FORMATS.DOC, label: "Document" },
] as const;

export const ASSET_SOURCE_OPTIONS = [
  { value: "", label: "All Sources" },
  { value: ASSET_SOURCES.UPLOAD, label: "Upload" },
  { value: ASSET_SOURCES.GOOGLE, label: "Google" },
] as const;
