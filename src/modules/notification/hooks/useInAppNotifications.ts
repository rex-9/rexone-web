import { useCallback, useEffect, useMemo, useState } from "react";
import type { INotification as ISocketNotification } from "../../../hooks/useSocket";
import type { IApiPagination } from "../../../models";
import NotificationController from "../notification.controller";
import type { IInAppNotification } from "../types";

const NOTIFICATION_DROPDOWN_PAGE_LIMIT = 10;

const mergeNotifications = (
  current: IInAppNotification[],
  incoming: IInAppNotification[],
): IInAppNotification[] => {
  const byId = new Map<string, IInAppNotification>();

  [...incoming, ...current].forEach((notification) => {
    const existing = byId.get(notification.id);
    const isRead = Boolean(existing?.read || notification.read);

    byId.set(notification.id, {
      ...notification,
      read: isRead,
      read_at: existing?.read_at || notification.read_at,
    });
  });

  return Array.from(byId.values()).sort(
    (first, second) =>
      new Date(second.created_at).getTime() -
      new Date(first.created_at).getTime(),
  );
};

const fromSocketNotification = (
  notification: ISocketNotification,
): IInAppNotification => ({
  id: notification.id,
  title: notification.title || null,
  message: notification.message,
  event:
    typeof notification.data.type === "string" ? notification.data.type : null,
  data: notification.data,
  read: notification.read ?? false,
  read_at: null,
  created_at: notification.created_at,
});

export const useInAppNotifications = (
  liveNotifications: ISocketNotification[] = [],
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<IInAppNotification[]>([]);
  const [pagination, setPagination] = useState<IApiPagination | null>(null);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications],
  );

  const loadNotifications = useCallback(async (page = 1) => {
    if (page === 1) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }

    setError(null);

    const result = await NotificationController.getNotifications({
      limit: NOTIFICATION_DROPDOWN_PAGE_LIMIT,
      page,
    });

    if (result.error) {
      setError(result.error);
    } else {
      setPagination(result.pagination);
      setNotifications((current) =>
        mergeNotifications(current, result.notifications),
      );
    }

    if (page === 1) {
      setIsLoading(false);
    } else {
      setIsLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadNotifications();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadNotifications]);

  useEffect(() => {
    if (liveNotifications.length === 0) return;

    const timer = window.setTimeout(() => {
      setNotifications((current) =>
        mergeNotifications(
          current,
          liveNotifications.map(fromSocketNotification),
        ),
      );
    }, 0);

    return () => window.clearTimeout(timer);
  }, [liveNotifications]);

  const markRead = async (notification: IInAppNotification) => {
    if (notification.read) return;

    setNotifications((current) =>
      current.map((item) =>
        item.id === notification.id
          ? { ...item, read: true, read_at: new Date().toISOString() }
          : item,
      ),
    );

    const result = await NotificationController.markRead(notification.id);
    if (result.notification) {
      const readNotification = result.notification;
      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id ? readNotification : item,
        ),
      );
    }
  };

  const markAllRead = async () => {
    if (unreadCount === 0) return;

    const readAt = new Date().toISOString();
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
        read_at: notification.read_at || readAt,
      })),
    );

    const result = await NotificationController.markAllRead();
    if (result.error) {
      setError(result.error);
      void loadNotifications();
    }
  };

  const loadMore = () => {
    if (!pagination?.next_page || isLoadingMore) return;

    void loadNotifications(pagination.next_page);
  };

  return {
    error,
    isLoading,
    isLoadingMore,
    loadMore,
    markAllRead,
    markRead,
    notifications,
    pagination,
    unreadCount,
  };
};
