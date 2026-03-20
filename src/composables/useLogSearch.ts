import { ref } from 'vue';
import type { LogEntry } from '@/types/log';

let worker: Worker | null = null;

export function useLogSearch() {
  const isSearching = ref(false);
  const searchResults = ref<LogEntry[]>([]);

  const initWorker = () => {
    if (worker) return;
    worker = new Worker(
      new URL('@/workers/search.worker.ts', import.meta.url),
      { type: 'module' }
    );
  };

  const search = (
    logs: LogEntry[],
    query: string,
    options: {
      type?: 'text' | 'regex' | 'json';
      levelFilter?: string[];
    } = {}
  ): Promise<LogEntry[]> => {
    return new Promise((resolve) => {
      if (!worker) initWorker();
      if (!worker) {
        resolve([]);
        return;
      }

      isSearching.value = true;
      const id = Math.random().toString(36).slice(2);

      const handler = (e: MessageEvent) => {
        if (e.data.id === id) {
          worker?.removeEventListener('message', handler);
          searchResults.value = e.data.results;
          isSearching.value = false;
          resolve(e.data.results);
        }
      };

      worker.addEventListener('message', handler);
      worker.postMessage({
        id,
        logs,
        query,
        type: options.type || 'text',
        levelFilter: options.levelFilter
      });
    });
  };

  const terminate = () => {
    worker?.terminate();
    worker = null;
  };

  return {
    isSearching,
    searchResults,
    search,
    terminate
  };
}
