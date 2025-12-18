import { ref, onMounted, type Ref } from 'vue';

/**
 * Composable for tracking form input values
 * Provides reactive value tracking for form inputs with support for multi-select
 */
export function useFormTracking() {
  const values: Ref<Record<string, string>> = ref({});

  /**
   * Handle change events from form inputs
   */
  function handleChange(event: Event): void {
    const target = event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    const name = target.name;
    
    if (!name) return;

    if (target instanceof HTMLSelectElement && target.multiple) {
      const selectedValues = Array.from(target.selectedOptions).map((option) => option.value);
      values.value[name] = JSON.stringify(selectedValues);
    } else {
      values.value[name] = target.value;
    }
    
    // Force reactivity update
    values.value = { ...values.value };
  }

  /**
   * Initialize form tracking by attaching event listeners
   */
  function initializeTracking(selector: string = '.tw-form'): void {
    onMounted(() => {
      const container = document.querySelector(selector);
      if (container) {
        container.addEventListener('input', handleChange, true);
        container.addEventListener('change', handleChange, true);

        // Trigger initial change events to populate values
        container
          .querySelectorAll('select, input, textarea')
          .forEach((element) => {
            const event = new Event('change', { bubbles: true });
            element.dispatchEvent(event);
          });
      }
    });
  }

  return {
    values,
    handleChange,
    initializeTracking,
  };
}
