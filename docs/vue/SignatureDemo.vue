<template #default>
  <button @click="handleClearClick" type="button">Clear Input</button>

  <input
    ref="signatureInput"
    class="form-control"
    name="Signature"
    placeholder="Sign Here"
    type="signature"
  />
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue';

const signatureInput: Ref<HTMLInputElement | null> = ref(null);

function handleClearClick(): void {
  if (signatureInput.value) {
    signatureInput.value.value = '';
    signatureInput.value.dispatchEvent(new Event('change'));
  }
}
</script>
