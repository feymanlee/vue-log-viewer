<template>
  <div class="json-viewer" :class="{ collapsed: isCollapsed }">
    <span
      v-if="isExpandable"
      class="toggle"
      @click="toggle"
    >
      {{ isCollapsed ? '▶' : '▼' }}
    </span>

    <span class="bracket">{{ openBracket }}</span>

    <template v-if="!isCollapsed">
      <div
        v-for="(item, key) in visibleEntries"
        :key="key"
        class="json-item"
        :style="{ marginLeft: indent + 'px' }"
      >
        <span v-if="isObject" class="json-key">"{{ key }}": </span>
        <JsonViewer
          v-if="isObjectOrArray(item)"
          :data="item"
          :depth="depth + 1"
          :max-depth="maxDepth"
        />
        <span v-else :class="getValueClass(item)">{{ formatValue(item) }}</span>
        <span v-if="!isLast(key)">,</span>
      </div>
    </template>

    <span v-else class="ellipsis">...{{ entryCount }} items</span>

    <span class="bracket">{{ closeBracket }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  data: any;
  depth?: number;
  maxDepth?: number;
}>();

const depth = props.depth ?? 0;
const maxDepth = props.maxDepth ?? 3;

const isCollapsed = ref(depth >= maxDepth);

const isObject = computed(() =>
  typeof props.data === 'object' && props.data !== null && !Array.isArray(props.data)
);

const isArray = computed(() => Array.isArray(props.data));

const isExpandable = computed(() => isObject.value || isArray.value);

const openBracket = computed(() => (isArray.value ? '[' : '{'));
const closeBracket = computed(() => (isArray.value ? ']' : '}'));

const entries = computed(() => {
  if (isObject.value) return Object.entries(props.data);
  if (isArray.value) return props.data.map((v: any, i: number) => [i, v]);
  return [];
});

const entryCount = computed(() => entries.value.length);

const visibleEntries = computed(() => {
  // 只展示前 100 个条目，防止大对象卡顿
  return entries.value.slice(0, 100);
});

const indent = computed(() => depth * 20);

const toggle = () => {
  isCollapsed.value = !isCollapsed.value;
};

const isObjectOrArray = (value: any): boolean => {
  return typeof value === 'object' && value !== null;
};

const isLast = (key: string | number): boolean => {
  const idx = typeof key === 'number' ? key : entries.value.findIndex(([k]) => k === key);
  return idx === entries.value.length - 1;
};

const getValueClass = (value: any): string => {
  if (value === null) return 'json-null';
  if (typeof value === 'boolean') return 'json-boolean';
  if (typeof value === 'number') return 'json-number';
  if (typeof value === 'string') return 'json-string';
  return '';
};

const formatValue = (value: any): string => {
  if (value === null) return 'null';
  if (typeof value === 'string') return `"${truncate(value, 100)}"`;
  return String(value);
};

const truncate = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
};
</script>

<style scoped>
.json-viewer {
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 13px;
  line-height: 1.5;
}

.toggle {
  cursor: pointer;
  user-select: none;
  margin-right: 4px;
}

.json-key { color: #9cdcfe; }
.json-string { color: #ce9178; }
.json-number { color: #b5cea8; }
.json-boolean { color: #569cd6; }
.json-null { color: #569cd6; }
.json-bracket { color: #ffd700; }
.ellipsis { color: #808080; }
</style>
