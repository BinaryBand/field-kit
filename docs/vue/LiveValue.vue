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
import { computed, defineProps } from 'vue';
const props = defineProps<{ value: any }>();
const formattedValue = computed(() => {
  if (props.value === null || props.value === undefined || props.value === '') return '(empty)';
  if (Array.isArray(props.value)) return JSON.stringify(props.value);
  if (typeof props.value === 'object') return JSON.stringify(props.value);
  return String(props.value);
});
</script>

<style scoped>
.live-value-box {
  margin-top: 1.5em;
  padding: 1em 1.5em;
  background: #f6f8fa;
  border: 1px solid #e3e7ed;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.live-value-label {
  font-weight: 600;
  color: #1976d2;
  margin-bottom: 0.5em;
  font-size: 14px;
}
.live-value-content {
  font-family: 'Courier New', monospace;
  font-size: 15px;
  color: #333;
  background: #fff;
  padding: 0.5em 1em;
  border-radius: 5px;
  border: 1px solid #e3e7ed;
}
</style>
