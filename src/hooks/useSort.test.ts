// src/hooks/useSort.test.ts

import { describe, it, expect } from "vitest";
import {
  resolveSort,
  computeNextSortParams,
  SORT_ORDERS,
} from "./useSort";

describe("resolveSort", () => {
  it("returns default values when no search params are present", () => {
    const params = new URLSearchParams();
    const result = resolveSort(params, {
      defaultSortBy: "created_at",
      defaultSortOrder: SORT_ORDERS.DESC,
    });

    expect(result.sortBy).toBe("created_at");
    expect(result.sortOrder).toBe(SORT_ORDERS.DESC);
  });

  it("reads sort_by and sort_order from URL search params", () => {
    const params = new URLSearchParams("sort_by=name&sort_order=asc");
    const result = resolveSort(params, {
      defaultSortBy: "created_at",
      defaultSortOrder: SORT_ORDERS.DESC,
    });

    expect(result.sortBy).toBe("name");
    expect(result.sortOrder).toBe(SORT_ORDERS.ASC);
  });

  it("returns sort_order from URL search params", () => {
    const params = new URLSearchParams("sort_by=name&sort_order=desc");
    const result = resolveSort(params, {
      defaultSortBy: "created_at",
      defaultSortOrder: SORT_ORDERS.DESC,
    });

    expect(result.sortBy).toBe("name");
    expect(result.sortOrder).toBe(SORT_ORDERS.DESC);
  });

  it("falls back to default for unrecognized sort_order", () => {
    const params = new URLSearchParams("sort_by=name&sort_order=invalid");
    const result = resolveSort(params, {
      defaultSortOrder: SORT_ORDERS.DESC,
    });

    expect(result.sortOrder).toBe(SORT_ORDERS.DESC);
  });
});

describe("computeNextSortParams", () => {
  it("toggles sort order from asc to desc when clicking the active sort column", () => {
    const current = new URLSearchParams("sort_by=name&sort_order=asc&page=3");
    const next = computeNextSortParams(current, "name", {
      defaultSortBy: "created_at",
      defaultSortOrder: SORT_ORDERS.DESC,
    });

    expect(next.get("sort_by")).toBe("name");
    expect(next.get("sort_order")).toBe(SORT_ORDERS.DESC);
    expect(next.get("page")).toBeNull();
  });

  it("toggles sort order from desc to asc when clicking the active sort column", () => {
    const current = new URLSearchParams("sort_by=name&sort_order=desc");
    const next = computeNextSortParams(current, "name", {
      defaultSortBy: "created_at",
      defaultSortOrder: SORT_ORDERS.DESC,
    });

    expect(next.get("sort_by")).toBe("name");
    expect(next.get("sort_order")).toBe(SORT_ORDERS.ASC);
  });

  it("switches to a new sort column with default asc order and clears page", () => {
    const current = new URLSearchParams("sort_by=created_at&sort_order=desc&page=2");
    const next = computeNextSortParams(current, "email", {
      defaultSortBy: "created_at",
      defaultSortOrder: SORT_ORDERS.DESC,
    });

    expect(next.get("sort_by")).toBe("email");
    expect(next.get("sort_order")).toBe(SORT_ORDERS.ASC);
    expect(next.get("page")).toBeNull();
  });
});
