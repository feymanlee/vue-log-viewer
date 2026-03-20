<template>
  <div class="log-viewer">
    <LogToolbar
      v-model:auto-scroll="viewState.autoScroll"
      v-model:wrap-lines="viewState.wrapLines"
      v-model:show-timestamp="viewState.showTimestamp"
      v-model:show-line-numbers="viewState.showLineNumbers"
      :log-stats="logStats"
      @clear="clearLogs"
    />

    <SearchBar
      v-model="filter.search"
      :is-searching="isSearching"
      :result-count="searchResults.length"
      @search="handleSearch"
    />

    <LevelFilter
      v-model="selectedLevels"
      :stats="logStats"
    />

    <LogList
      :logs="displayLogs"
      :view-state="viewState"
      :filter="filter"
      :buffer="buffer"
      @scroll-to-bottom="scrollToBottom"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useLogStore } from '@/stores/logStore';
import { useLogSearch } from '@/composables/useLogSearch';
import { useLogStream } from '@/composables/useLogStream';
import { RingBuffer } from '@/utils/ringBuffer';
import type { LogEntry, LogLevel } from '@/types/log';
import LogToolbar from './LogToolbar.vue';
import SearchBar from './SearchBar.vue';
import LevelFilter from './LevelFilter.vue';
import LogList from './LogList.vue';

const props = defineProps<{
  mode: 'static' | 'stream';
  source?: string;
  initialLogs?: LogEntry[];
}>();

const store = useLogStore();
const { search, isSearching, searchResults } = useLogSearch();

// 缓冲区直接引用
const buffer = store.$state.buffer || new RingBuffer<LogEntry>(50000);

// 视图状态
const viewState = computed({
  get: () => store.viewState,
  set: (val) => store.updateViewState(val)
});

// 过滤器
const filter = computed({
  get: () => store.filter,
  set: (val) => store.setFilter(val)
});

// 选中的日志级别
const selectedLevels = ref<string[]>([]);

// 搜索模式
const isSearchMode = computed(() => !!filter.value.search?.trim());

// 展示用的日志
const displayLogs = computed(() => {
  if (isSearchMode.value && searchResults.value.length > 0) {
    return searchResults.value;
  }

  let logs = store.allLogs;

  // 级别过滤
  if (selectedLevels.value.length > 0) {
    const levels = new Set(selectedLevels.value);
    logs = logs.filter(log => levels.has(log.level));
  }

  return logs;
});

// 日志统计
const logStats = computed(() => store.logStats);

// 搜索处理
const handleSearch = async (query: string, type: 'text' | 'regex' | 'json' = 'text') => {
  store.setFilter({ search: query });

  if (!query.trim()) {
    return;
  }

  await search(store.allLogs, query, {
    type,
    levelFilter: selectedLevels.value.length > 0 ? selectedLevels.value : undefined
  });
};

// 清空日志
const clearLogs = () => {
  store.clearLogs();
};

// 滚动到底部
const scrollToBottom = () => {
  // LogList 组件内部处理
};

// 流式日志
const { connect, disconnect, isConnected } = useLogStream({
  url: props.source || '',
  onLog: (log: LogEntry) => {
    store.addLog(log);
  },
  onError: (error: Error) => {
    console.error('Log stream error:', error);
  }
});

// 初始化
if (props.mode === 'stream' && props.source) {
  connect();
} else if (props.initialLogs) {
  store.addLogs(props.initialLogs);
}

// 监听级别变化
watch(selectedLevels, (levels) => {
  store.setFilter({ level: levels as LogLevel[] });
});
</script>

<style scoped>
.log-viewer {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--viewer-bg, #1a1a1a);
  color: var(--viewer-color, #e5e7eb);
}
</style>
