// src/design/pages/AiPage.tsx

import React, { useState, useRef, useEffect, useCallback } from "react";
import { LayoutPage } from "../../../design/pages/LayoutPage";
import { Button, TextArea, ConfirmDialog } from "../../../design/components";
import { useToast } from "../../../contexts/ToastContext";
import AiController from "../ai.controller";
import { IMessage } from "..";
import SocketService, {
  ISocketMessage,
} from "../../../services/socket.service";

export const AiPage: React.FC = () => {
  const { success, error } = useToast();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadHistory = useCallback(async () => {
    await AiController.loadHistory(
      null, // null for current room
      (historyMessages, roomId, roomTitle, processing) => {
        console.log("Room ID:", roomId, "Room Title:", roomTitle);
        console.log("Loaded history:", historyMessages.length, "messages");
        if (historyMessages.length === 0) {
          setMessages([
            {
              id: "welcome",
              role: "assistant",
              content:
                "Hello! I'm your AI assistant. How can I help you today?",
              created_at: new Date().toISOString(),
            },
          ]);
        } else {
          setMessages(historyMessages);
        }
        setIsProcessing(processing);
      },
      (err) => {
        console.error("Failed to load history:", err);
        setMessages([
          {
            id: "welcome",
            role: "assistant",
            content: "Hello! I'm your AI assistant. How can I help you today?",
            created_at: new Date().toISOString(),
          },
        ]);
        setIsProcessing(false);
      },
    );
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    const handleAiMessage = (event: ISocketMessage) => {
      const eventType =
        typeof event.data?.type === "string" ? event.data.type : "";
      const roomId =
        typeof event.data?.room_id === "string" ? event.data.room_id : "";

      if (
        event.type !== "notification" ||
        !["ai_response_ready", "ai_response_failed"].includes(eventType) ||
        roomId !== AiController.getCurrentRoomId()
      ) {
        return;
      }

      loadHistory();
    };

    SocketService.addListener(handleAiMessage);
    return () => SocketService.removeListener(handleAiMessage);
  }, [loadHistory]);

  const handleSend = async () => {
    if (!input.trim() || isSubmitting || isProcessing) return;

    const content = input.trim();
    setInput("");
    setIsSubmitting(true);

    await AiController.chat(
      content,
      null, // roomId (auto-detected)
      (queuedMessage, roomId) => {
        console.log("Room ID:", roomId);
        setMessages((prev) => [
          ...prev.filter((message) => message.id !== "welcome"),
          queuedMessage,
        ]);
        setIsProcessing(true);
        success("Message sent. AI is thinking while you continue browsing.");
      },
      (err) => {
        setInput(content);
        error(err || "Failed to get AI response");
      },
    );

    setIsSubmitting(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearHistory = async () => {
    setIsClearDialogOpen(false);
    await AiController.clearHistory(
      null,
      () => {
        success("Chat history cleared");
        setMessages([
          {
            id: "welcome",
            role: "assistant",
            content: "Hello! I'm your AI assistant. How can I help you today?",
            created_at: new Date().toISOString(),
          },
        ]);
      },
      (err) => error(err),
    );
  };

  return (
    <LayoutPage>
      <div className="flex flex-col h-[calc(100vh-200px)] max-w-3xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between py-16 border-b border-base-200">
          <div className="w-[100px]" />
          <div className="text-center flex-1">
            <h1 className="text-h2 font-semibold">🤖 AI Assistant</h1>
            <p className="text-body-s text-base-content/70">
              Powered by DeepSeek AI
            </p>
          </div>
          <div className="w-[100px] flex justify-end">
            {messages.length > 1 && (
              <Button
                variant="tertiary"
                size="sm"
                onClick={() => setIsClearDialogOpen(true)}
              >
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-16 space-y-16">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-m p-12 ${
                  message.role === "user"
                    ? "bg-primary text-primary-content"
                    : "bg-base-200"
                }`}
              >
                <p className="text-body-m whitespace-pre-wrap">
                  {message.content}
                </p>
                <span className="text-caption opacity-50 mt-4 block">
                  {new Date(message.created_at).toLocaleTimeString()}
                </span>
                {message.metadata?.status === "failed" && (
                  <span className="text-caption text-error mt-4 block">
                    AI could not complete this message. You can try again.
                  </span>
                )}
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-m p-12 bg-base-200">
                <p className="text-body-m">AI is thinking…</p>
                <span className="loading loading-dots loading-sm mt-4" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-base-200 p-16">
          <div className="flex gap-8">
            <TextArea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isProcessing ? "AI is thinking…" : "Type your message..."
              }
              rows={3}
              className="flex-1"
              disabled={isSubmitting || isProcessing}
              showCounter
              maxLength={2000}
            />
            <Button
              variant="primary"
              onClick={handleSend}
              disabled={isSubmitting || isProcessing || !input.trim()}
              className="self-end"
            >
              {isSubmitting ? "Sending…" : "Send"}
            </Button>
          </div>
          <p className="text-caption text-base-content/60 mt-8">
            {isProcessing
              ? "You can leave this page. We’ll notify you when the response is ready."
              : "Press Enter to send, Shift+Enter for new line"}
          </p>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isClearDialogOpen}
        onClose={() => setIsClearDialogOpen(false)}
        onConfirm={handleClearHistory}
        title="Clear History"
        message="All messages in this conversation will be permanently deleted. Are you sure you want to clear chat history?"
        confirmLabel="Clear History"
        cancelLabel="Cancel"
        isDestructive={true}
      />
    </LayoutPage>
  );
};
