// src/hooks/useSort.ts

import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

export const SORT_ORDERS = {
  ASC: "asc",
  DESC: "desc",
} as const;

export type TSortOrder = (typeof SORT_ORDERS)[keyof typeof SORT_ORDERS];

interface IUseSortOptions {
  defaultSortBy?: string;
  defaultSortOrder?: TSortOrder;
}

export function resolveSort(
  searchParams: URLSearchParams,
  options: IUseSortOptions = {},
): { sortBy: string | undefined; sortOrder: TSortOrder } {
  const sortBy = searchParams.get("sort_by") || options.defaultSortBy;
  const sortOrderParam = searchParams.get("sort_order")?.toLowerCase();
  const sortOrder: TSortOrder =
    sortOrderParam === SORT_ORDERS.ASC
      ? SORT_ORDERS.ASC
      : sortOrderParam === SORT_ORDERS.DESC
        ? SORT_ORDERS.DESC
        : options.defaultSortOrder || SORT_ORDERS.DESC;

  return { sortBy, sortOrder };
}

export function computeNextSortParams(
  currentParams: URLSearchParams,
  columnSortKey: string,
  options: IUseSortOptions = {},
): URLSearchParams {
  const next = new URLSearchParams(currentParams);
  const currentKey = next.get("sort_by") || options.defaultSortBy;
  const currentOrder =
    next.get("sort_order") ||
    options.defaultSortOrder ||
    SORT_ORDERS.DESC;

  if (currentKey === columnSortKey) {
    const nextOrder =
      currentOrder === SORT_ORDERS.ASC
        ? SORT_ORDERS.DESC
        : SORT_ORDERS.ASC;
    next.set("sort_order", nextOrder);
  } else {
    next.set("sort_by", columnSortKey);
    next.set("sort_order", SORT_ORDERS.ASC);
  }

  // Reset page to 1 when changing sorting
  next.delete("page");
  return next;
}

export function useSort(options: IUseSortOptions = {}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const { sortBy, sortOrder } = resolveSort(searchParams, options);

  const handleSort = useCallback(
    (columnSortKey: string) => {
      setSearchParams(
        (prev) => computeNextSortParams(prev, columnSortKey, options),
        { replace: true },
      );
    },
    [setSearchParams, options],
  );

  return {
    sortBy,
    sortOrder,
    handleSort,
  };
}
