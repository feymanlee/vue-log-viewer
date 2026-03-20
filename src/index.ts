// Components
import LogViewer from './components/LogViewer/index.vue'
import LogList from './components/LogViewer/LogList.vue'
import LogItem from './components/LogViewer/LogItem.vue'
import LogToolbar from './components/LogViewer/LogToolbar.vue'
import SearchBar from './components/LogViewer/SearchBar.vue'
import LevelFilter from './components/LogViewer/LevelFilter.vue'
import JsonViewer from './components/JsonViewer/index.vue'

// Composables
import { useLogStore } from './stores/logStore'
import { useLogStream } from './composables/useLogStream'
import { useLogSearch } from './composables/useLogSearch'
import { useVirtualList } from './composables/useVirtualList'

// Utils
import { RingBuffer } from './utils/ringBuffer'
import { MemoryManager } from './utils/memoryManager'

// Types
import type {
  LogLevel,
  LogEntry,
  LogFilter,
  ViewState
} from './types/log'

// Export components
export {
  LogViewer,
  LogList,
  LogItem,
  LogToolbar,
  SearchBar,
  LevelFilter,
  JsonViewer
}

// Export composables
export {
  useLogStore,
  useLogStream,
  useLogSearch,
  useVirtualList
}

// Export utils
export {
  RingBuffer,
  MemoryManager
}

// Export types
export type {
  LogLevel,
  LogEntry,
  LogFilter,
  ViewState
}

// Default export
export default LogViewer
