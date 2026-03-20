<template>
  <span class="highlight-text" v-html="highlightedText"></span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  text: string;
  query: string;
  caseSensitive?: boolean;
}>({});

const highlightedText = computed(() => {
  if (!props.query?.trim()) {
    return escapeHtml(props.text);
  }

  const flags = props.caseSensitive ? 'g' : 'gi';
  const escapedQuery = escapeRegex(props.query);

  try {
    const regex = new RegExp(`(${escapedQuery})`, flags);
    return escapeHtml(props.text).replace(
      regex,
      '<mark class="highlight">$1</mark>'
    );
  } catch {
    return escapeHtml(props.text);
  }
});

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
</script>

<style scoped>
.highlight-text {
  display: inline;
}

.highlight-text :deep(.highlight) {
  background-color: var(--highlight-bg, #fbbf24);
  color: var(--highlight-color, #000);
  border-radius: 2px;
  padding: 0 2px;
}
</style>
