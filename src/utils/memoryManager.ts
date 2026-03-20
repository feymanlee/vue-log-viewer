export class MemoryManager {
  private maxMemoryMB: number;
  private warningThreshold: number;

  constructor(maxMemoryMB = 100) {
    this.maxMemoryMB = maxMemoryMB;
    this.warningThreshold = 0.8;
  }

  // 计算缓冲区大小
  calculateBufferSize(avgLogSizeBytes: number): number {
    const maxMemoryBytes = this.maxMemoryMB * 1024 * 1024;
    const usableMemory = maxMemoryBytes * 0.5; // 预留 50%
    return Math.floor(usableMemory / avgLogSizeBytes);
  }

  // 监控内存使用
  monitor(callback: (usage: number) => void): () => void {
    if (!('memory' in performance)) {
      return () => {}; // 不支持内存监控
    }

    const interval = setInterval(() => {
      const memory = (performance as any).memory;
      const usedPercent = memory.usedJSHeapSize / memory.jsHeapSizeLimit;

      if (usedPercent > this.warningThreshold) {
        callback(usedPercent);
      }
    }, 5000);

    return () => clearInterval(interval);
  }
}
