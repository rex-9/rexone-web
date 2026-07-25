/**
 * Meritbox Design System - Toast Notification
 * Uses DaisyUI alert components
 */

import React, { useEffect } from "react";
import { cn } from "../../utils";

export type ToastType = "success" | "info" | "warning" | "error";

export interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
  icon?: React.ReactNode;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = "success",
  duration = 3000,
  onClose,
  icon,
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const typeClasses = {
    success: "alert-success",
    info: "alert-info",
    warning: "alert-warning",
    error: "alert-error",
  };

  const defaultIcons = {
    success: "✅",
    info: "💡",
    warning: "⚠️",
    error: "❌",
  };

  return (
    <div className="toast toast-top toast-center z-50">
      <div className={cn("alert shadow-lg max-w-md", typeClasses[type])}>
        <div className="flex items-center gap-3">
          <span className="text-xl">{icon || defaultIcons[type]}</span>
          <span className="text-sm font-medium">{message}</span>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-square"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
