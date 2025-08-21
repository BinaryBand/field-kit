---
title: Auto-Resize Textarea
description: A textarea component that automatically adjusts its height based on content
---

# Auto-Resize Textarea

A textarea component that automatically adjusts its height based on the amount of content, providing a better user experience for multi-line text input.

## Demo

<FormDemo query="textarea.tw-auto-resize">
<textarea class="tw-auto-resize form-control" name="Multiline" placeholder="Enter your message...">
First Line
  Second Line
    Third Line</textarea>
</FormDemo>

## Basic Usage

```html
<textarea class="tw-auto-resize" name="message" placeholder="Enter your message..."></textarea>
```

## Properties

### CSS Classes

| Class             | Description                                          |
| ----------------- | ---------------------------------------------------- |
| `.tw-auto-resize` | Primary class that enables auto-resize functionality |

### HTML Attributes

All standard `textarea` attributes are supported:

| Attribute     | Type      | Default     | Description                    |
| ------------- | --------- | ----------- | ------------------------------ |
| `name`        | `string`  | `undefined` | Form field name                |
| `placeholder` | `string`  | `undefined` | Placeholder text               |
| `required`    | `boolean` | `false`     | Whether field is required      |
| `disabled`    | `boolean` | `false`     | Whether field is disabled      |
| `maxlength`   | `number`  | `undefined` | Maximum character length       |
| `rows`        | `number`  | `3`         | Initial number of visible rows |

## Examples

### Basic Example

```html
<textarea class="tw-auto-resize" name="message" placeholder="Type your message here..."></textarea>
```

### With Initial Content

```html
<textarea class="tw-auto-resize" name="description">
This textarea will automatically expand
as you add more lines of content.

Try typing here to see it in action!
</textarea>
```

### Form Integration

```html
<form id="messageForm">
  <label for="message">Your Message:</label>
  <textarea
    id="message"
    class="tw-auto-resize"
    name="message"
    placeholder="Enter your message..."
    required
  ></textarea>
  <button type="submit">Send</button>
</form>

<script>
  document.getElementById('messageForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    console.log('Message:', formData.get('message'));
  });
</script>
```

## Styling

### CSS Custom Properties

The component supports the following CSS custom properties for theming:

```css
:root {
  --tw-auto-resize-min-height: 3rem;
  --tw-auto-resize-max-height: 20rem;
  --tw-auto-resize-border: 1px solid #dee2e6;
  --tw-auto-resize-border-radius: 4px;
  --tw-auto-resize-padding: 0.375rem 0.75rem;
  --tw-auto-resize-font-family: inherit;
  --tw-auto-resize-line-height: 1.5;
}
```

### Custom Styling

```css
/* Basic styling */
.tw-auto-resize {
  border: var(--tw-auto-resize-border);
  border-radius: var(--tw-auto-resize-border-radius);
  padding: var(--tw-auto-resize-padding);
  font-family: var(--tw-auto-resize-font-family);
  line-height: var(--tw-auto-resize-line-height);
  min-height: var(--tw-auto-resize-min-height);
  max-height: var(--tw-auto-resize-max-height);
  resize: none; /* Disable manual resize */
  transition: border-color 0.2s ease;
}

/* Focus state */
.tw-auto-resize:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

/* Disabled state */
.tw-auto-resize:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: #f8f9fa;
}
```

## Events

### Standard HTML Events

The component emits all standard textarea events:

| Event     | When Triggered                               | Event Data                              |
| --------- | -------------------------------------------- | --------------------------------------- |
| `input`   | When the content changes                     | `e.target.value` contains current value |
| `change`  | When content changes and element loses focus | `e.target.value` contains current value |
| `focus`   | When the textarea gains focus                | Standard focus event                    |
| `blur`    | When the textarea loses focus                | Standard blur event                     |
| `keydown` | When a key is pressed                        | Standard keyboard event                 |
| `keyup`   | When a key is released                       | Standard keyboard event                 |

### Example Event Handling

```javascript
const textarea = document.querySelector('.tw-auto-resize');

textarea.addEventListener('input', function (e) {
  console.log('Content changed:', e.target.value);
  console.log('Current height:', e.target.scrollHeight + 'px');
});

textarea.addEventListener('focus', function (e) {
  console.log('Textarea focused');
});
```

## Accessibility

### ARIA Support

- Inherits all standard textarea accessibility features
- Supports `aria-label` and `aria-describedby` attributes
- Compatible with screen readers
- Proper focus management

### Keyboard Interaction

| Key            | Action                          |
| -------------- | ------------------------------- |
| `Tab`          | Move focus to/from the textarea |
| `Enter`        | Add new line and auto-resize    |
| `Ctrl/Cmd + A` | Select all text                 |
| `Ctrl/Cmd + Z` | Undo last action                |

## Browser Support

- Chrome 88+
- Firefox 78+
- Safari 14+
- Edge 88+

## Use Cases

- **Comment forms**: Perfect for user comments and feedback
- **Message composition**: Email clients and messaging apps
- **Content editing**: Blog post content, article descriptions
- **Form fields**: Any multi-line text input that may vary in length
- **Chat applications**: Message input that grows with content

## Related Components

- [List Input](/components/inputs/list) - For managing arrays of text values
- [Select Input](/components/inputs/select) - For choosing from predefined options
- [Signature Input](/components/inputs/signature) - For capturing signatures and drawings

<script setup lang="ts">
import FormDemo from './../../vue/FormDemo.vue';
</script>
