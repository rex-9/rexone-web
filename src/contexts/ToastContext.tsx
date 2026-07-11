import React, { createContext, useContext, useState, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Toast } from "../design/components";

type ToastType = "info" | "success" | "warning" | "error";

interface ToastContextType {
  showToast: (type: ToastType, message: string) => void;
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
    setTimeout(() => setToast(null), 3000); // Hide toast after 3 seconds
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Toast
          type={toast.type as "success" | "info" | "warning" | "error"}
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
