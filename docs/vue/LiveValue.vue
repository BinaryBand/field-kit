<template>
  <div class="live-value-box">
    <div class="live-value-label">
      <slot name="label">Current Value</slot>
    </div>
    <div class="live-value-content">
      <code>{{ formattedValue }}</code>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type ComputedRef } from 'vue';

const props = defineProps<{ value?: unknown }>();

const formattedValue: ComputedRef<string> = computed(() => {
  const v = props.value;
  if (v === null || v === undefined || v === '') return '(empty)';
  if (Array.isArray(v)) return JSON.stringify(v);
  if (typeof v === 'object') return JSON.stringify(v as Record<string, unknown>);
  if (typeof v === 'string') {
    // Visualize spaces so PIN placeholders aren't invisible
    return v.replace(/ /g, '·');
  }
  return String(v);
});
</script>

<style scoped>
.live-value-box {
  margin-top: 1.5em;
  padding: 1em 1.5em;
  background: inherit;
  border: 1px solid currentColor;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.live-value-label {
  font-weight: 600;
  color: inherit;
  margin-bottom: 0.5em;
  font-size: 14px;
}
.live-value-content {
  font-family: 'Courier New', monospace;
  font-size: 15px;
  color: inherit;
  background: inherit;
  padding: 0.5em 1em;
  border-radius: 5px;
  border: 1px solid currentColor;
}

.live-value-content code {
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
