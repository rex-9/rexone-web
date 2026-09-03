import type { IAsset } from "../../../models";

export type IAdminAsset = IAsset & {
  storage_key?: string | null;
  discarded_at?: string | null;
  discarded_by_id?: string | null;
  undiscarded_at?: string | null;
};
