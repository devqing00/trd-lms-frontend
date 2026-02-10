"use client";

import { useEffect, useRef, useCallback, useState } from "react";

/* ─── Types ─── */

export type RealtimeEvent = {
  type: string;
  payload: Record<string, unknown>;
  timestamp: number;
};

type ConnectionStatus = "connecting" | "connected" | "disconnected" | "error";

interface UseRealtimeOptions {
  /** SSE endpoint URL */
  url: string;
  /** Auto-reconnect on disconnect (default: true) */
  autoReconnect?: boolean;
  /** Reconnect delay in ms (default: 3000) */
  reconnectDelay?: number;
  /** Max reconnect attempts (default: 10) */
  maxReconnectAttempts?: number;
  /** Event handler */
  onEvent?: (event: RealtimeEvent) => void;
  /** Connection status change handler */
  onStatusChange?: (status: ConnectionStatus) => void;
  /** Enable the connection (default: true) */
  enabled?: boolean;
}

/**
 * Hook for Server-Sent Events (SSE) real-time connection.
 *
 * SSE is preferred over WebSocket for this use case because:
 * - Simpler server-side implementation (standard HTTP)
 * - Automatic reconnection built into the EventSource API
 * - Works through HTTP proxies and load balancers
 * - Sufficient for one-way server → client updates
 *
 * Usage:
 * ```tsx
 * const { status, lastEvent } = useRealtime({
 *   url: "/api/events",
 *   onEvent: (event) => {
 *     if (event.type === "attendance-update") { ... }
 *   },
 * });
 * ```
 */
function useRealtime({
  url,
  autoReconnect = true,
  reconnectDelay = 3000,
  maxReconnectAttempts = 10,
  onEvent,
  onStatusChange,
  enabled = true,
}: UseRealtimeOptions) {
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");
  const [lastEvent, setLastEvent] = useState<RealtimeEvent | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const connectRef = useRef<() => void>(undefined);

  const updateStatus = useCallback(
    (newStatus: ConnectionStatus) => {
      setStatus(newStatus);
      onStatusChange?.(newStatus);
    },
    [onStatusChange]
  );

  const disconnect = useCallback(() => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
    }
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    updateStatus("disconnected");
  }, [updateStatus]);

  const connect = useCallback(() => {
    if (typeof window === "undefined" || !("EventSource" in window)) return;

    // Clean up existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    updateStatus("connecting");

    try {
      const eventSource = new EventSource(url);
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        reconnectAttemptsRef.current = 0;
        updateStatus("connected");
      };

      eventSource.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data) as RealtimeEvent;
          setLastEvent(data);
          onEvent?.(data);
        } catch {
          // Non-JSON message, wrap it
          const event: RealtimeEvent = {
            type: "message",
            payload: { data: e.data },
            timestamp: Date.now(),
          };
          setLastEvent(event);
          onEvent?.(event);
        }
      };

      eventSource.onerror = () => {
        eventSource.close();
        eventSourceRef.current = null;
        updateStatus("error");

        // Auto-reconnect
        if (autoReconnect && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current += 1;
          const delay = reconnectDelay * Math.min(reconnectAttemptsRef.current, 5);
          reconnectTimerRef.current = setTimeout(() => connectRef.current?.(), delay);
        } else {
          updateStatus("disconnected");
        }
      };
    } catch {
      updateStatus("error");
    }
  }, [url, autoReconnect, reconnectDelay, maxReconnectAttempts, onEvent, updateStatus]);

  // Keep connectRef in sync with latest connect callback
  useEffect(() => {
    connectRef.current = connect;
  }, [connect]);

  // Connect/disconnect based on enabled state
  useEffect(() => {
    if (enabled) {
      const timer = setTimeout(connect, 0);
      return () => {
        clearTimeout(timer);
        disconnect();
      };
    }
    const timer = setTimeout(disconnect, 0);
    return () => {
      clearTimeout(timer);
    };
  }, [enabled, connect, disconnect]);

  return {
    status,
    lastEvent,
    reconnect: connect,
    disconnect,
  };
}

/* ─── WebSocket hook (for bidirectional communication) ─── */

interface UseWebSocketOptions {
  url: string;
  onMessage?: (data: unknown) => void;
  onStatusChange?: (status: ConnectionStatus) => void;
  autoReconnect?: boolean;
  reconnectDelay?: number;
  enabled?: boolean;
}

function useWebSocket({
  url,
  onMessage,
  onStatusChange,
  autoReconnect = true,
  reconnectDelay = 3000,
  enabled = true,
}: UseWebSocketOptions) {
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const connectRef = useRef<() => void>(undefined);

  const updateStatus = useCallback(
    (s: ConnectionStatus) => {
      setStatus(s);
      onStatusChange?.(s);
    },
    [onStatusChange]
  );

  const send = useCallback((data: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }, []);

  const disconnect = useCallback(() => {
    if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    updateStatus("disconnected");
  }, [updateStatus]);

  const connect = useCallback(() => {
    if (typeof window === "undefined") return;

    if (wsRef.current) wsRef.current.close();
    updateStatus("connecting");

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        reconnectAttemptsRef.current = 0;
        updateStatus("connected");
      };

      ws.onmessage = (e) => {
        try {
          onMessage?.(JSON.parse(e.data));
        } catch {
          onMessage?.(e.data);
        }
      };

      ws.onclose = () => {
        wsRef.current = null;
        updateStatus("disconnected");
        if (autoReconnect && reconnectAttemptsRef.current < 10) {
          reconnectAttemptsRef.current += 1;
          reconnectTimerRef.current = setTimeout(
            () => connectRef.current?.(),
            reconnectDelay * Math.min(reconnectAttemptsRef.current, 5)
          );
        }
      };

      ws.onerror = () => {
        updateStatus("error");
      };
    } catch {
      updateStatus("error");
    }
  }, [url, onMessage, autoReconnect, reconnectDelay, updateStatus]);

  // Keep connectRef in sync with latest connect callback
  useEffect(() => {
    connectRef.current = connect;
  }, [connect]);

  useEffect(() => {
    if (enabled) {
      const timer = setTimeout(connect, 0);
      return () => {
        clearTimeout(timer);
        disconnect();
      };
    }
    const timer = setTimeout(disconnect, 0);
    return () => {
      clearTimeout(timer);
    };
  }, [enabled, connect, disconnect]);

  return { status, send, disconnect, reconnect: connect };
}

export { useRealtime, useWebSocket };
export type { ConnectionStatus, UseRealtimeOptions, UseWebSocketOptions };
