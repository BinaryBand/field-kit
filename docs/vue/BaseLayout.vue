<script setup lang="ts">
// Ensure the custom components load.
import '@/index';
</script>

<template>
  <slot />
</template>

<style>
.border {
  border: solid;
  border-width: 2;
  border-color: var(--vp-c-text-2);
  border-radius: 8px;
  margin: 8px 0px;
  padding: 12px;
}

.border-dotted {
  box-shadow: none !important;
  border-style: dotted;
}

.border-dashed {
  box-shadow: none !important;
  border-style: dashed;
}

.stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn {
  background-color: var(--vp-button-brand-bg);
  color: var(--vp-button-brand-text);
  border: var(--vp-button-brand-border);
  border-radius: 20px;
  padding: 0 20px;
  line-height: 38px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: var(--docsearch-primary-color);
  }
  &:disabled {
    background-color: var(--vp-c-text-1);
    cursor: not-allowed;
  }
}

.form-control {
  background-color: var(--vp-input-bg-color);
  border: solid 1px var(--vp-c-text-1);
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 16px;
  transition: border-color 0.3s;
  width: 100%;

  &:focus {
    border-color: var(--docsearch-primary-color);
    outline: none;
  }
  &:disabled {
    background-color: var(--vp-c-bg-soft);
    border-color: #ddd;
    cursor: not-allowed;
  }
}

.paper {
  background-color: var(--vp-input-bg-color);
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  padding: 20px;
}

/* Global input styling for better visibility */
input:not([type="checkbox"]):not([type="radio"]),
select,
textarea {
  border: 1px solid var(--vp-c-divider) !important;
  border-radius: 4px !important;
}

input:not([type="checkbox"]):not([type="radio"]):focus,
select:focus,
textarea:focus {
  border-color: var(--vp-c-brand-1) !important;
  outline: none !important;
  box-shadow: 0 0 0 2px rgba(var(--vp-c-brand-1-rgb), 0.1) !important;
}

input:not([type="checkbox"]):not([type="radio"]):disabled,
select:disabled,
textarea:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
