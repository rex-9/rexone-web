import { describe, expect, it, vi } from "vitest";

vi.mock("../contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

import {
  getActiveAccesses,
  hasProductAccess,
  isAccessActive,
} from "./useAccess";
import type { IAccess } from "../modules/payment";

describe("isAccessActive", () => {
  it("returns true for active lifetime access (null expires_at)", () => {
    const access: IAccess = {
      id: "acc_1",
      status: "active",
      product_id: "prod_1",
      active: true,
      expires_at: null,
      granted_at: "2026-01-01T00:00:00Z",
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z",
    };
    expect(isAccessActive(access)).toBe(true);
  });

  it("returns true for active access with future expiry", () => {
    const futureDate = new Date(Date.now() + 86400000).toISOString();
    const access: IAccess = {
      id: "acc_2",
      status: "active",
      product_id: "prod_2",
      active: true,
      expires_at: futureDate,
      granted_at: "2026-01-01T00:00:00Z",
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z",
    };
    expect(isAccessActive(access)).toBe(true);
  });

  it("returns false for access whose expiry date has passed", () => {
    const pastDate = new Date(Date.now() - 10000).toISOString();
    const access: IAccess = {
      id: "acc_3",
      status: "active",
      product_id: "prod_3",
      active: true,
      expires_at: pastDate,
      granted_at: "2026-01-01T00:00:00Z",
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z",
    };
    expect(isAccessActive(access)).toBe(false);
  });

  it("returns false for revoked or expired status", () => {
    const access: IAccess = {
      id: "acc_4",
      status: "revoked",
      product_id: "prod_4",
      active: false,
      expires_at: null,
      granted_at: "2026-01-01T00:00:00Z",
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z",
    };
    expect(isAccessActive(access)).toBe(false);
    expect(isAccessActive(undefined)).toBe(false);
  });
});

describe("getActiveAccesses and hasProductAccess", () => {
  const activeLifetime: IAccess & { product_code?: string } = {
    id: "acc_life",
    status: "active",
    product_id: "prod_life",
    product_code: "LIFETIME12",
    product_name: "Lifetime Pass",
    active: true,
    expires_at: null,
    granted_at: "2026-01-01T00:00:00Z",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  };

  const activeSub: IAccess & { product_code?: string } = {
    id: "acc_sub",
    status: "active",
    product_id: "prod_sub",
    product_code: "SUBMONTHLY",
    product_name: "Pro Monthly",
    active: true,
    expires_at: new Date(Date.now() + 100000000).toISOString(),
    granted_at: "2026-01-01T00:00:00Z",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  };

  const expiredOld: IAccess = {
    id: "acc_old",
    status: "active",
    product_id: "prod_old",
    active: true,
    expires_at: "2021-01-01T00:00:00Z",
    granted_at: "2021-01-01T00:00:00Z",
    created_at: "2021-01-01T00:00:00Z",
    updated_at: "2021-01-01T00:00:00Z",
  };

  it("filters out expired accesses", () => {
    const list = getActiveAccesses([activeLifetime, activeSub, expiredOld]);
    expect(list).toHaveLength(2);
    expect(list.map((a) => a.id)).toEqual(["acc_life", "acc_sub"]);
  });

  it("resolves access correctly by both productId and productCode", () => {
    const list = [activeLifetime, activeSub, expiredOld];

    expect(hasProductAccess(list, "prod_life")).toBe(true);
    expect(hasProductAccess(list, "LIFETIME12")).toBe(true);
    expect(hasProductAccess(list, "prod_sub")).toBe(true);
    expect(hasProductAccess(list, "SUBMONTHLY")).toBe(true);

    expect(hasProductAccess(list, "prod_old")).toBe(false); // Expired
    expect(hasProductAccess(list, "unowned")).toBe(false);
    expect(hasProductAccess([], "prod_life")).toBe(false);
    expect(hasProductAccess(undefined, "prod_life")).toBe(false);
  });
});
