# Vue Log Viewer

A high-performance log viewer built with Vue 3, supporting both static log files and real-time streaming logs.

[中文文档](./README.zh-CN.md)

## Features

- **Virtual Scrolling**: Efficient rendering of large log datasets (10,000+ lines) with smooth 60fps scrolling
- **Ring Buffer**: Memory-efficient log storage with configurable capacity (default: 50,000 entries)
- **Real-time Streaming**: SSE (Server-Sent Events) based log streaming with auto-reconnection
- **Advanced Search**: Web Worker powered search supporting text, regex, and JSON modes
- **Level Filtering**: Filter logs by debug, info, warn, error, fatal levels
- **Pinia State Management**: Centralized state management with computed getters
- **Dark Theme**: CSS variable-based theming, easy to customize
- **Responsive UI**: Toolbar controls, auto-scroll, line wrapping, timestamps, line numbers

## Tech Stack

| Module | Technology | Version |
|--------|------------|---------|
| Framework | Vue | ^3.4.0 |
| State Management | Pinia | ^2.1.0 |
| Utilities | VueUse | ^10.0.0 |
| Styling | CSS Variables | - |
| Build Tool | Vite | ^5.0.0 |

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Usage

### Basic Usage

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
    message: 'Application started',
    source: 'app-server'
  }
]
</script>
```

### Streaming Mode

```vue
<template>
  <LogViewer
    mode="stream"
    source="http://localhost:3000/logs/stream"
  />
</template>
```

### Log Entry Format

```typescript
interface LogEntry {
  id: string           // Unique identifier
  timestamp: number    // Unix timestamp (ms)
  level: LogLevel      // 'debug' | 'info' | 'warn' | 'error' | 'fatal'
  message: string      // Log message
  source?: string      // Source component/service
  metadata?: object    // Additional structured data
}
```

## Architecture

```
┌─────────────────────────────────────────┐
│           Application Layer              │
│  LogViewer / SearchBar / Toolbar        │
├─────────────────────────────────────────┤
│         Business Logic Layer             │
│  useLogStore (Pinia) / useLogStream     │
├─────────────────────────────────────────┤
│           Data Layer                     │
│      RingBuffer (Circular Buffer)       │
├─────────────────────────────────────────┤
│          Search Layer                    │
│   Web Worker + Inverted Index           │
└─────────────────────────────────────────┘
```

## Key Components

### LogViewer
Main container component integrating all features.

Props:
- `mode`: 'static' | 'stream' - Display mode
- `source`: string - SSE endpoint URL (for stream mode)
- `initialLogs`: LogEntry[] - Initial log data (for static mode)

### useLogStream Composable
Manages SSE connections with automatic reconnection.

```typescript
const { isConnected, isPaused, connect, disconnect, pause, resume } = useLogStream({
  url: 'http://localhost:3000/logs/stream',
  reconnectInterval: 3000,
  maxReconnectAttempts: 10,
  onLog: (log) => console.log(log),
  onError: (error) => console.error(error)
})
```

### useLogSearch Composable
Web Worker powered search for non-blocking UI.

```typescript
const { isSearching, searchResults, search } = useLogSearch()

// Search types: 'text' | 'regex' | 'json'
const results = await search(logs, 'error', { type: 'text' })
```

### RingBuffer
Memory-efficient circular buffer with O(1) push and O(k) slice operations.

```typescript
const buffer = new RingBuffer<LogEntry>(50000)
buffer.push(log)
buffer.pushBatch(logs)
const slice = buffer.slice(0, 100)
```

## Performance Targets

| Metric | Target |
|--------|--------|
| First Paint | < 100ms |
| Scroll FPS | 60fps |
| Memory (10K lines) | < 50MB |
| Search Response | < 100ms |
| Log Append Latency | < 16ms |
| Virtual DOM Nodes | < 50 |

## Customization

### CSS Variables

Edit `src/styles/variables.css` to customize the theme:

```css
:root {
  --viewer-bg: #1a1a1a;
  --log-info-color: #60a5fa;
  --log-error-color: #f87171;
  /* ... */
}
```

### Buffer Size

Configure in `src/stores/logStore.ts`:

```typescript
const BUFFER_SIZE = 50000 // Maximum log entries
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `/` | Focus search input |
| `Esc` | Clear search |

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13.1+
- Edge 80+

## License

MIT
