import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { getSocketToast, SOCKET_MESSAGE_TYPES } from "../helpers/socket.helpers";
import { getUtcNowIso } from "../helpers";
import SocketService, { ISocketMessage } from "../services/socket.service";
import { NOTIFICATION_SOCKET_TYPES } from "../modules/notification";
import { ToastTypes } from "../constants";

export interface INotification {
  id: string;
  message: string;
  data: Record<string, unknown>;
  created_at: string;
}

export const useSocket = () => {
  const { token, isAuthenticated, refreshCurrentUser } = useAuth();
  const { success, error, info, warning } = useToast();
  const [notifications, setNotifications] = useState<INotification[]>([]);

  useEffect(() => {
    if (isAuthenticated && token) {
      SocketService.connect(token);
    } else {
      SocketService.disconnect();
    }

    const handleNotification = (data: ISocketMessage) => {
      const payloadType = (data.data?.type as string) || data.type;
      const isEntitlementEvent =
        payloadType === NOTIFICATION_SOCKET_TYPES.PAYMENT_SUCCESS ||
        payloadType === NOTIFICATION_SOCKET_TYPES.SUBSCRIPTION_CREATED ||
        payloadType === NOTIFICATION_SOCKET_TYPES.SUBSCRIPTION_RESUMED ||
        payloadType === NOTIFICATION_SOCKET_TYPES.SUBSCRIPTION_CANCELED ||
        payloadType === "access_granted" ||
        payloadType === "access_revoked" ||
        payloadType === "payment_intent_succeeded";

      if (isEntitlementEvent) {
        void refreshCurrentUser();
      }

      const toast = getSocketToast(data);
      if (!toast) {
        return;
      }

      // Only accumulate in persistent notification state if payload is a domain notification
      if (data.type === SOCKET_MESSAGE_TYPES.NOTIFICATION && data.message) {
        const notif: INotification = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
          message: data.message,
          data: data.data || {},
          created_at: data.created_at || getUtcNowIso(),
        };
        setNotifications((prev) => {
          if (prev.some((n) => n.id === notif.id)) return prev;
          return [notif, ...prev];
        });
      }

      if (toast.kind === ToastTypes.SUCCESS) {
        success(toast.message);
        return;
      }

      if (toast.kind === ToastTypes.ERROR) {
        error(toast.message);
        return;
      }

      if (toast.kind === ToastTypes.WARNING) {
        warning(toast.message);
        return;
      }

      info(toast.message);
    };

    SocketService.addListener(handleNotification);

    return () => {
      SocketService.removeListener(handleNotification);
      // Don't disconnect here - let the effect handle it
    };
  }, [token, isAuthenticated, success, error, info, warning]);

  const sendMessage = useCallback(
    (channel: string, message: string, data: Record<string, unknown> = {}) => {
      SocketService.sendMessage(channel, message, data);
    },
    [],
  );

  return {
    notifications,
    isConnected: SocketService.isConnectedToSocket(),
    sendMessage,
    SocketService,
  };
};
