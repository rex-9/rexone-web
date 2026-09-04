import React from "react";
import { iconsLib } from "../../../assets";
import type { IApiPagination } from "../../../models";
import type { IInAppNotification } from "../types";
import { NotificationListItem } from "./NotificationListItem";

interface INotificationDropdownProps {
  error?: string | null;
  isLoading: boolean;
  isLoadingMore: boolean;
  notifications: IInAppNotification[];
  pagination: IApiPagination | null;
  unreadCount: number;
  onLoadMore: () => void;
  onMarkAllRead: () => void;
  onRead: (notification: IInAppNotification) => void;
}

export const NotificationDropdown: React.FC<INotificationDropdownProps> = ({
  error,
  isLoading,
  isLoadingMore,
  notifications,
  pagination,
  unreadCount,
  onLoadMore,
  onMarkAllRead,
  onRead,
}) => {
  const hasMore = Boolean(pagination?.next_page);
  const visibleCount = notifications.length;
  const totalCount = Math.max(pagination?.total_count ?? 0, visibleCount);

  return (
    <div className="fixed left-4 right-4 top-20 z-50 flex max-h-[calc(100vh-6rem)] flex-col overflow-hidden rounded-md border border-base-300 bg-base-100 shadow-xl sm:absolute sm:left-auto sm:right-0 sm:top-12 sm:max-h-[min(38rem,calc(100vh-6rem))] sm:w-[min(32rem,calc(100vw-2rem))]">
      <div className="flex shrink-0 items-center justify-between border-b border-base-300 px-5 py-4">
        <div>
          <h2 className="text-body-m font-semibold text-base-content">
            Notifications
          </h2>
          <p className="text-caption text-base-content/60">
            {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
          </p>
        </div>
        <button
          type="button"
          className="btn btn-ghost btn-xs btn-square"
          onClick={onMarkAllRead}
          disabled={unreadCount === 0}
          title="Mark all as read"
          aria-label="Mark all notifications as read"
        >
          <iconsLib.checkr className="h-4 w-4" />
        </button>
      </div>

      {error && (
        <div className="shrink-0 border-b border-base-300 bg-error/10 px-5 py-3 text-body-s text-error">
          {error}
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto">
        {isLoading && (
          <div className="flex h-28 items-center justify-center">
            <span className="loading loading-spinner loading-md" />
          </div>
        )}

        {!isLoading && notifications.length === 0 && !error && (
          <div className="flex h-32 flex-col items-center justify-center gap-2 px-4 text-center text-base-content/60">
            <iconsLib.inboxStack className="h-8 w-8" />
            <p className="text-body-s">No notifications yet.</p>
          </div>
        )}

        {!isLoading &&
          notifications.map((notification) => (
            <NotificationListItem
              key={notification.id}
              notification={notification}
              onRead={onRead}
            />
          ))}
      </div>

      {!isLoading && notifications.length > 0 && (
        <div className="flex shrink-0 items-center justify-between border-t border-base-300 px-5 py-3 text-caption text-base-content/60">
          <span>
            {visibleCount} of {totalCount}
          </span>
          {hasMore && (
            <button
              type="button"
              className="btn btn-ghost btn-xs"
              onClick={onLoadMore}
              disabled={isLoadingMore}
            >
              {isLoadingMore ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                "Load more"
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
