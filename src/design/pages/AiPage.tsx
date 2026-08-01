// src/design/pages/AiPage.tsx

import React, { useState, useRef, useEffect } from "react";
import { LayoutPage } from "./LayoutPage";
import { Button, TextArea } from "../components";
import { useToast } from "../../contexts/ToastContext";
import { useLoading } from "../../contexts/LoadingContext";
import AiController from "../../controllers/ai.controller";
import { IMessage } from "../../services/ai.service";

export const AiPage: React.FC = () => {
  const { success, error } = useToast();
  const { isLoading } = useLoading();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    await AiController.loadHistory(
      null, // null for current room
      (historyMessages, roomId, roomTitle) => {
        console.log("Room ID:", roomId, "Room Title:", roomTitle);
        console.log("Loaded history:", historyMessages.length, "messages");
        if (historyMessages.length === 0) {
          // No history, show welcome message
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
      },
      (err) => {
        console.error("Failed to load history:", err);
        // Show welcome message on error
        setMessages([
          {
            id: "welcome",
            role: "assistant",
            content: "Hello! I'm your AI assistant. How can I help you today?",
            created_at: new Date().toISOString(),
          },
        ]);
      },
    );
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: IMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Build history from actual messages (last 10)
    const history = messages
      .slice(-10)
      .filter((m) => m.role !== "assistant" || m.id !== "welcome")
      .map((m) => ({
        user: m.role === "user" ? m.content : "",
        assistant: m.role === "assistant" ? m.content : "",
      }))
      .filter((h) => h.user || h.assistant);

    // ✅ Add the new user message to history
    history.push({ user: userMessage.content, assistant: "" });

    await AiController.chat(
      userMessage.content,
      null, // roomId (auto-detected)
      (response, roomId) => {
        console.log("Room ID:", roomId);
        const assistantMessage: IMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response,
          created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        success("AI responded");
      },
      (err) => {
        error(err || "Failed to get AI response");
      },
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <LayoutPage>
      <div className="flex flex-col h-[calc(100vh-200px)] max-w-3xl mx-auto w-full">
        {/* Header */}
        <div className="text-center py-4 border-b border-base-200">
          <h1 className="text-2xl font-bold">🤖 AI Assistant</h1>
          <p className="text-sm text-gray-500">Powered by DeepSeek AI</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-content"
                    : "bg-base-200"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <span className="text-xs opacity-50 mt-1 block">
                  {new Date(message.created_at).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-base-200 p-4">
          <div className="flex gap-2">
            <TextArea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              rows={3}
              className="flex-1"
              disabled={isLoading}
              showCounter
              maxLength={2000}
            />
            <Button
              variant="primary"
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="self-end"
            >
              Send
            </Button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </LayoutPage>
  );
};
