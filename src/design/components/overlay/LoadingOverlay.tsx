import React from "react";
import { useLoading } from "../../../contexts/LoadingContext";

export const LoadingOverlay: React.FC = () => {
  const { isLoading, isOverlayLoading } = useLoading();

  if (!isLoading || !isOverlayLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <span className="loading loading-spinner loading-lg text-primary" />
    </div>
  );
};
