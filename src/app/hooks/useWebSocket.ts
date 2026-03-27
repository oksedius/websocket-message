"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import type { WsMessage, ConnectionStatus } from "../types/message";

const RECONNECT_DELAYS = [1000, 2000, 5000];

type UseWebSocketOptions = {
  url: string;
  onMessage: (msg: WsMessage) => void;
};

type UseWebSocketReturn = {
  status: ConnectionStatus;
  reconnectAttempts: number;
  connect: () => void;
  disconnect: () => void;
};

export function useWebSocket({
  url,
  onMessage,
}: UseWebSocketOptions): UseWebSocketReturn {
  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  const wsRef = useRef<WebSocket | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const manualDisconnectRef = useRef(false);
  const reconnectAttemptsRef = useRef(0);
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const closeSocket = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.onopen = null;
      wsRef.current.onclose = null;
      wsRef.current.onerror = null;
      wsRef.current.onmessage = null;
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  const createConnection = useCallback(() => {
    closeSocket();
    clearTimer();
    setStatus("connecting");

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      reconnectAttemptsRef.current = 0;
      setReconnectAttempts(0);
    };

    ws.onmessage = (event: MessageEvent) => {
      try {
        const parsed: unknown = JSON.parse(event.data as string);
        if (
          typeof parsed === "object" &&
          parsed !== null &&
          "type" in parsed
        ) {
          const msg = parsed as WsMessage;
          if (msg.type === "hello") {
            setStatus("connected");
          }
          onMessageRef.current(msg);
        }
      } catch {
        console.warn("WS: failed to parse message", event.data);
      }
    };

    ws.onclose = () => {
      wsRef.current = null;
      if (manualDisconnectRef.current) {
        setStatus("disconnected");
        return;
      }

      setStatus("reconnecting");
      const attempt = reconnectAttemptsRef.current;
      const delay =
        RECONNECT_DELAYS[Math.min(attempt, RECONNECT_DELAYS.length - 1)];
      reconnectAttemptsRef.current += 1;
      setReconnectAttempts(reconnectAttemptsRef.current);

      timerRef.current = setTimeout(() => {
        createConnection();
      }, delay);
    };

    ws.onerror = () => {
      console.warn("WS: connection error");
    };
  }, [url, closeSocket, clearTimer]);

  const connect = useCallback(() => {
    manualDisconnectRef.current = false;
    reconnectAttemptsRef.current = 0;
    setReconnectAttempts(0);
    createConnection();
  }, [createConnection]);

  const disconnect = useCallback(() => {
    manualDisconnectRef.current = true;
    clearTimer();
    closeSocket();
    setStatus("disconnected");
  }, [clearTimer, closeSocket]);

  useEffect(() => {
    manualDisconnectRef.current = false;
    createConnection();

    return () => {
      manualDisconnectRef.current = true;
      clearTimer();
      closeSocket();
    };
  }, [createConnection, clearTimer, closeSocket]);

  return { status, reconnectAttempts, connect, disconnect };
}