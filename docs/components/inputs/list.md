---
title: List Input
description: A dynamic input component for managing lists of items with add/remove functionality
---

# List Input

A dynamic input component for managing lists of items with add/remove functionality

## Demo

<FormDemo>
<input class="form-control" name="ListInput" placeholder="List Input" type="list" value='["One","Two","Three"]' />
</FormDemo>

## Basic Usage

```html
<input name="ListInput" type="list" placeholder="Add items..." />
```

## Properties

### HTML Attributes

| Attribute | Type | Default | Description |
| --------- | --------- | --------- | --------- |
| `type` | `string` | `"list"` | Must be set to "list" to activate component |
| `name` | `string` | `undefined` | Form field name |
| `placeholder` | `string` | `undefined` | Placeholder text for input |
| `value` | `string` | `"[]"` | JSON array string of initial items |
| `disabled` | `boolean` | `false` | Whether field is disabled |
| `required` | `boolean` | `false` | Whether field is required |

## Examples

(Examples section - see original documentation)

## Behavior

### Adding Items

- Type text and press `Enter` to add an item
- Items are displayed as removable tokens
- Duplicate items are allowed by default

### Removing Items

- Click the X button on any token to remove it
- Press `Backspace` on empty input to remove last item

### Value Format

The component stores values as a JSON array string:
```javascript
// Stored value format
'["Item 1","Item 2","Item 3"]'

// Accessing in JavaScript
const listInput = document.querySelector('input[type="list"]');
const items = JSON.parse(listInput.value);
```

## Events

### Standard HTML Events

| Event | When Triggered | Event Data |
| --------- | --------- | --------- |
| `change` | When items are added or removed | e.target.value contains JSON array string |
| `input` | When the text input changes | e.target.value contains JSON array string |

### Example Event Handling

(See original documentation for examples)

## Accessibility

This component follows WAI-ARIA best practices:

- Supports standard `aria-label`, `aria-describedby`, and `aria-required` attributes
- Compatible with screen readers
- Full keyboard navigation support
- Proper focus management
- Behaves like a native HTML input element


<script setup lang='ts'>
  import FormDemo from './../../vue/FormDemo.vue';
</script>