"use client";

import { useState, useCallback } from "react";
import { useWebSocket } from "./hooks/useWebSocket";
import { useMessages } from "./hooks/useMessages";
import { ConnectionStatus } from "./components/ConnectionStatus";
import { MessageList } from "./components/MessageList";
import { MessageFilters } from "./components/MessageFilters";
import { ErrorBanner } from "./components/ErrorBanner";
import { MessageInput } from "./components/MessageInput";
import type { WsMessage } from "./types/message";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8080";

export default function HomePage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    messages,
    filter,
    unreadCount,
    addMessage,
    markRead,
    deleteMessage,
    setFilter,
  } = useMessages();

  const handleWsMessage = useCallback(
    (msg: WsMessage) => {
      switch (msg.type) {
        case "hello":
          break;

        case "message":
          addMessage({
            id: msg.data.id,
            text: msg.data.text,
            createdAt: msg.data.createdAt,
            receivedAt: new Date().toISOString(),
            isRead: false,
            isSystem: false,
          });
          break;

        case "system":
          addMessage({
            id: `system-${msg.data.createdAt}`,
            text: msg.data.text,
            createdAt: msg.data.createdAt,
            receivedAt: new Date().toISOString(),
            isRead: true,
            isSystem: true,
          });
          break;

        case "message_read":
          markRead(msg.data.id);
          break;

        case "message_deleted":
          deleteMessage(msg.data.id);
          break;

        case "error":
          setErrorMessage(msg.data.message);
          break;
      }
    },
    [addMessage, markRead, deleteMessage]
  );

  const { status, reconnectAttempts, connect, disconnect, sendMessage } =
    useWebSocket({
      url: WS_URL,
      onMessage: handleWsMessage,
    });

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-4">

        <h1 className="text-2xl font-bold text-gray-900">
          Real-Time Messages Dashboard
        </h1>

        <ConnectionStatus
          status={status}
          reconnectAttempts={reconnectAttempts}
          onReconnect={connect}
          onDisconnect={disconnect}
        />

        <ErrorBanner
          message={errorMessage}
          onClose={() => setErrorMessage(null)}
        />

        {/* Инпут для отправки сообщений */}
        <MessageInput onSend={sendMessage} status={status} />

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            Unread:{" "}
            <span className="text-blue-600 font-bold">{unreadCount}</span>
          </span>
          <span className="text-xs text-gray-400">
            Total: {messages.length}
          </span>
        </div>

        <MessageFilters current={filter} onChange={setFilter} />

        <MessageList messages={messages} onRead={markRead} />
      </div>
    </main>
  );
}