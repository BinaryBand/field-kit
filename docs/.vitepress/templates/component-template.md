---
title: Component Name
description: Brief description of what this component does
---

# Component Name

Brief description of what this component does and its main use cases.

## Demo

<FormDemo query="selector-for-component">
  <!-- Example HTML for the component -->
  <input type="example" name="componentName" />
</FormDemo>

## Basic Usage

```html
<input type="example" name="componentName" />
```

## Properties

### HTML Attributes

| Attribute    | Type     | Default     | Description                             |
| ------------ | -------- | ----------- | --------------------------------------- |
| `attribute1` | `string` | `undefined` | Description of what this attribute does |
| `attribute2` | `number` | `0`         | Description of what this attribute does |

### Data Attributes

| Attribute      | Type     | Default     | Description                                      |
| -------------- | -------- | ----------- | ------------------------------------------------ |
| `data-example` | `string` | `"default"` | Description of what this data attribute controls |

### CSS Classes

| Class                | Description                               |
| -------------------- | ----------------------------------------- |
| `.tw-example`        | Primary class for styling the component   |
| `.tw-example-active` | Applied when component is in active state |

## Examples

### Basic Example

```html
<input type="example" name="basic" />
```

### Advanced Example

```html
<input type="example" name="advanced" data-example="custom-value" class="custom-styling" />
```

### Form Integration

```html
<form id="exampleForm">
  <label for="component">Component Label:</label>
  <input id="component" type="example" name="componentValue" required />
  <button type="submit">Submit</button>
</form>

<script>
  document.getElementById('exampleForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    console.log('Component value:', formData.get('componentValue'));
  });
</script>
```

## Styling

### CSS Custom Properties

The component supports the following CSS custom properties for theming:

```css
:root {
  --tw-example-color: #007bff;
  --tw-example-background: #fff;
  --tw-example-border: 1px solid #dee2e6;
  --tw-example-border-radius: 4px;
  --tw-example-padding: 0.375rem 0.75rem;
}
```

### Custom Styling

```css
/* Basic component styling */
input[type='example'] {
  border: var(--tw-example-border);
  border-radius: var(--tw-example-border-radius);
  padding: var(--tw-example-padding);
  background: var(--tw-example-background);
}

/* Focus state */
input[type='example']:focus {
  outline: none;
  border-color: var(--tw-example-color);
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

/* Disabled state */
input[type='example']:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
```

## Events

### Standard HTML Events

The component emits standard HTML form events:

| Event    | When Triggered                                 | Event Data                              |
| -------- | ---------------------------------------------- | --------------------------------------- |
| `input`  | When the value changes                         | `e.target.value` contains current value |
| `change` | When the value changes and element loses focus | `e.target.value` contains current value |
| `focus`  | When the component gains focus                 | Standard focus event                    |
| `blur`   | When the component loses focus                 | Standard blur event                     |

### Example Event Handling

```javascript
const component = document.querySelector('input[type="example"]');

component.addEventListener('input', function (e) {
  console.log('Value changed:', e.target.value);
});

component.addEventListener('change', function (e) {
  console.log('Final value:', e.target.value);
});
```

## Accessibility

### ARIA Support

- Component includes proper ARIA labels and descriptions
- Screen reader compatible
- Keyboard navigation supported

### Keyboard Interaction

| Key      | Action                                   |
| -------- | ---------------------------------------- |
| `Tab`    | Move focus to/from the component         |
| `Enter`  | Activate component (if applicable)       |
| `Escape` | Cancel current operation (if applicable) |

## Browser Support

- Chrome 88+
- Firefox 78+
- Safari 14+
- Edge 88+

## Related Components

- [Related Component 1](/components/category/related1) - Brief description
- [Related Component 2](/components/category/related2) - Brief description

## API Reference

### JavaScript API (if applicable)

```javascript
// Access component instance
const component = document.querySelector('input[type="example"]');

// Methods
component.reset(); // Reset to default value
component.validate(); // Validate current value
component.focus(); // Focus the component

// Properties
component.value; // Get/set current value
component.disabled; // Get/set disabled state
```

<script setup lang="ts">
import FormDemo from '../../vue/FormDemo.vue';
</script>
