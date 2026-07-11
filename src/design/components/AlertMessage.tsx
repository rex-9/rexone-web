import React from "react";
import { clsx } from "ts-clsx";

export interface AlertMessageProps {
  message: string;
  type: "info" | "success" | "warning" | "error";
  className?: string;
}

export const AlertMessage: React.FC<AlertMessageProps> = ({
  message,
  type,
  className,
}) => {
  let colorClass = "";

  switch (type) {
    case "info":
      colorClass = "text-info";
      break;
    case "success":
      colorClass = "text-success";
      break;
    case "warning":
      colorClass = "text-warning";
      break;
    case "error":
      colorClass = "text-error";
      break;
    default:
      colorClass = "text-error";
  }

  return <p className={clsx(colorClass, "mb-4", className)}>{message}</p>;
};

export default AlertMessage;
