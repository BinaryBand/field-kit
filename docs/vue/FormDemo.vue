<template>
  <form class="tw-form" @submit.prevent="handleSubmit">
    <slot />

    <hr />

    <div class="center-container">
      <button class="btn" ref="submitButton" type="submit">Submit & Show Values</button>
    </div>

    <!-- Form values display -->
    <div v-if="showResults" class="form-results">
      <h4>📋 Form Values</h4>
      <div v-if="formValues.length === 0" class="no-values">
        <p>No form data found. Make sure your inputs have <code>name</code> attributes.</p>
      </div>
      <div v-else class="values-list">
        <div v-for="field in formValues" :key="field.name" class="value-item">
          <div class="field-name">{{ field.name }}</div>
          <div class="field-value" :class="field.type">
            <span v-if="field.type === 'array'" class="array-badge"
              >Array ({{ field.value.length }})</span
            >
            <span v-if="field.type === 'empty'" class="empty-badge">Empty</span>
            <code>{{ field.displayValue }}</code>
          </div>
        </div>
      </div>
      <div class="results-actions">
        <button type="button" @click="copyToClipboard" class="copy-btn">📋 Copy JSON</button>
        <button type="button" @click="showResults = false" class="close-btn">✕ Close</button>
      </div>
    </div>
  </form>
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
import { ref, Ref } from 'vue';
import { reduceFormData } from '../../src/controllers/components/Form';

interface FormField {
  name: string;
  value: any;
  displayValue: string;
  type: 'string' | 'array' | 'object' | 'empty';
}

const submitButton: Ref<HTMLButtonElement | null> = ref(null);
const showResults = ref(false);
const formValues = ref<FormField[]>([]);
const rawFormData = ref<any>({});

function formatValue(value: any): { displayValue: string; type: FormField['type'] } {
  if (value === null || value === undefined || value === '') {
    return { displayValue: '(empty)', type: 'empty' };
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return { displayValue: '[]', type: 'empty' };
    }
    return { displayValue: JSON.stringify(value, null, 2), type: 'array' };
  }

  if (typeof value === 'object') {
    return { displayValue: JSON.stringify(value, null, 2), type: 'object' };
  }

  return { displayValue: String(value), type: 'string' };
}

function handleSubmit(event: Event) {
  event.preventDefault();

  const { currentTarget } = event;

  if (currentTarget instanceof HTMLFormElement) {
    const formData: Record<string, any> = {};
    reduceFormData(formData, currentTarget);

    rawFormData.value = formData;

    // Convert to display format
    const fields: FormField[] = [];
    Object.entries(formData).forEach(([key, value]) => {
      const formatted = formatValue(value);
      fields.push({
        name: key,
        value: value,
        displayValue: formatted.displayValue,
        type: formatted.type,
      });
    });

    formValues.value = fields;
    showResults.value = true;
  }
}

async function copyToClipboard() {
  try {
    const jsonString = JSON.stringify(rawFormData.value, null, 2);
    await navigator.clipboard.writeText(jsonString);

    // Visual feedback
    const copyBtn = document.querySelector('.copy-btn') as HTMLButtonElement;
    if (copyBtn) {
      const originalText = copyBtn.textContent;
      copyBtn.textContent = '✓ Copied!';
      copyBtn.style.background = '#20c997';
      setTimeout(() => {
        copyBtn.textContent = originalText;
        copyBtn.style.background = '#28a745';
      }, 1500);
    }
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
  }
}
</script>
