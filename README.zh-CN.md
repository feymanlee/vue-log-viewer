# Vue 日志查看器

基于 Vue 3 的高性能日志查看器，支持静态日志文件和实时流式日志。

[English Documentation](./README.md)

## 功能特性

- **虚拟滚动**：高效渲染大规模日志数据（万行级别），流畅 60fps 滚动体验
- **环形缓冲区**：内存高效的日志存储，默认可缓存 5 万条日志
- **实时流式**：基于 SSE（Server-Sent Events）的日志实时推送，支持自动重连
- **高级搜索**：Web Worker 驱动的异步搜索，支持文本、正则、JSON 三种模式
- **级别过滤**：支持按 debug、info、warn、error、fatal 级别过滤日志
- **Pinia 状态管理**：集中式状态管理，计算属性自动派生
- **暗黑主题**：基于 CSS 变量的主题系统，易于定制
- **响应式 UI**：工具栏控制、自动滚动、自动换行、时间戳、行号显示

## 技术栈

| 模块 | 技术 | 版本 |
|------|------|------|
| 框架 | Vue | ^3.4.0 |
| 状态管理 | Pinia | ^2.1.0 |
| 工具库 | VueUse | ^10.0.0 |
| 样式 | CSS Variables | - |
| 构建工具 | Vite | ^5.0.0 |

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 使用方法

### 静态模式

```vue
<template>
  <LogViewer mode="static" :initial-logs="logs" />
</template>

<script setup>
import LogViewer from '@/components/LogViewer/index.vue'

const logs = [
  {
    id: '1',
    timestamp: Date.now(),
    level: 'info',
    message: '应用启动',
    source: 'app-server'
  }
]
</script>
```

### 流式模式

```vue
<template>
  <LogViewer
    mode="stream"
    source="http://localhost:3000/logs/stream"
  />
</template>
```

### 日志条目格式

```typescript
interface LogEntry {
  id: string           // 唯一标识
  timestamp: number    // Unix 时间戳（毫秒）
  level: LogLevel      // 'debug' | 'info' | 'warn' | 'error' | 'fatal'
  message: string      // 日志内容
  source?: string      // 来源组件/服务
  metadata?: object    // 附加结构化数据
}
```

## 架构设计

```
┌─────────────────────────────────────────┐
│              应用层                      │
│     LogViewer / SearchBar / Toolbar     │
├─────────────────────────────────────────┤
│             业务逻辑层                   │
│    useLogStore (Pinia) / useLogStream   │
├─────────────────────────────────────────┤
│              数据层                      │
│         RingBuffer (环形缓冲区)          │
├─────────────────────────────────────────┤
│              搜索层                      │
│       Web Worker + 倒排索引              │
└─────────────────────────────────────────┘
```

## 核心组件

### LogViewer
主容器组件，集成所有功能。

Props:
- `mode`: 'static' | 'stream' - 显示模式
- `source`: string - SSE 端点地址（流式模式）
- `initialLogs`: LogEntry[] - 初始日志数据（静态模式）

### useLogStream 组合式函数
管理 SSE 连接，支持自动重连。

```typescript
const { isConnected, isPaused, connect, disconnect, pause, resume } = useLogStream({
  url: 'http://localhost:3000/logs/stream',
  reconnectInterval: 3000,    // 重连间隔（毫秒）
  maxReconnectAttempts: 10,   // 最大重连次数
  onLog: (log) => console.log(log),
  onError: (error) => console.error(error)
})
```

### useLogSearch 组合式函数
Web Worker 驱动的异步搜索，不阻塞主线程。

```typescript
const { isSearching, searchResults, search } = useLogSearch()

// 搜索类型: 'text' | 'regex' | 'json'
const results = await search(logs, 'error', { type: 'text' })
```

### RingBuffer
内存高效的环形缓冲区，支持 O(1) 插入和 O(k) 切片操作。

```typescript
const buffer = new RingBuffer<LogEntry>(50000)  // 容量 5 万条
buffer.push(log)           // 单条插入
buffer.pushBatch(logs)     // 批量插入
const slice = buffer.slice(0, 100)  // 获取范围数据
```

## 性能指标

| 指标 | 目标值 |
|------|--------|
| 首屏渲染 | < 100ms |
| 滚动帧率 | 60fps |
| 万行日志内存占用 | < 50MB |
| 搜索响应时间 | < 100ms |
| 日志追加延迟 | < 16ms |
| 虚拟 DOM 节点数 | < 50 |

## 自定义配置

### CSS 变量

编辑 `src/styles/variables.css` 自定义主题：

```css
:root {
  --viewer-bg: #1a1a1a;           /* 背景色 */
  --log-info-color: #60a5fa;      /* INFO 级别颜色 */
  --log-error-color: #f87171;     /* ERROR 级别颜色 */
  /* ... */
}
```

### 缓冲区大小

在 `src/stores/logStore.ts` 中配置：

```typescript
const BUFFER_SIZE = 50000  // 最大日志条目数
```

## 键盘快捷键

| 按键 | 功能 |
|-----|------|
| `/` | 聚焦搜索框 |
| `Esc` | 清空搜索 |

## 浏览器支持

- Chrome 80+
- Firefox 75+
- Safari 13.1+
- Edge 80+

## 项目结构

```
src/
├── components/
│   ├── LogViewer/          # 日志查看器组件
│   ├── JsonViewer/         # JSON 查看器
│   └── common/             # 通用组件
├── composables/            # 组合式函数
├── stores/                 # Pinia 状态管理
├── utils/                  # 工具函数
├── workers/                # Web Worker
├── types/                  # TypeScript 类型
└── styles/                 # 样式文件
```

## 后续扩展

1. **服务端搜索**：大数据量时将搜索逻辑移至后端
2. **日志导出**：支持导出为 CSV/JSON 文件
3. **日志统计图表**：按时间、级别展示统计图表
4. **多日志源**：支持同时查看多个来源的日志
5. **日志告警**：基于规则的实时告警通知

## 许可证

MIT
