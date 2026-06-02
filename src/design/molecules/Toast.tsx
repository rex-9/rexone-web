/**
 * Meritbox Design System - Toast Notification Molecule
 *
 * Reinforce dopamine loop with encouraging messages
 */

import React, { useEffect } from "react";
import { clsx } from "ts-clsx";

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
    success: "bg-success text-white",
    info: "bg-info text-white",
    warning: "bg-warning text-navy-900",
    error: "bg-error text-white",
  };

  const defaultIcons = {
    success: "✨",
    info: "💡",
    warning: "⚠️",
    error: "❌",
  };

  return (
    <div
      className={clsx(
        "fixed top-16 left-1/2 transform -translate-x-1/2 z-50",
        "px-20 py-12 rounded-m shadow-m",
        "flex items-center gap-12",
        "animate-[fadeIn_200ms_ease-out]",
        typeClasses[type]
      )}
    >
      <span className="text-20">{icon || defaultIcons[type]}</span>
      <span className="text-body-m font-medium">{message}</span>
      <button
        type="button"
        onClick={onClose}
        className="ml-8 p-4 rounded-s hover:bg-black hover:bg-opacity-10 transition-colors"
      >
        <svg
          className="w-16 h-16"
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
  );
};

export default Toast;
