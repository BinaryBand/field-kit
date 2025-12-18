<template>
  <div class="tw-form">
    <slot />
    <pre v-for="(value, name) in values" :key="name" class="value-display">{{ value ?? '(empty)' }}</pre>
  </div>
</template>

<style scoped>
.value-display {
  font-size: 0.75rem;
  background: rgba(128, 128, 128, 0.08);
  padding: 0.4rem 0.6rem;
  border-radius: 4px;
  margin-top: 0.5rem;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>

<script setup lang="ts">
import { useFormTracking } from './composables/useFormTracking';

const { values, initializeTracking } = useFormTracking();

// Initialize tracking for this form
initializeTracking();
</script>
