---
title: PIN Input
description: Secure PIN entry with individual digit boxes and customizable length
---

# PIN Input

Secure PIN entry with individual digit boxes and customizable length

## Demo

<FormDemo>
<input class="form-control" data-size="6" name="Pin" placeholder="000000" type="pin" />
</FormDemo>

## Basic Usage

```html
<input type="pin" name="Pin" data-size="6" placeholder="000000" />
```

## Properties

### HTML Attributes

| Attribute | Type | Default | Description |
| --------- | --------- | --------- | --------- |
| `type` | `string` | `"pin"` | Must be set to "pin" to activate component |
| `name` | `string` | `undefined` | Form field name |
| `data-size` | `number` | `6` | Number of PIN digits (4, 6, 8, etc.) |
| `placeholder` | `string` | `undefined` | Placeholder text shown in empty boxes |
| `value` | `string` | `undefined` | Initial PIN value |
| `disabled` | `boolean` | `false` | Whether field is disabled |
| `required` | `boolean` | `false` | Whether field is required |
| `autoFocus` | `boolean` | `false` | Auto-focus first digit on mount |

## Examples

(Examples section - see original documentation)

## Behavior

### Input Handling

- Accepts only numeric digits (0-9)
- Auto-advances to next box after digit entry
- Auto-focuses previous box on backspace
- Paste support for full PIN codes
- Individual box selection with mouse click

### Keyboard Shortcuts

- Type digit: Fills current box and moves to next
- Backspace: Clears current box and moves to previous
- Arrow keys: Navigate between boxes
- Paste: Fills all boxes from clipboard
- Tab: Moves focus out of component

### Value Management

The component stores the complete PIN as a string:
```javascript
// Accessing PIN value
const pinInput = document.querySelector('input[type="pin"]');
console.log(pinInput.value); // "123456"
```

## Events

### Standard HTML Events

| Event | When Triggered | Event Data |
| --------- | --------- | --------- |
| `change` | When all digits are filled | e.target.value contains PIN |
| `input` | When any digit changes | e.target.value contains PIN |

### Example Event Handling

(See original documentation for examples)

## Accessibility

This component follows WAI-ARIA best practices:

- Supports standard `aria-label`, `aria-describedby`, and `aria-required` attributes
- Compatible with screen readers
- Full keyboard navigation support
- Proper focus management
- Behaves like a native HTML input element


## Security Considerations

- **Input masking**: Consider using `inputmode="numeric"` for mobile keyboards
- **Auto-clear on error**: Clear PIN after failed attempts
- **Rate limiting**: Implement server-side rate limiting
- **Secure transmission**: Always use HTTPS
- **No client-side validation**: Verify PINs server-side only

```html
<!-- With numeric keyboard on mobile -->
<input 
  type="pin" 
  name="pin" 
  data-size="6" 
  inputmode="numeric"
/>
```

<script setup lang='ts'>
  import FormDemo from './../../vue/FormDemo.vue';
</script>