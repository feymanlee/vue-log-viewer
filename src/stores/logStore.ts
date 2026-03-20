import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { RingBuffer } from '@/utils/ringBuffer';
import type { LogEntry, LogFilter, ViewState } from '@/types/log';
import { LogLevel } from '@/types/log';

const BUFFER_SIZE = 50000; // 最大缓存 5 万条日志

export const useLogStore = defineStore('log', () => {
  // ===== State =====
  const buffer = new RingBuffer<LogEntry>(BUFFER_SIZE);
  const filter = ref<LogFilter>({});
  const viewState = ref<ViewState>({
    autoScroll: true,
    wrapLines: false,
    showTimestamp: true,
    showLineNumbers: true,
    timestampFormat: 'YYYY-MM-DD HH:mm:ss'
  });

  // ===== Getters =====
  const allLogs = computed(() => buffer.toArray());

  const filteredLogs = computed(() => {
    let logs = buffer.toArray();

    // 级别过滤
    if (filter.value.level?.length) {
      const levels = new Set(filter.value.level);
      logs = logs.filter(log => levels.has(log.level));
    }

    // 关键词搜索
    if (filter.value.search?.trim()) {
      const keyword = filter.value.search.toLowerCase();
      logs = logs.filter(log =>
        log.message.toLowerCase().includes(keyword) ||
        log.source?.toLowerCase().includes(keyword)
      );
    }

    // 来源过滤
    if (filter.value.source?.length) {
      const sources = new Set(filter.value.source);
      logs = logs.filter(log => !log.source || sources.has(log.source));
    }

    // 时间范围过滤
    if (filter.value.timeRange) {
      const [start, end] = filter.value.timeRange;
      logs = logs.filter(log =>
        log.timestamp >= start && log.timestamp <= end
      );
    }

    return logs;
  });

  const logStats = computed(() => {
    const stats = {
      [LogLevel.DEBUG]: 0,
      [LogLevel.INFO]: 0,
      [LogLevel.WARN]: 0,
      [LogLevel.ERROR]: 0,
      [LogLevel.FATAL]: 0
    };
    buffer.toArray().forEach(log => {
      stats[log.level]++;
    });
    return stats;
  });

  const sources = computed(() => {
    const sourceSet = new Set<string>();
    buffer.toArray().forEach(log => {
      if (log.source) sourceSet.add(log.source);
    });
    return Array.from(sourceSet).sort();
  });

  // ===== Actions =====
  const addLog = (log: LogEntry) => {
    buffer.push(log);
  };

  const addLogs = (logs: LogEntry[]) => {
    buffer.pushBatch(logs);
  };

  const setFilter = (newFilter: LogFilter) => {
    filter.value = { ...filter.value, ...newFilter };
  };

  const clearFilter = () => {
    filter.value = {};
  };

  const clearLogs = () => {
    buffer.clear();
  };

  const updateViewState = (newState: Partial<ViewState>) => {
    viewState.value = { ...viewState.value, ...newState };
  };

  return {
    // State
    filter,
    viewState,
    // Getters
    allLogs,
    filteredLogs,
    logStats,
    sources,
    // Actions
    addLog,
    addLogs,
    setFilter,
    clearFilter,
    clearLogs,
    updateViewState
  };
});
