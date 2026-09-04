import React, { useEffect, useRef, useState } from "react";
import { iconsLib } from "../../../assets";
import { Button } from "../../../design/components/button";
import { ButtonTypes, ButtonVariants, ComponentSizes } from "../../../design/constants";
import { cn } from "../../../design/helpers";
import type { INotification as ISocketNotification } from "../../../hooks/useSocket";
import { useInAppNotifications } from "../hooks/useInAppNotifications";
import { NotificationDropdown } from "./NotificationDropdown";

interface INotificationBellProps {
  liveNotifications?: ISocketNotification[];
}

export const NotificationBell: React.FC<INotificationBellProps> = ({
  liveNotifications = [],
}) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const {
    error,
    isLoading,
    isLoadingMore,
    loadMore,
    markAllRead,
    markRead,
    notifications,
    pagination,
    unreadCount,
  } = useInAppNotifications(liveNotifications);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [isOpen]);

  return (
    <div ref={rootRef} className="relative block">
      <Button
        type={ButtonTypes.BUTTON}
        variant={ButtonVariants.TERTIARY}
        size={ComponentSizes.SM}
        className="relative h-10 w-10 p-0 inline-flex items-center justify-center"
        onClick={() => setIsOpen((value) => !value)}
        aria-label="Notifications"
        title="Notifications"
      >
        <iconsLib.bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span
            className={cn(
              "absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold leading-none text-primary-content",
              unreadCount > 9 && "min-w-6",
            )}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <NotificationDropdown
          error={error}
          isLoading={isLoading}
          isLoadingMore={isLoadingMore}
          notifications={notifications}
          pagination={pagination}
          unreadCount={unreadCount}
          onLoadMore={loadMore}
          onMarkAllRead={markAllRead}
          onRead={markRead}
        />
      )}
    </div>
  );
};

export default NotificationBell;
