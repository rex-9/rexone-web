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
  <div className="flex min-h-60 w-full flex-col items-center justify-center p-6 text-center">
    <h2 className="text-h3 font-display font-semibold text-base-content">
      {title}
    </h2>
    {message && (
      <p className="mt-2 max-w-xl text-body-m text-base-content opacity-70">
        {message}
      </p>
    )}
    {actionLabel && onAction && (
      <Button className="mt-4" variant="secondary" onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </div>
);
