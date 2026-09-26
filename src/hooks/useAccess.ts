import { useCallback, useEffect, useMemo } from "react";
import { useAuth } from "../contexts/AuthContext";
import type { IAccess } from "../modules/payment";

export const isAccessActive = (access?: IAccess | null): boolean => {
  if (!access) return false;
  if (access.status !== "active") return false;
  if (!access.expires_at) return true; // Lifetime access
  return new Date(access.expires_at).getTime() > Date.now();
};

export const getActiveAccesses = (
  rawAccesses?: IAccess[] | null,
): IAccess[] => {
  return (rawAccesses ?? []).filter(isAccessActive);
};

export const hasProductAccess = (
  accesses: IAccess[] | undefined | null,
  productIdOrCode?: string,
): boolean => {
  if (!productIdOrCode || !accesses) return false;
  return accesses.some(
    (a) =>
      (a.product_id === productIdOrCode ||
        (a as IAccess & { product_code?: string }).product_code ===
          productIdOrCode) &&
      isAccessActive(a),
  );
};

export interface IUseAccessResult {
  accesses: IAccess[];
  hasAccess: (productIdOrCode?: string) => boolean;
  getAccess: (productIdOrCode?: string) => IAccess | null;
  isUnlocked: boolean;
  access: IAccess | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

export const useAccess = (productIdOrCode?: string): IUseAccessResult => {
  const { currentUser, isAuthenticated, refreshCurrentUser } = useAuth();
  const isLoading = isAuthenticated && !currentUser;

  const accesses = useMemo<IAccess[]>(() => {
    const rawAccesses = currentUser?.accesses ?? [];
    return rawAccesses.filter(isAccessActive);
  }, [currentUser?.accesses]);

  const accessMap = useMemo(() => {
    const map = new Map<string, IAccess>();
    for (const item of accesses) {
      if (item.product_id) map.set(item.product_id, item);
      const code = (item as IAccess & { product_code?: string }).product_code;
      if (code) map.set(code, item);
    }
    return map;
  }, [accesses]);

  const hasAccess = useCallback(
    (targetIdOrCode?: string): boolean => {
      const query = targetIdOrCode || productIdOrCode;
      if (!query) return false;
      const found = accessMap.get(query);
      return isAccessActive(found);
    },
    [accessMap, productIdOrCode],
  );

  const getAccess = useCallback(
    (targetIdOrCode?: string): IAccess | null => {
      const query = targetIdOrCode || productIdOrCode;
      if (!query) return null;
      return accessMap.get(query) ?? null;
    },
    [accessMap, productIdOrCode],
  );

  const refresh = useCallback(async () => {
    await refreshCurrentUser();
  }, [refreshCurrentUser]);

  // Seamless auto-refresh when an active time-bound access expires
  useEffect(() => {
    const expiringItems = accesses.filter(
      (a) => a.expires_at && isAccessActive(a),
    );
    if (expiringItems.length === 0) return;

    const earliestExpiry = Math.min(
      ...expiringItems.map((a) => new Date(a.expires_at!).getTime()),
    );
    const delay = earliestExpiry - Date.now();

    if (delay <= 0) {
      void refreshCurrentUser();
      return;
    }

    // Set timer for exact expiration boundary (up to 24-hour max window)
    if (delay <= 86400000) {
      const timer = setTimeout(() => {
        void refreshCurrentUser();
      }, delay + 1000);
      return () => clearTimeout(timer);
    }
  }, [accesses, refreshCurrentUser]);

  const isUnlocked = useMemo(() => {
    return productIdOrCode ? hasAccess(productIdOrCode) : false;
  }, [hasAccess, productIdOrCode]);

  const directAccess = useMemo(() => {
    return productIdOrCode ? getAccess(productIdOrCode) : null;
  }, [getAccess, productIdOrCode]);

  return {
    accesses,
    hasAccess,
    getAccess,
    isUnlocked,
    access: directAccess,
    isLoading,
    refresh,
  };
};
