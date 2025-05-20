<template>
  <form class="tw-form" @submit.prevent="handleSubmit">
    <slot />

    <br />

    <button class="btn" ref="submitButton" type="submit">Submit Form Demo</button>
  </form>

  <Toast ref="toastComponent" />
</template>

<script setup lang="ts">
import Toast from './Toast.vue';
import { ref, Ref } from 'vue';

import { reduceFormData } from '../../src/controllers/components/Form';

function triggerToast(title: string, message: string): void {
  if (toastComponent.value && toastComponent.value.showToast) {
    toastComponent.value.showToast(title, message, 5000);
  }
}

function truncateString(str: string, maxLength: number = 64): string {
  if (str.length > maxLength) {
    return str.slice(0, maxLength) + '...';
  }
  return str;
}

function stringifyPrimitive(x: unknown): string {
  let value: string;
  switch (typeof x) {
    case 'string':
      value = `"${truncateString(x)}"`;
      break;
    case 'number':
    case 'boolean':
      value = `${x}`;
      break;
    default:
      value = JSON.stringify(x);
  }
  return value;
}

function formDataToString(formData: Map<string, TWFormData>, depth: number): string {
  let content: string = '';

  formData.forEach((value: TWFormData, key: string): void => {
    if (Array.isArray(value)) {
      content += `${'\t'.repeat(depth)}${key}: [\n`;

      for (const x of value) {
        content += `${'\t'.repeat(depth + 1)}`;
        content += stringifyPrimitive(x);
        content += ',\n';
      }

      content += `${'\t'.repeat(depth)}]\n`;
    } else if (typeof value === 'object') {
      content += `${'\t'.repeat(depth)}${key}: {\n`;
      content += formDataToString(value, depth + 1);
      content += `${'\t'.repeat(depth)}}\n`;
    } else {
      content += `${'\t'.repeat(depth)}${key}: ${stringifyPrimitive(value)}\n`;
    }
  });

  return content;
}

function handleSubmit(event: Event) {
  event.preventDefault();

  const { currentTarget } = event;

  if (currentTarget instanceof HTMLFormElement) {
    const formData: Map<string, TWFormData> = new Map();
    reduceFormData(formData, currentTarget);

    let content: string = '{\n';
    content += '\ttype: submit,\n';
    content += '\ttarget: form.tw-from,\n';
    content += '\tformData: Map -> {\n';
    content += formDataToString(formData, 2);
    content += '\t},\n';
    content += '\t...\n';
    content += '}';

    triggerToast('Event', content);
  }
}

const submitButton: Ref<HTMLButtonElement | null> = ref(null);
const toastComponent: Ref<InstanceType<typeof Toast> | null> = ref(null);
</script>
