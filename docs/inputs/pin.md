---
title: { { name } }
description: { { description } }
---


<!-- AUTO-GENERATED: docs/.vitepress/data/components.json -->

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

### CSS Classes

_None_

### HTML Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `string` | `"pin"` | Must be set to "pin" to activate component |
| `name` | `string` | `undefined` | Form field name |
| `data-size` | `number` | `6` | Number of PIN digits (4, 6, 8, etc.) |
| `placeholder` | `string` | `undefined` | Placeholder text shown in empty boxes |
| `value` | `string` | `undefined` | Initial PIN value |
| `disabled` | `boolean` | `false` | Whether field is disabled |
| `required` | `boolean` | `false` | Whether field is required |
| `autoFocus` | `boolean` | `false` | Auto-focus first digit on mount |

### Option Attributes

_None_

## Events

| Event | When Triggered | Event Data |
| --- | --- | --- |
| `change` | When all digits are filled | e.target.value contains PIN |
| `input` | When any digit changes | e.target.value contains PIN |

<script setup lang="ts">
import FormDemo from '../vue/FormDemo.vue';
</script>
