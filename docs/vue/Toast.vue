<template>
  <div v-if="isVisible" class="toast">
    <div v-if="Boolean(titleRef)" class="toast-header">
      <div class="toast-title">{{ titleRef }}</div>
      <button class="toast-close-button" @click="hideToast">×</button>
    </div>

    <div v-if="Boolean(titleRef)" class="divider"></div>

    <small class="toast-content">{{ message }}</small>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue';

const props = defineProps({
  title: { type: String, default: null },
});

const titleRef: Ref<string | null> = ref(props.title);

const isVisible: Ref<boolean> = ref(false);
const message: Ref<string> = ref('');
const timeoutId: Ref<NodeJS.Timeout | null> = ref(null);

function hideToast(): void {
  isVisible.value = false;
  timeoutId.value = null;
}

function showToast(newTitle: string, newMessage: string, duration: number = 3000): void {
  isVisible.value = true;
  titleRef.value = newTitle;
  message.value = newMessage;

  if (timeoutId.value) {
    clearTimeout(timeoutId.value);
  }

  if (duration > 0) {
    timeoutId.value = setTimeout(hideToast, duration);
  }
}

defineExpose({ showToast });
</script>

<style scoped>
.toast {
  background-color: var(--vp-input-bg-color);
  border: 1px solid var(--vp-c-text-2);
  border-radius: 0.375rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
  color: var(--vp-c-text-soft);

  position: fixed;
  bottom: 20px;
  right: 20px;

  overflow: hidden;
  transition: opacity 0.3s ease-in-out;
  width: 350px;
  max-width: 100%;
  z-index: 9999;
}

.toast-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
}

.divider {
  border-top: 1px solid var(--vp-c-text-2);
}

.toast-title {
  font-weight: bolder;
  margin-right: 1rem;
}

.toast-content {
  white-space: pre-wrap;
  padding: 0.5rem 0.75rem;
  word-break: break-word;
}

.toast-close-button {
  background: none;
  border: none;
  color: var(--vp-c-text-soft);
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.toast-close-button:hover {
  color: var(--vp-c-text-1);
}
</style>
