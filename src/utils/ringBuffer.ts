export class RingBuffer<T> {
  private buffer: (T | undefined)[];
  private head = 0;      // 写入位置
  private tail = 0;      // 读取位置
  private size = 0;      // 当前元素数
  private startIndex = 0; // 全局起始索引（用于行号）
  private totalPushed = 0; // 总推送数

  constructor(private capacity: number) {
    this.buffer = new Array(capacity);
  }

  // 添加元素
  push(item: T): void {
    this.buffer[this.head] = item;
    this.head = (this.head + 1) % this.capacity;

    if (this.size < this.capacity) {
      this.size++;
    } else {
      // 缓冲区已满，覆盖旧数据
      this.tail = this.head;
      this.startIndex++;
    }
    this.totalPushed++;
  }

  // 批量添加
  pushBatch(items: T[]): void {
    items.forEach(item => this.push(item));
  }

  // 获取指定范围数据（配合虚拟滚动）
  slice(start: number, end: number): T[] {
    const result: T[] = [];
    const actualStart = Math.max(0, start);
    const actualEnd = Math.min(end, this.size);

    for (let i = actualStart; i < actualEnd; i++) {
      const idx = (this.tail + i) % this.capacity;
      const item = this.buffer[idx];
      if (item !== undefined) {
        result.push(item);
      }
    }
    return result;
  }

  // 获取所有数据
  toArray(): T[] {
    return this.slice(0, this.size);
  }

  // 根据全局索引获取
  getByGlobalIndex(index: number): T | null {
    const localIndex = index - this.startIndex;
    if (localIndex < 0 || localIndex >= this.size) return null;

    const idx = (this.tail + localIndex) % this.capacity;
    const item = this.buffer[idx];
    return item ?? null;
  }

  // 清空缓冲区
  clear(): void {
    this.head = this.tail = this.size = 0;
    this.startIndex = this.totalPushed = 0;
    this.buffer = new Array(this.capacity);
  }

  // 获取当前大小
  getSize(): number {
    return this.size;
  }

  // 获取全局起始索引
  getStartIndex(): number {
    return this.startIndex;
  }

  // 获取总推送数
  getTotalPushed(): number {
    return this.totalPushed;
  }

  // 是否已满
  isFull(): boolean {
    return this.size === this.capacity;
  }
}
