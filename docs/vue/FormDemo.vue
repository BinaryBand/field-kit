<template>
  <div class="tw-form">
    <slot />
    <div v-if="Object.keys(liveValues).length === 0" class="no-values">
      <p>No value yet. Interact with the input above.</p>
    </div>
    <div v-else>
      <div v-for="(value, name) in liveValues" :key="name">
        <LiveValue :value="value">
          <template #label>
            {{ name }} Value
          </template>
        </LiveValue>
      </div>
    </div>
  </div>
</template>

<style scoped>
.center-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
}

.btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn:hover {
  background: #0056b3;
}

.form-results {
  margin-top: 2rem;
  padding: 1.5rem;
  border: 2px solid #e3f2fd;
  border-radius: 8px;
  background: #f8f9fa;
}

.form-results h4 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 16px;
}

.no-values {
  text-align: center;
  color: #6c757d;
  font-style: italic;
}

.no-values code {
  background: #e9ecef;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-size: 12px;
}

.values-list {
  display: grid;
  gap: 1rem;
}

.value-item {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 1rem;
  align-items: start;
  padding: 0.75rem;
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 4px;
}

.field-name {
  font-weight: 600;
  color: #495057;
  font-size: 14px;
}

.field-value {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Courier New', monospace;
  font-size: 13px;
}

.field-value code {
  background: #f8f9fa;
  padding: 0.25rem 0.5rem;
  border-radius: 3px;
  border: 1px solid #e9ecef;
  word-break: break-all;
  flex: 1;
}

.array-badge,
.empty-badge {
  font-size: 11px;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-weight: 500;
}

.array-badge {
  background: #e3f2fd;
  color: #1976d2;
}

.empty-badge {
  background: #fff3e0;
  color: #f57c00;
}

.field-value.array code {
  color: #1976d2;
}

.field-value.empty code {
  color: #f57c00;
  font-style: italic;
}

.results-actions {
  margin-top: 1.5rem;
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.copy-btn,
.close-btn {
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  border: 1px solid #dee2e6;
}

.copy-btn {
  background: #28a745;
  color: white;
  border-color: #28a745;
}

.copy-btn:hover {
  background: #218838;
}

.close-btn {
  background: #6c757d;
  color: white;
  border-color: #6c757d;
}

.close-btn:hover {
  background: #5a6268;
}
</style>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import LiveValue from './LiveValue.vue';

const liveValues = ref<Record<string, any>>({});

function updateLiveValue(e: Event) {
  const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
  if (!target.name) return;
  liveValues.value[target.name] = target.value;
}

onMounted(() => {
  // Listen for input/change events on all child inputs
  const container = document.querySelector('.tw-form');
  if (container) {
    container.addEventListener('input', updateLiveValue, true);
    container.addEventListener('change', updateLiveValue, true);
  }
});
</script>
