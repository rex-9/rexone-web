import React, { createContext, useContext, useState, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Toast, ToastType } from "../design/components/overlay/Toast";

interface ToastContextType {
  showToast: (type: ToastType, message: string) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [toast, setToast] = useState<{
    type: ToastType;
    message: string;
  } | null>(null);
  const { t } = useTranslation();

  const showToast = (type: ToastType, message: string) => {
    setToast({ type, message: t(message) });
  };

  const success = (message: string) => showToast("success", message);
  const error = (message: string) => showToast("error", message);
  const info = (message: string) => showToast("info", message);
  const warning = (message: string) => showToast("warning", message);

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
      {children}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
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
