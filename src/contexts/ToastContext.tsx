import React, { createContext, useContext, useState, ReactNode } from "react";
import { useTranslate } from "../locales";
import { Toast, ToastType } from "../design/components/overlay/Toast";

interface ToastContextType {
  showToast: (type: ToastType, message: string, title?: string) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [toast, setToast] = useState<{
    type: ToastType;
    message: string;
    title?: string;
  } | null>(null);
  const t = useTranslate();

  const showToast = (type: ToastType, message: string, title?: string) => {
    setToast({ type, message: t(message), title });
  };

  const success = (message: string, title?: string) =>
    showToast("success", message, title);
  const error = (message: string, title?: string) =>
    showToast("error", message, title);
  const info = (message: string, title?: string) =>
    showToast("info", message, title);
  const warning = (message: string, title?: string) =>
    showToast("warning", message, title);

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
      {children}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          title={toast.title}
          onClose={() => setToast(null)}
        />
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
