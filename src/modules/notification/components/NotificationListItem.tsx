import React from "react";
import { iconsLib } from "../../../assets";
import { cn } from "../../../design/helpers";
import type { IInAppNotification } from "../types";

interface INotificationListItemProps {
  notification: IInAppNotification;
  onRead: (notification: IInAppNotification) => void;
}

const formatNotificationTime = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const NotificationListItem: React.FC<INotificationListItemProps> = ({
  notification,
  onRead,
}) => {
  const title = notification.title || "Notification";

  return (
    <button
      type="button"
      className={cn(
        "flex w-full gap-3 border-b border-base-300 px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-base-200",
        !notification.read && "bg-primary/5",
      )}
      onClick={() => onRead(notification)}
    >
      <span
        className={cn(
          "mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
          notification.read ? "bg-base-200" : "bg-primary/10 text-primary",
        )}
      >
        {notification.read ? (
          <iconsLib.bell className="h-4 w-4" />
        ) : (
          <iconsLib.bellAlert className="h-4 w-4" />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <span className="block truncate text-body-s font-semibold text-base-content">
          {title}
        </span>
        <span className="mt-1 block line-clamp-2 text-body-s text-base-content/70">
          {notification.message}
        </span>
        <span className="mt-2 block text-caption text-base-content/50">
          {formatNotificationTime(notification.created_at)}
        </span>
      </div>
      {!notification.read && (
        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
      )}
    </button>
  );
};

export default NotificationListItem;
