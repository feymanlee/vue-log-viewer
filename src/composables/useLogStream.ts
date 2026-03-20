import { ref, onUnmounted } from 'vue';
import type { LogEntry } from '@/types/log';

export interface LogStreamOptions {
  url: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  onLog?: (log: LogEntry) => void;
  onError?: (error: Error) => void;
}

export function useLogStream(options: LogStreamOptions) {
  const isConnected = ref(false);
  const isPaused = ref(false);
  const reconnectAttempts = ref(0);

  let eventSource: EventSource | null = null;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  const connect = () => {
    if (eventSource) return;

    eventSource = new EventSource(options.url);

    eventSource.onopen = () => {
      isConnected.value = true;
      reconnectAttempts.value = 0;
    };

    eventSource.onmessage = (event) => {
      if (isPaused.value) return;

      try {
        const log: LogEntry = JSON.parse(event.data);
        options.onLog?.(log);
      } catch (e) {
        console.error('Failed to parse log:', e);
      }
    };

    eventSource.onerror = () => {
      isConnected.value = false;
      handleReconnect();
    };
  };

  const handleReconnect = () => {
    eventSource?.close();
    eventSource = null;

    const maxAttempts = options.maxReconnectAttempts ?? 10;
    const interval = options.reconnectInterval ?? 3000;

    if (reconnectAttempts.value < maxAttempts) {
      reconnectAttempts.value++;
      reconnectTimer = setTimeout(connect, interval);
    } else {
      options.onError?.(new Error('Max reconnect attempts reached'));
    }
  };

  const disconnect = () => {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    eventSource?.close();
    eventSource = null;
    isConnected.value = false;
  };

  const pause = () => {
    isPaused.value = true;
  };

  const resume = () => {
    isPaused.value = false;
  };

  onUnmounted(disconnect);

  return {
    isConnected,
    isPaused,
    reconnectAttempts,
    connect,
    disconnect,
    pause,
    resume
  };
}
