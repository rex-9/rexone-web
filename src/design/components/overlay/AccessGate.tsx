// src/design/components/overlay/AccessGate.tsx

import React from "react";
import { useAccess } from "../../../hooks";

export interface IAccessGateProps {
  productId: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  loadingFallback?: React.ReactNode;
}

export const AccessGate: React.FC<IAccessGateProps> = ({
  productId,
  children,
  fallback = null,
  loadingFallback = null,
}) => {
  const { isUnlocked, isLoading } = useAccess(productId);

  if (isLoading && loadingFallback) {
    return <>{loadingFallback}</>;
  }

  if (!isUnlocked) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default AccessGate;
