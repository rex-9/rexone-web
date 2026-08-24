import React from "react";
import { useLoading } from "../../../contexts/LoadingContext";

interface ILoadingOverlayProps {
  overlay?: boolean;
}

export const LoadingOverlay: React.FC<ILoadingOverlayProps> = ({ overlay }) => {
  const { isLoading, isOverlayLoading } = useLoading();
  const shouldShowOverlay = overlay ?? isOverlayLoading;

  if (!isLoading || !shouldShowOverlay) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <span className="loading loading-spinner loading-lg text-primary" />
    </div>
  );
};
