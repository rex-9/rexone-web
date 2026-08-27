import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import SocketService, { ISocketMessage } from "../services/socket.service";

interface INotification {
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
          case "payment_success":
          case "subscription_created":
          case "subscription_resumed":
          case "welcome":
          case "ai_response_ready":
            success(notif.message);
            break;
          case "payment_failed":
          case "subscription_canceled":
          case "ai_response_failed":
            error(notif.message);
            break;
          case "sign_in_alert":
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
