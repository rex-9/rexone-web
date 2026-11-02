/**
 * RexOne Design System - Toast Notification
 * Uses DaisyUI alert components with consistent iconsLib icons
 */

import React, { useEffect } from "react";
import { iconsLib } from "../../../assets";
import { cn } from "../../helpers";
import { ToastTypes, type TToastTypes } from "../../constants";

export { ToastTypes };
export type { TToastTypes };

export interface IToastProps {
  message: string;
  type?: TToastTypes;
  duration?: number;
  onClose: () => void;
  icon?: React.ReactNode;
  title?: string;
}

export const Toast: React.FC<IToastProps> = ({
  message,
  type = ToastTypes.SUCCESS,
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

  const typeClasses: Record<TToastTypes, string> = {
    success: "bg-success/15 border-success/30",
    info: "bg-info/15 border-info/30",
    warning: "bg-warning/15 border-warning/30",
    error: "bg-error/15 border-error/30",
  };

  const defaultIcons: Record<TToastTypes, React.ReactNode> = {
    success: (
      <iconsLib.check className="h-6 w-6 text-success shrink-0" />
    ),
    info: (
      <iconsLib.info className="h-6 w-6 text-info shrink-0" />
    ),
    warning: (
      <iconsLib.warning className="h-6 w-6 text-warning shrink-0" />
    ),
    error: (
      <iconsLib.error className="h-6 w-6 text-error shrink-0" />
    ),
  };

  const typeColors: Record<TToastTypes, string> = {
    success: "text-success",
    info: "text-info",
    warning: "text-warning",
    error: "text-error",
  };

  return (
    <div className="toast toast-top toast-center z-9999 animate-fade-in">
      <div
        className={cn(
          "alert shadow-lg max-w-md border border-base-300",
          typeClasses[type],
        )}
      >
        <div className="flex items-start gap-3 w-full">
          <div className="mt-0.5">{icon || defaultIcons[type]}</div>
          <div className="flex-1 min-w-0">
            {title && (
              <p className={cn("text-body-s font-semibold", typeColors[type])}>
                {title}
              </p>
            )}
            <p className="text-body-s">{message}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center h-6 w-6 rounded-md text-base-content hover:bg-base-content/10 transition-colors shrink-0 opacity-70 hover:opacity-100 cursor-pointer"
            aria-label="Close alert"
          >
            <iconsLib.close className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
