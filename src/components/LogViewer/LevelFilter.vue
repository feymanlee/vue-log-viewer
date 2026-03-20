<template>
  <div class="level-filter">
    <span class="filter-label">Filter by level:</span>

    <div class="level-options">
      <label
        v-for="level in logLevels"
        :key="level"
        class="level-checkbox"
        :class="{ active: isSelected(level) }"
      >
        <input
          type="checkbox"
          :checked="isSelected(level)"
          @change="toggleLevel(level)"
        />
        <span class="level-name">{{ level }}</span>
        <span v-if="stats[level]" class="level-count">{{ stats[level] }}</span>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { LogLevel } from '@/types/log';

const props = defineProps<{
  modelValue: string[];
  stats: Record<string, number>;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void;
}>();

const logLevels = Object.values(LogLevel);

const selectedLevels = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

const isSelected = (level: string) => {
  return selectedLevels.value.includes(level);
};

const toggleLevel = (level: string) => {
  if (isSelected(level)) {
    selectedLevels.value = selectedLevels.value.filter(l => l !== level);
  } else {
    selectedLevels.value = [...selectedLevels.value, level];
  }
};
</script>

<style scoped>
.level-filter {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background-color: var(--filter-bg, #252525);
  border-bottom: 1px solid var(--filter-border, #333);
}

.filter-label {
  font-size: 12px;
  color: var(--filter-label-color, #888);
  white-space: nowrap;
}

.level-options {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.level-checkbox {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  text-transform: uppercase;
  transition: all 0.15s;
  border: 1px solid transparent;
}

.level-checkbox input {
  display: none;
}

.level-checkbox:hover {
  background-color: var(--checkbox-hover-bg, #333);
}

.level-checkbox.active {
  background-color: var(--checkbox-active-bg, #3b82f6);
  border-color: var(--checkbox-active-border, #3b82f6);
}

.level-checkbox.active .level-name {
  color: var(--checkbox-active-color, white);
}

.level-name {
  color: var(--checkbox-color, #ccc);
}

.level-count {
  padding: 2px 6px;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  font-size: 10px;
  min-width: 18px;
  text-align: center;
}
</style>
