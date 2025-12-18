<template>
  <div>
    <form class="tw-form" @submit.prevent="handleSubmit">
      <!-- Select Input - Single -->
      <div>
        <h5>{{ selectComponent.name }} (Single)</h5>
        <p class="component-description">{{ selectComponent.description }}</p>
        <select class="tw-select-group" name="SingleSelect" data-type="number">
          <option class="tw-option" value="1">Albuquerque</option>
          <option class="tw-option" value="2" selected>Boston</option>
          <option class="tw-option" value="3">Chicago</option>
          <option class="tw-option" value="4">Denver</option>
          <option class="tw-option" value="5">El Paso</option>
        </select>
        <pre class="value-display">{{ values.SingleSelect ?? '(empty)' }}</pre>
        <hr />
      </div>

      <!-- Select Input - Multiple -->
      <div>
        <h5>{{ selectComponent.name }} (Multiple)</h5>
        <p class="component-description">{{ selectComponent.description }}</p>
        <select class="tw-select-group" multiple name="MultiSelect">
          <option class="tw-option" value="alb">Albuquerque</option>
          <option class="tw-option" value="bos" selected>Boston</option>
          <option class="tw-option" value="chi">Chicago</option>
          <option class="tw-option" value="den">Denver</option>
          <option class="tw-option" value="elp">El Paso</option>
        </select>
        <pre class="value-display">{{ values.MultiSelect ?? '(empty)' }}</pre>
        <hr />
      </div>

      <!-- Select Input - Grouped -->
      <div>
        <h5>{{ selectComponent.name }} (Grouped)</h5>
        <p class="component-description">{{ selectComponent.description }}</p>
        <select class="tw-select-group" multiple name="GroupedSelect">
          <option class="tw-option" value="apple" data-group="Fruits">Apple</option>
          <option class="tw-option" value="banana" data-group="Fruits">Banana</option>
          <option class="tw-option" value="orange" data-group="Fruits">Orange</option>
          <option class="tw-option" value="strawberry" data-group="Fruits">Strawberry</option>
          <option class="tw-option" value="carrot" data-group="Vegetables" selected>Carrot</option>
          <option class="tw-option" value="broccoli" data-group="Vegetables">Broccoli</option>
          <option class="tw-option" value="spinach" data-group="Vegetables">Spinach</option>
          <option class="tw-option" value="tomato" data-group="Vegetables">Tomato</option>
          <option class="tw-option" value="chicken" data-group="Proteins">Chicken</option>
          <option class="tw-option" value="beef" data-group="Proteins" selected>Beef</option>
          <option class="tw-option" value="salmon" data-group="Proteins">Salmon</option>
          <option class="tw-option" value="tofu" data-group="Proteins" selected>Tofu</option>
        </select>
        <pre class="value-display">{{ values.GroupedSelect ?? '(empty)' }}</pre>
        <hr />
      </div>

      <!-- List Input Component -->
      <div>
        <h5>{{ listComponent.name }}</h5>
        <p class="component-description">{{ listComponent.description }}</p>
        <input name="ListInput" type="list" value='["One","Two","Three"]' />
        <pre class="value-display">{{ values.ListInput ?? '(empty)' }}</pre>
        <hr />
      </div>

      <!-- PIN Input Component -->
      <div>
        <h5>{{ pinComponent.name }}</h5>
        <p class="component-description">{{ pinComponent.description }}</p>
        <input type="pin" name="PinInput" data-size="6" />
        <pre class="value-display">{{ values.PinInput || '(empty)' }}</pre>
        <hr />
      </div>

      <!-- Auto-Resize Textarea -->
      <div>
        <h5>{{ autoResizeComponent.name }}</h5>
        <p class="component-description">{{ autoResizeComponent.description }}</p>
        <textarea class="tw-auto-resize" name="Multiline">
First Line
Second Line</textarea
        >
        <pre class="value-display">{{ values.Multiline ?? '(empty)' }}</pre>
        <hr />
      </div>

      <!-- Signature Input Component -->
      <div>
        <h5>{{ signatureComponent.name }}</h5>
        <p class="component-description">{{ signatureComponent.description }}</p>
        <input type="signature" name="Signature" placeholder="Sign here" />
        <button type="button" @click="clearSignature">Clear Signature</button>
        <pre class="value-display">{{ values.Signature || '(empty)' }}</pre>
        <hr />
      </div>
    </form>

    <!-- Results Display -->
    <div v-if="formData">
      <h5>Form Data</h5>
      <pre>{{ formData }}</pre>
    </div>
  </div>
</template>

<style scoped>
input,
select,
textarea {
  border: solid 1px currentColor;
  border-radius: 4px;
  padding: 0.5rem;
}

textarea {
  background-color: inherit;
  width: 100%;
}

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
import { ref } from 'vue';
import { useFormTracking } from './composables/useFormTracking';
import componentsData from '../.vitepress/data/components.json';

interface ComponentAttribute {
  name: string;
  type: string;
  default: string;
  description: string;
}

interface Component {
  id: string;
  name: string;
  category: string;
  description: string;
  attributes: ComponentAttribute[];
}

const formData = ref<string | null>(null);

// Use the composable for form tracking
const { values, initializeTracking } = useFormTracking();
initializeTracking();

// Extract components from the JSON data
const components = componentsData.components as Component[];
const selectComponent = components.find((c) => c.id === 'select')!;
const listComponent = components.find((c) => c.id === 'list')!;
const pinComponent = components.find((c) => c.id === 'pin')!;
const autoResizeComponent = components.find((c) => c.id === 'auto-resize')!;
const signatureComponent = components.find((c) => c.id === 'signature')!;

const handleSubmit = (event: Event) => {
  const form = event.target as HTMLFormElement;
  const data = new FormData(form);
  const result: Record<string, any> = {};

  for (const [key, value] of data.entries()) {
    if (result[key]) {
      if (!Array.isArray(result[key])) {
        result[key] = [result[key]];
      }
      result[key].push(value);
    } else {
      result[key] = value;
    }
  }

  formData.value = JSON.stringify(result, null, 2);
};

function clearSignature(): void {
  const clearButton = document.querySelector(
    'button[data-testid="clear-signature-button"]'
  ) as HTMLButtonElement;
  if (clearButton) {
    clearButton.click();
  }
}
</script>
