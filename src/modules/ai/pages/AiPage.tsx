// src/modules/ai/pages/AiPage.tsx

import React, { useState, useRef, useEffect, useCallback } from "react";
import { LayoutPage } from "../../../design/pages/LayoutPage";
import { Button, TextArea, ConfirmDialog } from "../../../design/components";
import { ButtonVariants, ComponentSizes } from "../../../design/constants";
import { useToast } from "../../../contexts/ToastContext";
import AiController from "../ai.controller";
import { IMessage } from "..";

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
    loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    const unsubscribe = AiController.subscribeToAiMessages(() => {
      loadHistory();
    });
    return unsubscribe;
  }, [loadHistory]);

  const handleSend = async () => {
    if (!input.trim() || isSubmitting || isProcessing) return;

    const content = input.trim();
    setInput("");
    setIsSubmitting(true);

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

    setIsSubmitting(false);
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
    <LayoutPage>
      <div className="flex flex-col h-[calc(100dvh-11rem)] max-w-3xl mx-auto w-full bg-base-100/60 border border-base-300 rounded-2xl shadow-xl backdrop-blur-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-base-300 bg-base-100/80">
          <div className="w-20" />
          <div className="text-center flex-1">
            <h1 className="text-xl font-bold font-primary text-base-content">🤖 AI Assistant</h1>
            <p className="text-xs text-base-content/60">
              Powered by DeepSeek AI
            </p>
          </div>
          <div className="w-20 flex justify-end">
            {messages.length > 1 && (
              <Button
                variant={ButtonVariants.TERTIARY}
                size={ComponentSizes.SM}
                onClick={() => setIsClearDialogOpen(true)}
              >
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((message) => {
            const isUser = message.role === "user";
            return (
              <div
                key={message.id}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-md sm:max-w-xl px-4 py-3 ${
                    isUser
                      ? "bg-primary text-white rounded-2xl rounded-tr-xs shadow-neon"
                      : "bg-base-200 border border-base-300 text-base-content rounded-2xl rounded-tl-xs shadow-sm"
                  }`}
                >
                  <p className="text-body-m whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </p>
                  <span
                    className={`text-caption mt-1.5 block ${
                      isUser ? "text-white/80 text-right" : "text-base-content/50"
                    }`}
                  >
                    {new Date(message.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </span>
                  {message.metadata?.status === "failed" && (
                    <span className="text-caption text-error mt-1 block">
                      AI could not complete this message. You can try again.
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {isProcessing && (
            <div className="flex justify-start">
              <div className="max-w-md sm:max-w-xl px-4 py-3 rounded-2xl rounded-tl-xs bg-base-200 border border-base-300 shadow-sm flex items-center gap-3">
                <span className="text-body-m font-medium text-base-content">AI is thinking</span>
                <span className="loading loading-dots loading-xs text-primary" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-base-300 p-4 bg-base-100/90">
          <div className="flex gap-3 items-end">
            <TextArea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isProcessing ? "AI is thinking…" : "Type your message..."
              }
              rows={2}
              className="flex-1 resize-none"
              disabled={isSubmitting || isProcessing}
              showCounter
              maxLength={2000}
            />
            <Button
              variant={ButtonVariants.PRIMARY}
              size={ComponentSizes.MD}
              onClick={handleSend}
              disabled={isSubmitting || isProcessing || !input.trim()}
              className="shrink-0 mb-1"
            >
              {isSubmitting ? "Sending…" : "Send"}
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
    </LayoutPage>
  );
};
