import { debounce, throttle } from 'lodash-es';

// 搜索防抖
export const debouncedSearch = debounce(
  (fn: () => void) => fn(),
  300
);

// 滚动节流 (60fps)
export const throttledScroll = throttle(
  (fn: () => void) => fn(),
  16,
  { leading: true, trailing: true }
);

// 窗口调整防抖
export const debouncedResize = debounce(
  (fn: () => void) => fn(),
  200
);

// 日志追加节流
export const throttledAppend = throttle(
  (fn: () => void) => fn(),
  16
);
