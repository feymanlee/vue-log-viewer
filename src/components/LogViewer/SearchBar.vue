<template>
  <div class="search-bar">
    <div class="search-input-wrapper">
      <input
        ref="inputRef"
        v-model="localQuery"
        type="text"
        class="search-input"
        placeholder="Search logs... (press / to focus)"
        @keyup.enter="handleSearch"
        @keyup.esc="clearSearch"
      />

      <button
        v-if="localQuery"
        class="clear-btn"
        @click="clearSearch"
      >
        ✕
      </button>

      <select v-model="searchType" class="search-type">
        <option value="text">Text</option>
        <option value="regex">Regex</option>
        <option value="json">JSON</option>
      </select>

      <button
        class="search-btn"
        :disabled="isSearching"
        @click="handleSearch"
      >
        <span v-if="isSearching">Searching...</span>
        <span v-else>Search</span>
      </button>
    </div>

    <div v-if="resultCount !== null" class="search-results">
      {{ resultCount }} results found
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps<{
  modelValue: string;
  isSearching: boolean;
  resultCount?: number | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'search', query: string, type: 'text' | 'regex' | 'json'): void;
}>();

const inputRef = ref<HTMLInputElement | null>(null);
const searchType = ref<'text' | 'regex' | 'json'>('text');

const localQuery = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

const handleSearch = () => {
  emit('search', localQuery.value, searchType.value);
};

const clearSearch = () => {
  localQuery.value = '';
  emit('search', '', searchType.value);
};

// 键盘快捷键
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === '/' && document.activeElement !== inputRef.value) {
    e.preventDefault();
    inputRef.value?.focus();
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
.search-bar {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background-color: var(--search-bg, #252525);
  border-bottom: 1px solid var(--search-border, #333);
}

.search-input-wrapper {
  display: flex;
  gap: 8px;
  align-items: center;
}

.search-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid var(--input-border, #444);
  border-radius: 4px;
  background-color: var(--input-bg, #1a1a1a);
  color: var(--input-color, #e5e7eb);
  font-size: 14px;
}

.search-input:focus {
  outline: none;
  border-color: var(--input-focus-border, #3b82f6);
}

.clear-btn {
  padding: 8px;
  background: none;
  border: none;
  color: var(--clear-btn-color, #888);
  cursor: pointer;
  font-size: 14px;
}

.clear-btn:hover {
  color: var(--clear-btn-hover-color, #fff);
}

.search-type {
  padding: 8px 12px;
  border: 1px solid var(--select-border, #444);
  border-radius: 4px;
  background-color: var(--select-bg, #333);
  color: var(--select-color, #ccc);
  font-size: 14px;
  cursor: pointer;
}

.search-btn {
  padding: 8px 16px;
  border: 1px solid var(--btn-border, #444);
  border-radius: 4px;
  background-color: var(--btn-bg, #3b82f6);
  color: var(--btn-color, white);
  font-size: 14px;
  cursor: pointer;
  transition: opacity 0.15s;
}

.search-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.search-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.search-results {
  font-size: 12px;
  color: var(--results-color, #888);
}
</style>
