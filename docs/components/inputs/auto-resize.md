---
title: Auto-Resize Textarea
description: A textarea component that automatically adjusts its height based on content
---

# Auto-Resize Textarea

A textarea component that automatically adjusts its height based on content

## Demo

<FormDemo query="textarea.tw-auto-resize">
<textarea class="tw-auto-resize form-control" name="Multiline" placeholder="Enter your message...">First Line
  Second Line
    Third Line</textarea>
</FormDemo>

## Basic Usage

```html
<textarea class="tw-auto-resize" name="message" placeholder="Enter your message..."></textarea>
```

## Properties

### CSS Classes

| Class | Description |
| --------- | --------- |
| `.tw-auto-resize` | Primary class that enables auto-resize functionality |

### HTML Attributes

All standard `textarea` attributes are supported:

| Attribute | Type | Default | Description |
| --------- | --------- | --------- | --------- |
| `name` | `string` | `undefined` | Form field name |
| `placeholder` | `string` | `undefined` | Placeholder text |
| `required` | `boolean` | `false` | Whether field is required |
| `disabled` | `boolean` | `false` | Whether field is disabled |
| `maxlength` | `number` | `undefined` | Maximum character length |
| `rows` | `number` | `3` | Initial number of visible rows |

## Examples

(Examples section - see original documentation)

## Events

### Standard HTML Events

| Event | When Triggered | Event Data |
| --------- | --------- | --------- |
| `input` | When the content changes | e.target.value contains current value |
| `change` | When content changes and element loses focus | e.target.value contains current value |
| `focus` | When the textarea gains focus | Standard focus event |
| `blur` | When the textarea loses focus | Standard blur event |

### Example Event Handling

(See original documentation for examples)

## Accessibility

This component follows WAI-ARIA best practices:

- Supports standard `aria-label`, `aria-describedby`, and `aria-required` attributes
- Compatible with screen readers
- Full keyboard navigation support
- Proper focus management
- Inherits all standard textarea accessibility features


<script setup lang='ts'>
  import FormDemo from './../../vue/FormDemo.vue';
</script>