// src/hooks/useAiSocket.ts
// Not Used Yet, useful in the future for AI streaming responses via WebSocket

import { useState, useCallback, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import SocketService from "../services/socket.service";

interface UseAiSocketProps {
  roomId?: string | null;
}

export const useAiSocket = ({ roomId = null }: UseAiSocketProps = {}) => {
  const { token, isAuthenticated } = useAuth();
  const [isStreaming, setIsStreaming] = useState(false);
  const [response, setResponse] = useState("");
  const [fullResponse, setFullResponse] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (isAuthenticated && token) {
      SocketService.connect(token);
      setIsConnected(SocketService.isConnectedToSocket());
    }

    const handleAiMessage = (data: any) => {
      if (data.type === "typing") {
        setIsStreaming(data.status === "started");
        if (data.status === "started") {
          setFullResponse("");
          setResponse("");
        }
        if (data.status === "ended") {
          setIsStreaming(false);
        }
      }

      if (data.type === "chunk") {
        setResponse((prev) => prev + data.content);
        setFullResponse((prev) => prev + data.content);
      }

      if (data.type === "error") {
        console.error("AI Error:", data.error);
        setIsStreaming(false);
      }
    };

    SocketService.addListener(handleAiMessage);

    return () => {
      SocketService.removeListener(handleAiMessage);
    };
  }, [token, isAuthenticated]);

  const sendMessage = useCallback(
    (
      message: string,
      history: Array<{ user: string; assistant: string }> = [],
    ) => {
      setResponse("");
      setFullResponse("");
      setIsStreaming(true);

      SocketService.sendMessage("AiChannel", message, {
        history,
        room_id: roomId,
      });
    },
    [roomId],
  );

  const resetResponse = useCallback(() => {
    setResponse("");
    setFullResponse("");
  }, []);

  return {
    sendMessage,
    response,
    fullResponse,
    isStreaming,
    isConnected,
    resetResponse,
  };
};
