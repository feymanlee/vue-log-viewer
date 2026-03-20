<template>
  <div ref="containerRef" class="virtual-list" @scroll="handleScroll">
    <div class="virtual-list-content" :style="{ height: totalHeight + 'px' }">
      <div
        v-for="{ item, index, style } in visibleItems"
        :key="getKey(item, index)"
        class="virtual-list-item"
        :style="style"
      >
        <slot :item="item" :index="index" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps<{
  items: any[];
  itemHeight: number;
  overscan?: number;
  keyField?: string;
}>();

const containerRef = ref<HTMLElement | null>(null);
const scrollTop = ref(0);
const containerHeight = ref(0);

const overscan = computed(() => props.overscan ?? 5);

// 可视区域计算
const visibleRange = computed(() => {
  const start = Math.floor(scrollTop.value / props.itemHeight);
  const visibleCount = Math.ceil(containerHeight.value / props.itemHeight);

  return {
    start: Math.max(0, start - overscan.value),
    end: Math.min(
      props.items.length,
      start + visibleCount + overscan.value
    )
  };
});

// 可视区域数据
const visibleItems = computed(() => {
  const { start, end } = visibleRange.value;
  return props.items.slice(start, end).map((item, idx) => ({
    item,
    index: start + idx,
    style: {
      position: 'absolute',
      top: `${(start + idx) * props.itemHeight}px`,
      height: `${props.itemHeight}px`,
      left: 0,
      right: 0
    }
  }));
});

// 总高度
const totalHeight = computed(() =>
  props.items.length * props.itemHeight
);

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

// 获取 key
const getKey = (item: any, index: number): string => {
  if (props.keyField && item[props.keyField]) {
    return String(item[props.keyField]);
  }
  return `item-${index}`;
};

// 滚动到指定索引
const scrollToIndex = (index: number) => {
  if (containerRef.value) {
    containerRef.value.scrollTop = index * props.itemHeight;
  }
};

// 滚动到底部
const scrollToBottom = () => {
  if (containerRef.value) {
    containerRef.value.scrollTop = containerRef.value.scrollHeight;
  }
};

onMounted(() => {
  if (containerRef.value) {
    containerHeight.value = containerRef.value.clientHeight;
  }
});

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId);
});

defineExpose({
  scrollToIndex,
  scrollToBottom,
  containerRef
});
</script>

<style scoped>
.virtual-list {
  overflow-y: auto;
  position: relative;
}

.virtual-list-content {
  position: relative;
}

.virtual-list-item {
  position: absolute;
  width: 100%;
}
</style>
