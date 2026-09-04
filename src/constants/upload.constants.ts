export const UPLOAD_LIMITS = {
  /** Maximum upload size for non-video files in MB (configurable via VITE_MEDIA_MAX_NON_VIDEO_SIZE_MB) */
  MAX_NON_VIDEO_SIZE_MB: Number(
    import.meta.env.VITE_MEDIA_MAX_NON_VIDEO_SIZE_MB || 10,
  ),
  /** Maximum upload size for video files in MB (configurable via VITE_MEDIA_MAX_VIDEO_SIZE_MB) */
  MAX_VIDEO_SIZE_MB: Number(
    import.meta.env.VITE_MEDIA_MAX_VIDEO_SIZE_MB || 100,
  ),
  /** Maximum number of files per batch upload (configurable via VITE_MEDIA_MAX_FILE_COUNT) */
  MAX_FILE_COUNT: Number(import.meta.env.VITE_MEDIA_MAX_FILE_COUNT || 20),
} as const;

export const UPLOAD_SIZE_LIMITS = {
  MAX_NON_VIDEO_SIZE_MB: UPLOAD_LIMITS.MAX_NON_VIDEO_SIZE_MB,
  MAX_VIDEO_SIZE_MB: UPLOAD_LIMITS.MAX_VIDEO_SIZE_MB,
  MAX_FILE_COUNT: UPLOAD_LIMITS.MAX_FILE_COUNT,

  /** Maximum upload size for non-video files in bytes */
  MAX_NON_VIDEO_BYTES: UPLOAD_LIMITS.MAX_NON_VIDEO_SIZE_MB * 1024 * 1024,
  /** Maximum upload size for video files in bytes */
  MAX_VIDEO_BYTES: UPLOAD_LIMITS.MAX_VIDEO_SIZE_MB * 1024 * 1024,
} as const;
