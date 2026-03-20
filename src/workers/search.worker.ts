import type { LogEntry } from '@/types/log';

interface SearchMessage {
  id: string;
  logs: LogEntry[];
  query: string;
  type: 'text' | 'regex' | 'json';
  levelFilter?: string[];
}

self.onmessage = function(e: MessageEvent<SearchMessage>) {
  const { id, logs, query, type, levelFilter } = e.data;

  let results: LogEntry[] = logs;

  // 级别预过滤
  if (levelFilter?.length) {
    const levels = new Set(levelFilter);
    results = results.filter(log => levels.has(log.level));
  }

  // 执行搜索
  switch (type) {
    case 'text':
      results = searchText(results, query);
      break;
    case 'regex':
      results = searchRegex(results, query);
      break;
    case 'json':
      results = searchJson(results, query);
      break;
  }

  self.postMessage({ id, results });
};

function searchText(logs: LogEntry[], query: string): LogEntry[] {
  if (!query.trim()) return logs;
  const lowerQuery = query.toLowerCase();
  return logs.filter(log =>
    log.message.toLowerCase().includes(lowerQuery) ||
    log.source?.toLowerCase().includes(lowerQuery)
  );
}

function searchRegex(logs: LogEntry[], pattern: string): LogEntry[] {
  try {
    const regex = new RegExp(pattern, 'i');
    return logs.filter(log =>
      regex.test(log.message) ||
      (log.source && regex.test(log.source))
    );
  } catch {
    return [];
  }
}

function searchJson(logs: LogEntry[], query: string): LogEntry[] {
  return logs.filter(log => {
    if (!log.metadata) return false;
    const jsonStr = JSON.stringify(log.metadata).toLowerCase();
    return jsonStr.includes(query.toLowerCase());
  });
}
