<template>
  <div style="display: flex; gap: 1rem; flex-wrap: wrap; padding: 2rem; background: #f8f9fa; border-radius: 8px; margin: 1rem 0;">
    <button 
      ref="basicButton"
      class="tw-ripple" 
      style="padding: 0.75rem 1.5rem; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;"
    >
      Basic Ripple
    </button>
    <button 
      ref="centerButton"
      class="tw-ripple" 
      data-center-ripple 
      style="padding: 0.75rem; background: #28a745; color: white; border: none; border-radius: 50%; width: 50px; height: 50px; cursor: pointer; font-size: 20px;"
    >
      ⭐
    </button>
    <button 
      ref="focusButton"
      class="tw-ripple" 
      data-focus-ripple 
      style="padding: 0.75rem 1.5rem; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;"
    >
      Focus Ripple
    </button>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import init from '@/index';

const basicButton = ref(null);
const centerButton = ref(null);
const focusButton = ref(null);

onMounted(() => {
  // Initialize TW Components for each button's parent
  if (basicButton.value) {
    const container = basicButton.value.parentElement;
    if (container) {
      init(container);
    }
  }
});
</script>
