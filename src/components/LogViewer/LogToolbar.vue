<template>
  <div class="log-toolbar">
    <div class="toolbar-left">
      <button
        class="toolbar-btn"
        :class="{ active: autoScroll }"
        @click="toggleAutoScroll"
        title="Auto scroll"
      >
        <span class="icon">⬇</span>
        Auto Scroll
      </button>

      <button
        class="toolbar-btn"
        :class="{ active: wrapLines }"
        @click="toggleWrapLines"
        title="Wrap lines"
      >
        <span class="icon">↩</span>
        Wrap
      </button>

      <button
        class="toolbar-btn"
        @click="showTimestamp = !showTimestamp"
        :class="{ active: showTimestamp }"
        title="Toggle timestamp"
      >
        <span class="icon">🕐</span>
        Time
      </button>

      <button
        class="toolbar-btn"
        @click="showLineNumbers = !showLineNumbers"
        :class="{ active: showLineNumbers }"
        title="Toggle line numbers"
      >
        <span class="icon">#️⃣</span>
        Lines
      </button>
    </div>

    <div class="toolbar-center">
      <div class="stats">
        <span
          v-for="(count, level) in logStats"
          :key="level"
          class="stat-badge"
          :class="level"
        >
          {{ level }}: {{ count }}
        </span>
      </div>
    </div>

    <div class="toolbar-right">
      <button class="toolbar-btn danger" @click="$emit('clear')">
        <span class="icon">🗑</span>
        Clear
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { LogLevel } from '@/types/log';

const props = defineProps<{
  autoScroll: boolean;
  wrapLines: boolean;
  logStats: Record<LogLevel, number>;
}>();

const emit = defineEmits<{
  (e: 'update:autoScroll', value: boolean): void;
  (e: 'update:wrapLines', value: boolean): void;
  (e: 'update:showTimestamp', value: boolean): void;
  (e: 'update:showLineNumbers', value: boolean): void;
  (e: 'clear'): void;
}>();

const autoScroll = computed({
  get: () => props.autoScroll,
  set: (val) => emit('update:autoScroll', val)
});

const wrapLines = computed({
  get: () => props.wrapLines,
  set: (val) => emit('update:wrapLines', val)
});

const showTimestamp = ref(true);
const showLineNumbers = ref(true);

watch(showTimestamp, (val) => emit('update:showTimestamp', val));
watch(showLineNumbers, (val) => emit('update:showLineNumbers', val));

const toggleAutoScroll = () => {
  autoScroll.value = !autoScroll.value;
};

const toggleWrapLines = () => {
  wrapLines.value = !wrapLines.value;
};
</script>

<script lang="ts">
import { ref, watch } from 'vue';
</script>

<style scoped>
.log-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background-color: var(--toolbar-bg, #252525);
  border-bottom: 1px solid var(--toolbar-border, #333);
  gap: 16px;
}

.toolbar-left,
.toolbar-right {
  display: flex;
  gap: 8px;
}

.toolbar-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border: 1px solid var(--btn-border, #444);
  border-radius: 4px;
  background-color: var(--btn-bg, #333);
  color: var(--btn-color, #ccc);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s;
}

.toolbar-btn:hover {
  background-color: var(--btn-hover-bg, #444);
}

.toolbar-btn.active {
  background-color: var(--btn-active-bg, #3b82f6);
  border-color: var(--btn-active-border, #3b82f6);
  color: var(--btn-active-color, white);
}

.toolbar-btn.danger:hover {
  background-color: var(--btn-danger-bg, #dc2626);
  border-color: var(--btn-danger-border, #dc2626);
  color: white;
}

.icon {
  font-size: 14px;
}

.stats {
  display: flex;
  gap: 8px;
}

.stat-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
}

.stat-badge.debug {
  background-color: var(--log-debug-bg, #374151);
  color: var(--log-debug-color, #9ca3af);
}

.stat-badge.info {
  background-color: var(--log-info-bg, #1e3a5f);
  color: var(--log-info-color, #60a5fa);
}

.stat-badge.warn {
  background-color: var(--log-warn-bg, #4a4000);
  color: var(--log-warn-color, #fbbf24);
}

.stat-badge.error {
  background-color: var(--log-error-bg, #450a0a);
  color: var(--log-error-color, #f87171);
}

.stat-badge.fatal {
  background-color: var(--log-fatal-bg, #450a0a);
  color: var(--log-fatal-color, #ef4444);
}
</style>
