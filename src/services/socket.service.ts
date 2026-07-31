import AppConfig from "../AppConfig";

export type ISocketMessage = {
  type: string;
  message?: string;
  data?: any;
  created_at: string;
};

class SocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private listeners: ((data: ISocketMessage) => void)[] = [];
  private isConnected = false;
  private token: string | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private isConnecting = false;

  connect(token: string | null): void {
    // Don't connect if already connecting or no token
    if (this.isConnecting) {
      console.log("🔌 Connection already in progress");
      return;
    }

    if (!token || token.trim() === "") {
      console.log("🔌 No token, skipping WebSocket");
      this.disconnect();
      return;
    }

    // If already connected with same token, skip
    if (this.ws?.readyState === WebSocket.OPEN && this.token === token) {
      return;
    }

    // Clean previous connection
    this.cleanup();

    const cleanToken = token.replace(/^"|"$/g, "").trim();
    this.token = cleanToken;
    this.isConnecting = true;

    const wsUrl = `${AppConfig.SERVER_WS_BASE_URL}/cable?token=${cleanToken}`;
    console.log("🔌 Connecting to WebSocket...");
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = this.handleOpen.bind(this);
    this.ws.onmessage = this.handleMessage.bind(this);
    this.ws.onclose = this.handleClose.bind(this);
    this.ws.onerror = this.handleError.bind(this);
  }

  disconnect(): void {
    this.token = null;
    this.isConnecting = false;
    this.reconnectAttempts = 0;
    this.cleanup();
  }

  private cleanup(): void {
    // Clear reconnect timer
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    // Close WebSocket
    if (this.ws) {
      // Remove all listeners to prevent memory leaks
      this.ws.onopen = null;
      this.ws.onmessage = null;
      this.ws.onclose = null;
      this.ws.onerror = null;

      if (
        this.ws.readyState === WebSocket.OPEN ||
        this.ws.readyState === WebSocket.CONNECTING
      ) {
        this.ws.close();
      }
      this.ws = null;
    }

    this.isConnected = false;
  }

  private handleOpen(): void {
    console.log("🔌 WebSocket connected");
    this.isConnected = true;
    this.isConnecting = false;
    this.reconnectAttempts = 0;
    this.subscribe();
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data);

      // Handle different message types
      if (data.type === "welcome") {
        console.log("👋 WebSocket welcome");
        return;
      }

      if (data.type === "ping") {
        // Keep-alive, ignore
        return;
      }

      if (data.type === "confirm_subscription") {
        console.log("✅ WebSocket subscription confirmed:", data);
        return;
      }

      // Check if the message is nested under "message" (Action Cable format)
      if (data.message && data.message.type === "notification") {
        this.notifyListeners(data.message);
        return;
      }
    } catch (error) {
      console.error("WebSocket parse error:", error);
    }
  }

  private handleClose(event: CloseEvent): void {
    console.log("🔌 WebSocket disconnected");
    this.isConnected = false;
    this.isConnecting = false;

    // Only reconnect if we have a token and not manually disconnected
    if (this.token && event.code !== 1000) {
      this.reconnect();
    }
  }

  private handleError(error: Event): void {
    console.error("WebSocket error:", error);
    // Don't reconnect here - onclose will handle it
  }

  private subscribe(): void {
    const message = {
      command: "subscribe",
      identifier: JSON.stringify({
        channel: "NotificationChannel",
      }),
    };
    this.send(message);
  }

  private send(data: any): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn("📨 SocketService: WebSocket not open, message not sent");
    }
  }

  private reconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts && this.token) {
      this.reconnectAttempts++;
      const delay = 2000 * this.reconnectAttempts; // 2s, 4s, 6s
      console.log(
        `🔄 Reconnecting in ${delay}ms... (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`,
      );

      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
      }

      this.reconnectTimer = setTimeout(() => {
        if (this.token) {
          this.connect(this.token);
        }
      }, delay);
    } else {
      console.log("❌ Max reconnect attempts reached");
      this.isConnecting = false;
    }
  }

  // ===== LISTENER SYSTEM =====

  addListener(callback: (data: ISocketMessage) => void): void {
    // Prevent duplicate listeners
    if (!this.listeners.includes(callback)) {
      this.listeners.push(callback);
    }
  }

  removeListener(callback: (data: ISocketMessage) => void): void {
    this.listeners = this.listeners.filter((cb) => cb !== callback);
  }

  // Clear all listeners
  clearListeners(): void {
    this.listeners = [];
  }

  private notifyListeners(data: ISocketMessage): void {
    // Use a copy to prevent modification during iteration
    const listeners = [...this.listeners];
    listeners.forEach((callback) => {
      try {
        callback(data);
      } catch (error) {
        console.error("Listener error:", error);
      }
    });
  }

  // ===== PUBLIC METHODS =====

  isConnectedToSocket(): boolean {
    return this.isConnected && this.ws?.readyState === WebSocket.OPEN;
  }

  sendMessage(channel: string, message: string, data: any = {}): void {
    if (!this.isConnectedToSocket()) {
      console.warn("WebSocket not connected");
      return;
    }

    this.send({
      command: "message",
      identifier: JSON.stringify({ channel }),
      data: JSON.stringify({ action: "receive", message, ...data }),
    });
  }
}

export default new SocketService();
