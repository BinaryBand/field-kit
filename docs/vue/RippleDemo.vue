<template>
  <div 
    ref="demoContainer"
    style="display: flex; gap: 1rem; flex-wrap: wrap; padding: 2rem; background: #f8f9fa; border-radius: 8px; margin: 1rem 0;"
  >
    <button 
      class="tw-ripple" 
      style="padding: 0.75rem 1.5rem; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;"
    >
      Basic Ripple
    </button>
    <button 
      class="tw-ripple" 
      data-center-ripple 
      style="padding: 0.75rem; background: #28a745; color: white; border: none; border-radius: 50%; width: 50px; height: 50px; cursor: pointer; font-size: 20px;"
    >
      ⭐
    </button>
    <button 
      class="tw-ripple" 
      data-focus-ripple 
      style="padding: 0.75rem 1.5rem; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;"
    >
      Focus Ripple
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import init from '@/index';

const demoContainer = ref<HTMLElement | null>(null);

onMounted(() => {
  // Initialize TW Components for the demo container
  if (demoContainer.value) {
    init(demoContainer.value);
  }
});
</script>
