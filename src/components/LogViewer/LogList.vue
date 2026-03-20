<template>
  <div ref="containerRef" class="log-list" @scroll="handleScroll">
    <div class="log-list-content" :style="{ height: totalHeight + 'px' }">
      <div
        v-for="{ item, index, style } in visibleItems"
        :key="item.id"
        class="log-row"
        :style="style"
      >
        <LogItem
          :log="item"
          :view-state="viewState"
          :line-number="buffer.getStartIndex() + index + 1"
          :search-query="filter.search"
        />
      </div>
    </div>

    <!-- 自动滚动提示 -->
    <div
      v-if="showScrollToBottom"
      class="scroll-to-bottom"
      @click="scrollToBottom"
    >
      <span>↓ New logs</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { LogEntry, LogFilter, ViewState } from '@/types/log';
import { RingBuffer } from '@/utils/ringBuffer';
import LogItem from './LogItem.vue';

const props = defineProps<{
  logs: LogEntry[];
  viewState: ViewState;
  filter: LogFilter;
  buffer: RingBuffer<LogEntry>;
}>();

const emit = defineEmits<{
  (e: 'scroll-to-bottom'): void;
}>();

const containerRef = ref<HTMLElement | null>(null);
const scrollTop = ref(0);
const containerHeight = ref(0);

const ITEM_HEIGHT = 28; // 每行高度
const OVERSCAN = 5;

// 可视区域计算
const visibleRange = computed(() => {
  const start = Math.floor(scrollTop.value / ITEM_HEIGHT);
  const visibleCount = Math.ceil(containerHeight.value / ITEM_HEIGHT);

  return {
    start: Math.max(0, start - OVERSCAN),
    end: Math.min(props.logs.length, start + visibleCount + OVERSCAN)
  };
});

// 可视区域数据
const visibleItems = computed(() => {
  const { start, end } = visibleRange.value;
  return props.logs.slice(start, end).map((item, idx) => ({
    item,
    index: start + idx,
    style: {
      position: 'absolute',
      top: `${(start + idx) * ITEM_HEIGHT}px`,
      height: `${ITEM_HEIGHT}px`,
      left: 0,
      right: 0
    }
  }));
});

const totalHeight = computed(() => props.logs.length * ITEM_HEIGHT);

// 是否在底部
const isNearBottom = computed(() => {
  if (!containerRef.value) return true;
  const { scrollTop, scrollHeight, clientHeight } = containerRef.value;
  return scrollHeight - scrollTop - clientHeight < 100;
});

const showScrollToBottom = computed(() => {
  return props.viewState.autoScroll && !isNearBottom.value;
});

// 滚动处理
let rafId: number | null = null;
const handleScroll = () => {
  if (rafId) return;
  rafId = requestAnimationFrame(() => {
    if (containerRef.value) {
      scrollTop.value = containerRef.value.scrollTop;
    }
    rafId = null;
  });
};

// 滚动到底部
const scrollToBottom = () => {
  if (containerRef.value) {
    containerRef.value.scrollTop = containerRef.value.scrollHeight;
  }
  emit('scroll-to-bottom');
};

// 自动滚动
watch(() => props.logs.length, () => {
  if (props.viewState.autoScroll && isNearBottom.value) {
    scrollToBottom();
  }
});

// 初始化容器高度
watch(containerRef, (el) => {
  if (el) {
    containerHeight.value = el.clientHeight;
  }
});
</script>

<style scoped>
.log-list {
  flex: 1;
  overflow-y: auto;
  position: relative;
  background-color: var(--log-bg, #1a1a1a);
}

.log-list-content {
  position: relative;
}

.log-row {
  position: absolute;
  width: 100%;
}

.scroll-to-bottom {
  position: absolute;
  bottom: 16px;
  right: 16px;
  padding: 8px 16px;
  background-color: var(--log-scroll-btn-bg, #3b82f6);
  color: var(--log-scroll-btn-color, white);
  border-radius: 20px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: transform 0.15s, opacity 0.15s;
  user-select: none;
}

.scroll-to-bottom:hover {
  transform: translateY(-2px);
  opacity: 0.9;
}

.scroll-to-bottom span {
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>
