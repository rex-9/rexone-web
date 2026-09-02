// src/design/pages/AiPage.tsx

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button, TextArea, ConfirmDialog } from "../../../design/components";
import { useToast, useLoading } from "../../../contexts";
import AiController from "../ai.controller";
import { IMessage } from "..";
import { ADMIN_CHAT_ROLES } from "../../admin";

export const AiPage: React.FC = () => {
  const { success, error } = useToast();
  const { isLoading, setLoading } = useLoading();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadHistory = useCallback(async () => {
    const result = await AiController.loadHistory(null);

    if (result.success) {
      if (result.messages.length === 0) {
        setMessages([
          {
            id: "welcome",
            role: "assistant",
            content: "Hello! I'm your AI assistant. How can I help you today?",
            created_at: new Date().toISOString(),
          },
        ]);
      } else {
        setMessages(result.messages);
      }
      setIsProcessing(result.processing);
    } else {
      console.error("Failed to load history:", result.error);
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: "Hello! I'm your AI assistant. How can I help you today?",
          created_at: new Date().toISOString(),
        },
      ]);
      setIsProcessing(false);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadHistory();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadHistory]);

  useEffect(() => {
    const unsubscribe = AiController.subscribeToAiMessages(() => {
      loadHistory();
    });
    return unsubscribe;
  }, [loadHistory]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || isProcessing) return;

    const content = input.trim();
    setInput("");
    setLoading(true);

    const result = await AiController.chat(content, null);

    if (result.success && result.message) {
      setMessages((prev) => [
        ...prev.filter((message) => message.id !== "welcome"),
        result.message!,
      ]);
      setIsProcessing(true);
      success("Message sent. AI is thinking while you continue browsing.");
    } else {
      setInput(content);
      error(result.error || "Failed to get AI response");
    }

    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      (e.key === "Enter" && !e.shiftKey) ||
      ((e.ctrlKey || e.metaKey) && e.key === "Enter")
    ) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearHistory = async () => {
    setIsClearDialogOpen(false);
    const result = await AiController.clearHistory(null);

    if (result.success) {
      success("Chat history cleared");
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: "Hello! I'm your AI assistant. How can I help you today?",
          created_at: new Date().toISOString(),
        },
      ]);
    } else {
      error(result.error || "Failed to clear history");
    }
  };

  return (
    <>
      <div className="flex flex-col h-[calc(100vh-12rem)] max-w-3xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between py-4 border-b border-base-200">
          <div className="w-24" />
          <div className="text-center flex-1">
            <h1 className="text-h2 font-semibold">🤖 AI Assistant</h1>
            <p className="text-body-s text-base-content/70">
              Powered by DeepSeek AI
            </p>
          </div>
          <div className="w-24 flex justify-end">
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
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === ADMIN_CHAT_ROLES.USER
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-md p-3 ${
                  message.role === ADMIN_CHAT_ROLES.USER
                    ? "bg-primary text-primary-content"
                    : "bg-base-200"
                }`}
              >
                <p className="text-body-m whitespace-pre-wrap">
                  {message.content}
                </p>
                <span className="text-caption opacity-50 mt-1 block">
                  {new Date(message.created_at).toLocaleTimeString()}
                </span>
                {message.metadata?.status === "failed" && (
                  <span className="text-caption text-error mt-1 block">
                    AI could not complete this message. You can try again.
                  </span>
                )}
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-md p-3 bg-base-200">
                <p className="text-body-m">AI is thinking…</p>
                <span className="loading loading-dots loading-sm mt-1" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-base-200 p-4">
          <div className="flex gap-2">
            <TextArea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isProcessing ? "AI is thinking…" : "Type your message..."
              }
              rows={3}
              className="flex-1"
              disabled={isLoading || isProcessing}
              showCounter
              maxLength={2000}
            />
            <Button
              variant="primary"
              onClick={handleSend}
              isLoading={isLoading}
              disabled={isLoading || isProcessing || !input.trim()}
              className="self-end"
            >
              Send
            </Button>
          </div>
          <p className="text-caption text-base-content/60 mt-2">
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
    </>
  );
};

export default AiPage;
