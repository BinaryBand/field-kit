<template>
  <div>
    <form class="tw-form" @submit.prevent="handleSubmit" style="--tw-dropdown-bg: #0d6efd">
      <!-- Select Input - Single -->
      <div>
        <h5>{{ selectComponent.name }} (Single)</h5>
        <p class="component-description">{{ selectComponent.description }}</p>
        <select
          class="tw-select-group"
          name="SingleSelect"
          data-placeholder="Choose a city..."
          data-type="number"
          @change="handleFieldChange"
        >
          <option class="tw-option" value="1">Albuquerque</option>
          <option class="tw-option" value="2" selected>Boston</option>
          <option class="tw-option" value="3">Chicago</option>
          <option class="tw-option" value="4">Denver</option>
          <option class="tw-option" value="5">El Paso</option>
        </select>
        <pre class="value-display">{{ values.SingleSelect ?? '(empty)' }}</pre>
        <hr class="component-divider" />
      </div>

      <!-- Select Input - Multiple -->
      <div>
        <h5>{{ selectComponent.name }} (Multiple)</h5>
        <p class="component-description">{{ selectComponent.description }}</p>
        <select
          class="tw-select-group"
          multiple
          name="MultiSelect"
          data-placeholder="Choose multiple cities..."
          @change="handleFieldChange"
        >
          <option class="tw-option" value="alb">Albuquerque</option>
          <option class="tw-option" value="bos" selected>Boston</option>
          <option class="tw-option" value="chi">Chicago</option>
          <option class="tw-option" value="den">Denver</option>
          <option class="tw-option" value="elp">El Paso</option>
        </select>
        <pre class="value-display">{{ values.MultiSelect ?? '(empty)' }}</pre>
        <hr class="component-divider" />
      </div>

      <!-- Select Input - Grouped -->
      <div>
        <h5>{{ selectComponent.name }} (Grouped)</h5>
        <p class="component-description">{{ selectComponent.description }}</p>
        <select
          class="tw-select-group"
          multiple
          name="GroupedSelect"
          data-placeholder="Choose items from groups..."
          @change="handleFieldChange"
        >
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
        <hr class="component-divider" />
      </div>

      <!-- List Input Component -->
      <div>
        <h5>{{ listComponent.name }}</h5>
        <p class="component-description">{{ listComponent.description }}</p>
        <input
          name="ListInput"
          type="list"
          :placeholder="
            listComponent.attributes.find((a) => a.name === 'placeholder')?.default ||
            'Add items...'
          "
          value='["One","Two","Three"]'
          @change="handleFieldChange"
          @input="handleFieldChange"
        />
        <pre class="value-display">{{ values.ListInput ?? '(empty)' }}</pre>
        <hr class="component-divider" />
      </div>

      <!-- PIN Input Component -->
      <div>
        <h5>{{ pinComponent.name }}</h5>
        <p class="component-description">{{ pinComponent.description }}</p>
        <input
          type="pin"
          name="PinInput"
          :data-size="pinComponent.attributes.find((a) => a.name === 'data-size')?.default || 6"
          placeholder="000000"
          @change="handleFieldChange"
          @input="handleFieldChange"
        />
        <pre class="value-display">{{ values.PinInput ?? '(empty)' }}</pre>
        <hr class="component-divider" />
      </div>

      <!-- Auto-Resize Textarea -->
      <div>
        <h5>{{ autoResizeComponent.name }}</h5>
        <p class="component-description">{{ autoResizeComponent.description }}</p>
        <textarea
          class="tw-auto-resize"
          name="Multiline"
          :placeholder="
            autoResizeComponent.attributes.find((a) => a.name === 'placeholder')?.default ||
            'Enter your message...'
          "
          @input="handleFieldChange"
        >
First Line
Second Line
Third Line</textarea
        >
        <pre class="value-display">{{ values.Multiline ?? '(empty)' }}</pre>
        <hr class="component-divider" />
      </div>

      <!-- Signature Input Component -->
      <div>
        <h5>{{ signatureComponent.name }}</h5>
        <p class="component-description">{{ signatureComponent.description }}</p>
        <input
          type="signature"
          name="Signature"
          :placeholder="
            signatureComponent.attributes.find((a) => a.name === 'placeholder')?.default ||
            'Sign Here'
          "
          @change="handleFieldChange"
        />
        <pre class="value-display">{{ values.Signature ?? '(empty)' }}</pre>
        <hr class="component-divider" />
      </div>
    </form>

    <!-- Results Display -->
    <div v-if="formData">
      <h5>Form Data</h5>
      <pre>{{ formData }}</pre>
    </div>
  </div>
</template>

<style>
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

input::placeholder,
textarea::placeholder {
  color: rgba(128, 128, 128, 0.6);
  opacity: 1;
}

.component-description {
  color: rgba(128, 128, 128, 0.8);
  font-size: 0.9rem;
  margin: 0.5rem 0 1rem 0;
}

.component-divider {
  border: none;
  border-top: 1px solid rgba(128, 128, 128, 0.2);
  margin: 2rem 0;
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
import { ref, onMounted } from 'vue';
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
const values = ref<Record<string, string>>({});

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

function handleFieldChange(event: Event): void {
  const target = event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
  const name = target.name;
  if (!name) return;
  if (target instanceof HTMLSelectElement && target.multiple) {
    const vals = Array.from(target.selectedOptions).map((o) => o.value);
    values.value[name] = JSON.stringify(vals);
  } else {
    values.value[name] = target.value;
  }
}

onMounted(() => {
  // Load TW Client CSS
  const twClientLink = document.createElement('link');
  twClientLink.rel = 'stylesheet';
  twClientLink.href = '/docs/tw-client.css';
  document.head.appendChild(twClientLink);

  // Load TW Client bundle
  const script = document.createElement('script');
  script.src = '/docs/main.umd.js';
  script.async = true;
  document.head.appendChild(script);

  // Initialize values with default values from the form
  const form = document.querySelector('.tw-form') as HTMLFormElement;
  if (form) {
    const elements = form.querySelectorAll('input[name], select[name], textarea[name]');
    elements.forEach((element) => {
      const target = element as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
      const name = target.name;
      if (!name) return;

      if (target instanceof HTMLSelectElement && target.multiple) {
        const vals = Array.from(target.selectedOptions).map((o) => o.value);
        if (vals.length > 0) {
          values.value[name] = JSON.stringify(vals);
        }
      } else if (target.value) {
        values.value[name] = target.value;
      }
    });
  }
});
</script>
