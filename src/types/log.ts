// 日志级别
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal'
}

// 单条日志结构
export interface LogEntry {
  id: string;           // 唯一标识
  timestamp: number;    // 时间戳
  level: LogLevel;      // 日志级别
  message: string;      // 日志内容
  source?: string;      // 来源（文件名/服务名）
  metadata?: Record<string, any>;  // 额外元数据
}

// 过滤条件
export interface LogFilter {
  level?: LogLevel[];           // 级别过滤
  search?: string;              // 关键词搜索
  timeRange?: [number, number]; // 时间范围
  source?: string[];            // 来源过滤
}

// 视图状态
export interface ViewState {
  autoScroll: boolean;          // 自动滚动到底部
  wrapLines: boolean;           // 自动换行
  showTimestamp: boolean;       // 显示时间戳
  showLineNumbers: boolean;     // 显示行号
  timestampFormat: string;      // 时间格式
}
