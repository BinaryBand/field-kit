<template>
  <h3>Demo</h3>
  <p>
    This is an interactive demonstration showcasing how form data is captured and displayed using
    the custom <code>event.formData</code> property provided by this library.
  </p>

  <form class="tw-form" @submit.prevent="handleSubmit" :id="id">
    <slot />

    <h3>Form Data</h3>

    <p>
      A form <code>submit</code> events in this library will include a custom
      <code>event.formData</code> property with the form's data.
    </p>

    <div class="paper display" ref="displayElement">{{ displayData }}</div>

    <button hidden ref="updateButton" type="submit">Submit</button>
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted, Ref } from 'vue';
import { reduceFormData } from '../../src/controllers/components/Form';

function handleSubmit(event: Event): void {
  event.preventDefault();

  const { currentTarget } = event;

  if (currentTarget instanceof HTMLFormElement) {
    const formData = new Map();
    reduceFormData(formData, currentTarget);

    const formDataObject = Object.fromEntries(formData);
    displayData.value = JSON.stringify(formDataObject);
  }
}

const props = defineProps({
  query: { type: String, default: 'input' },
});

const id: string = Math.random().toString(36).substring(2);
const queryString: string = props.query;

const displayElement: Ref<HTMLDivElement | null> = ref(null);
const updateButton: Ref<HTMLButtonElement | null> = ref(null);
const displayData: Ref<string> = ref('');

onMounted(() => {
  if (typeof document === 'undefined') return;

  if (updateButton.value !== null) {
    updateButton.value.click();
  }

  const externalTarget: Element | null = document.querySelector(queryString);
  if (externalTarget !== null) {
    externalTarget.addEventListener('change', () => {
      if (updateButton.value) {
        updateButton.value.click();
      }
    });
  }
});
</script>

<style scoped>
div.display {
  overflow: hidden;
  text-overflow: ellipsis;
  text-wrap: nowrap;
}
</style>
