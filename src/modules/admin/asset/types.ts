import type { TStoragePartition } from "./constants";

export interface IStorageStats {
  provider: string;
  bucket?: string;
  bucket_bytes?: number;
  bucket_objects?: number;
  partitions?: Record<TStoragePartition, { bytes: number; objects: number }>;
  tracked_partitions?: Record<
    TStoragePartition,
    { bytes: number; objects: number }
  >;
  disk_available_bytes?: number;
  disk_total_bytes?: number;
  disk_used_percent?: number | null;
  disk_free_percent?: number | null;
  node_capacity_bytes?: number;
  db_assets_count: number;
  db_assets_bytes: number;
}
