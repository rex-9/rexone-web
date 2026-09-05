import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import SocketService, { ISocketMessage } from "../services/socket.service";
import { NOTIFICATION_SOCKET_TYPES } from "../modules/notification/constants";

export interface INotification {
  id: string;
  message: string;
  data: Record<string, unknown>;
  created_at: string;
}

export const useSocket = () => {
  const { token, isAuthenticated } = useAuth();
  const { success, error, info } = useToast();
  const [notifications, setNotifications] = useState<INotification[]>([]);

  useEffect(() => {
    if (isAuthenticated && token) {
      SocketService.connect(token);
    } else {
      SocketService.disconnect();
    }

    const handleNotification = (data: ISocketMessage) => {
      if (data.type === "notification") {
        if (!data.message) {
          return;
        }

        const notif: INotification = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
          message: data.message,
          data: data.data || {},
          created_at: data.created_at || new Date().toISOString(),
        };
        setNotifications((prev) => {
          // Prevent duplicates
          if (prev.some((n) => n.id === notif.id)) return prev;
          return [notif, ...prev];
        });

        const type = typeof notif.data.type === "string" ? notif.data.type : "general";

        switch (type) {
          case NOTIFICATION_SOCKET_TYPES.PAYMENT_SUCCESS:
          case NOTIFICATION_SOCKET_TYPES.SUBSCRIPTION_CREATED:
          case NOTIFICATION_SOCKET_TYPES.SUBSCRIPTION_RESUMED:
          case NOTIFICATION_SOCKET_TYPES.WELCOME:
          case NOTIFICATION_SOCKET_TYPES.AI_RESPONSE_READY:
          case NOTIFICATION_SOCKET_TYPES.TTS_READY:
          case NOTIFICATION_SOCKET_TYPES.ASSET_COMPRESSED:
            success(notif.message);
            break;
          case NOTIFICATION_SOCKET_TYPES.PAYMENT_FAILED:
          case NOTIFICATION_SOCKET_TYPES.SUBSCRIPTION_CANCELED:
          case NOTIFICATION_SOCKET_TYPES.AI_RESPONSE_FAILED:
          case NOTIFICATION_SOCKET_TYPES.TTS_FAILED:
          case NOTIFICATION_SOCKET_TYPES.ASSET_COMPRESSION_FAILED:
            error(notif.message);
            break;
          case NOTIFICATION_SOCKET_TYPES.ASSET_COMPRESSING:
          case NOTIFICATION_SOCKET_TYPES.SIGN_IN_ALERT:
          default:
            info(notif.message);
            break;
        }
      }
    };

    SocketService.addListener(handleNotification);

    return () => {
      SocketService.removeListener(handleNotification);
      // Don't disconnect here - let the effect handle it
    };
  }, [token, isAuthenticated, success, error, info]);

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
