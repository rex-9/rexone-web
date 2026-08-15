import React from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

interface AdminFormAlertProps {
  message: string;
}

export const AdminFormAlert: React.FC<AdminFormAlertProps> = ({ message }) => (
  <div
    role="alert"
    className="flex items-center gap-8 rounded-md border border-error/20 bg-error/5 px-10 py-8 text-body-s text-error"
  >
    <ExclamationCircleIcon className="h-[16px] w-[16px] shrink-0" />
    <span>{message}</span>
  </div>
);
