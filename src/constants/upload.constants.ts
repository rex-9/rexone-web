export const UPLOAD_SIZE_LIMITS = {
  /** Without compression: 1 MB for non-video files */
  UNCOMPRESSED_NON_VIDEO_BYTES: 1 * 1024 * 1024,
  /** Without compression: 10 MB for video files */
  UNCOMPRESSED_VIDEO_BYTES: 10 * 1024 * 1024,
  /** With compression: 10 MB for non-video files */
  COMPRESSED_NON_VIDEO_BYTES: 10 * 1024 * 1024,
  /** With compression: 100 MB for video files */
  COMPRESSED_VIDEO_BYTES: 100 * 1024 * 1024,
} as const;
