/**
 * Rexone Design System - Toast Notification
 * Uses DaisyUI alert components
 */

import React, { useEffect } from "react";
import { cn } from "../../utils";

export type ToastType = "success" | "info" | "warning" | "error";

export interface IToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
  icon?: React.ReactNode;
  title?: string;
}

export const Toast: React.FC<IToastProps> = ({
  message,
  type = "success",
  duration = 5000,
  onClose,
  icon,
  title,
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
    success: "🎉",
    info: "💡",
    warning: "⚠️",
    error: "❌",
  };

  const typeColors = {
    success: "text-green-700",
    info: "text-blue-700",
    warning: "text-yellow-700",
    error: "text-red-700",
  };

  return (
    <div className="toast toast-top toast-center z-50 animate-fade-in">
      <div className={cn("alert shadow-lg max-w-md", typeClasses[type])}>
        <div className="flex items-start gap-3 w-full">
          <span className="text-2xl mt-0.5">{icon || defaultIcons[type]}</span>
          <div className="flex-1 min-w-0">
            {title && (
              <p className={cn("text-sm font-semibold", typeColors[type])}>
                {title}
              </p>
            )}
            <p className="text-sm">{message}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-square flex-shrink-0"
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
