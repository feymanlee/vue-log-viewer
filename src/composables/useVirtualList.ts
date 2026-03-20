import { ref, computed, onMounted, onUnmounted, type Ref } from 'vue';

interface VirtualListOptions {
  itemHeight: number;
  overscan?: number;
}

export function useVirtualList<T>(
  items: Ref<T[]>,
  options: VirtualListOptions
) {
  const containerRef = ref<HTMLElement | null>(null);
  const scrollTop = ref(0);
  const containerHeight = ref(0);

  const overscan = options.overscan ?? 5;

  // 可视区域计算
  const visibleRange = computed(() => {
    const start = Math.floor(scrollTop.value / options.itemHeight);
    const visibleCount = Math.ceil(containerHeight.value / options.itemHeight);

    return {
      start: Math.max(0, start - overscan),
      end: Math.min(
        items.value.length,
        start + visibleCount + overscan
      )
    };
  });

  // 可视区域数据
  const visibleItems = computed(() => {
    const { start, end } = visibleRange.value;
    return items.value.slice(start, end).map((item, index) => ({
      item,
      index: start + index,
      style: {
        position: 'absolute',
        top: `${(start + index) * options.itemHeight}px`,
        height: `${options.itemHeight}px`
      }
    }));
  });

  // 总高度
  const totalHeight = computed(() =>
    items.value.length * options.itemHeight
  );

  // 滚动处理（节流）
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

  onMounted(() => {
    if (containerRef.value) {
      containerHeight.value = containerRef.value.clientHeight;
      containerRef.value.addEventListener('scroll', handleScroll, { passive: true });
    }
  });

  onUnmounted(() => {
    containerRef.value?.removeEventListener('scroll', handleScroll);
    if (rafId) cancelAnimationFrame(rafId);
  });

  return {
    containerRef,
    visibleItems,
    totalHeight,
    scrollTo: (index: number) => {
      if (containerRef.value) {
        containerRef.value.scrollTop = index * options.itemHeight;
      }
    }
  };
}
