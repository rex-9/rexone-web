import React from "react";
import { Button } from "../../../design/components/button";

interface IAdminStateProps {
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const AdminState: React.FC<IAdminStateProps> = ({
  title,
  message,
  actionLabel,
  onAction,
}) => (
  <div className="flex min-h-[240px] w-full flex-col items-center justify-center p-24 text-center">
    <h2 className="text-h3 font-display font-semibold text-base-content">
      {title}
    </h2>
    {message && (
      <p className="mt-8 max-w-xl text-body-m text-base-content opacity-70">
        {message}
      </p>
    )}
    {actionLabel && onAction && (
      <Button className="mt-16" variant="secondary" onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </div>
);

export const AdminLoadingState: React.FC = () => (
  <div className="flex min-h-[240px] items-center justify-center">
    <span className="loading loading-spinner loading-md" />
  </div>
);
