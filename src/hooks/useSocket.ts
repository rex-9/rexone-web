import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import SocketService, { ISocketMessage } from "../services/socket.service";

interface Notification {
  id: string;
  message: string;
  data: any;
  created_at: string;
}

export const useSocket = () => {
  const { token, isAuthenticated } = useAuth();
  const { success, error, info } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (isAuthenticated && token) {
      SocketService.connect(token);
      setIsConnected(SocketService.isConnectedToSocket());
    } else {
      SocketService.disconnect();
      setIsConnected(false);
    }

    const handleNotification = (data: ISocketMessage) => {
      if (data.type === "notification") {
        const notif: Notification = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
          message: data.message || "Notification",
          data: data.data || {},
          created_at: data.created_at || new Date().toISOString(),
        };
        setNotifications((prev) => {
          // Prevent duplicates
          if (prev.some((n) => n.id === notif.id)) return prev;
          return [notif, ...prev];
        });

        const type = notif.data?.type || "general";

        switch (type) {
          case "payment_success":
          case "subscription_created":
          case "subscription_resumed":
          case "welcome":
            success(notif.message);
            break;
          case "payment_failed":
          case "subscription_canceled":
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
    (channel: string, message: string, data: any = {}) => {
      SocketService.sendMessage(channel, message, data);
    },
    [],
  );

  return {
    notifications,
    isConnected,
    sendMessage,
    SocketService,
  };
};
