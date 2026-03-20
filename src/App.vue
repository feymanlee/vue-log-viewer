<template>
  <div class="app">
    <header class="app-header">
      <h1>Vue Log Viewer</h1>
      <div class="mode-toggle">
        <button
          :class="{ active: mode === 'static' }"
          @click="mode = 'static'"
        >
          Static
        </button>
        <button
          :class="{ active: mode === 'stream' }"
          @click="mode = 'stream'"
        >
          Stream
        </button>
      </div>
    </header>

    <div class="app-content">
      <LogViewer
        :mode="mode"
        :source="streamUrl"
        :initial-logs="mode === 'static' ? sampleLogs : undefined"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LogViewer from '@/components/LogViewer/index.vue';
import type { LogEntry, LogLevel } from '@/types/log';

const mode = ref<'static' | 'stream'>('static');
const streamUrl = ref('http://localhost:3000/logs/stream');

// 示例日志数据
const sampleLogs: LogEntry[] = Array.from({ length: 1000 }, (_, i) => {
  const levels: LogLevel[] = ['debug', 'info', 'warn', 'error', 'fatal'];
  const level = levels[Math.floor(Math.random() * levels.length)];

  return {
    id: `log-${i}`,
    timestamp: Date.now() - Math.random() * 86400000,
    level,
    message: `This is a ${level} log message #${i + 1}. ${generateRandomMessage()}`,
    source: ['api-server', 'worker', 'scheduler', 'cache'][Math.floor(Math.random() * 4)],
    metadata: Math.random() > 0.7 ? {
      requestId: `req-${Math.random().toString(36).slice(2, 10)}`,
      userId: Math.floor(Math.random() * 1000),
      duration: Math.floor(Math.random() * 1000)
    } : undefined
  };
});

function generateRandomMessage(): string {
  const messages = [
    'Processing request',
    'Database query executed',
    'Cache hit',
    'Cache miss',
    'Connection established',
    'Request completed',
    'User authenticated',
    'Data synchronized',
    'Background job started',
    'Email sent successfully',
    'File uploaded',
    'Validation failed',
    'Timeout occurred'
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}
</script>

<style scoped>
.app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background-color: #252525;
  border-bottom: 1px solid #333;
}

.app-header h1 {
  font-size: 20px;
  font-weight: 600;
  color: #e5e7eb;
}

.mode-toggle {
  display: flex;
  gap: 8px;
}

.mode-toggle button {
  padding: 8px 16px;
  border: 1px solid #444;
  border-radius: 4px;
  background-color: #333;
  color: #ccc;
  cursor: pointer;
  transition: all 0.15s;
}

.mode-toggle button:hover {
  background-color: #444;
}

.mode-toggle button.active {
  background-color: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.app-content {
  flex: 1;
  overflow: hidden;
}
</style>
