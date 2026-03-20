<template>
  <div
    class="log-item"
    :class="[`level-${log.level}`, { 'wrap-lines': viewState.wrapLines }]"
    @click="toggleExpand"
  >
    <!-- 行号 -->
    <span v-if="viewState.showLineNumbers" class="line-number">
      {{ lineNumber }}
    </span>

    <!-- 时间戳 -->
    <span v-if="viewState.showTimestamp" class="timestamp">
      {{ formattedTimestamp }}
    </span>

    <!-- 日志级别 -->
    <span class="level-badge" :class="log.level">
      {{ log.level.toUpperCase() }}
    </span>

    <!-- 来源 -->
    <span v-if="log.source" class="source">[{{ log.source }}]</span>

    <!-- 消息内容 -->
    <span class="message" v-html="highlightedMessage"></span>

    <!-- 展开的元数据 -->
    <div v-if="isExpanded && log.metadata" class="metadata">
      <JsonViewer :data="log.metadata" :max-depth="3" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { LogEntry, ViewState } from '@/types/log';
import JsonViewer from '@/components/JsonViewer/index.vue';

const props = defineProps<{
  log: LogEntry;
  viewState: ViewState;
  lineNumber: number;
  searchQuery?: string;
}>();

const isExpanded = ref(false);

const toggleExpand = () => {
  if (props.log.metadata) {
    isExpanded.value = !isExpanded.value;
  }
};

const formattedTimestamp = computed(() => {
  const date = new Date(props.log.timestamp);
  const format = props.viewState.timestampFormat;

  // Simple format replacement
  return format
    .replace('YYYY', String(date.getFullYear()))
    .replace('MM', String(date.getMonth() + 1).padStart(2, '0'))
    .replace('DD', String(date.getDate()).padStart(2, '0'))
    .replace('HH', String(date.getHours()).padStart(2, '0'))
    .replace('mm', String(date.getMinutes()).padStart(2, '0'))
    .replace('ss', String(date.getSeconds()).padStart(2, '0'));
});

const highlightedMessage = computed(() => {
  if (!props.searchQuery?.trim()) return escapeHtml(props.log.message);

  const query = escapeRegex(props.searchQuery);
  const regex = new RegExp(`(${query})`, 'gi');
  return escapeHtml(props.log.message).replace(
    regex,
    '<mark>$1</mark>'
  );
});

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
</script>

<style scoped>
.log-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 4px 8px;
  font-family: 'Monaco', 'Consolas', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.5;
  border-bottom: 1px solid var(--log-border-color, #333);
  cursor: pointer;
  transition: background-color 0.15s;
}

.log-item:hover {
  background-color: var(--log-hover-bg, #2a2a2a);
}

.log-item.wrap-lines {
  flex-wrap: wrap;
}

.line-number {
  min-width: 50px;
  text-align: right;
  color: var(--log-line-number-color, #666);
  user-select: none;
}

.timestamp {
  color: var(--log-timestamp-color, #888);
  user-select: none;
  white-space: nowrap;
}

.level-badge {
  min-width: 50px;
  text-align: center;
  padding: 0 6px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: bold;
  text-transform: uppercase;
}

.level-badge.debug {
  background-color: var(--log-debug-bg, #374151);
  color: var(--log-debug-color, #9ca3af);
}

.level-badge.info {
  background-color: var(--log-info-bg, #1e3a5f);
  color: var(--log-info-color, #60a5fa);
}

.level-badge.warn {
  background-color: var(--log-warn-bg, #4a4000);
  color: var(--log-warn-color, #fbbf24);
}

.level-badge.error {
  background-color: var(--log-error-bg, #450a0a);
  color: var(--log-error-color, #f87171);
}

.level-badge.fatal {
  background-color: var(--log-fatal-bg, #450a0a);
  color: var(--log-fatal-color, #ef4444);
}

.source {
  color: var(--log-source-color, #a78bfa);
  white-space: nowrap;
}

.message {
  color: var(--log-message-color, #e5e7eb);
  word-break: break-all;
  white-space: pre-wrap;
}

.message :deep(mark) {
  background-color: var(--log-highlight-bg, #fbbf24);
  color: var(--log-highlight-color, #000);
  border-radius: 2px;
  padding: 0 2px;
}

.metadata {
  width: 100%;
  margin-top: 8px;
  padding: 8px;
  background-color: var(--log-metadata-bg, #1f2937);
  border-radius: 4px;
  border-left: 3px solid var(--log-metadata-border, #3b82f6);
}
</style>
