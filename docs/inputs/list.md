---
title: { { name } }
description: { { description } }
---


<!-- AUTO-GENERATED: docs/.vitepress/data/components.json -->

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

### CSS Classes

_None_

### HTML Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `string` | `"list"` | Must be set to "list" to activate component |
| `name` | `string` | `undefined` | Form field name |
| `placeholder` | `string` | `undefined` | Placeholder text for input |
| `value` | `string` | `"[]"` | JSON array string of initial items |
| `disabled` | `boolean` | `false` | Whether field is disabled |
| `required` | `boolean` | `false` | Whether field is required |

### Option Attributes

_None_

## Events

| Event | When Triggered | Event Data |
| --- | --- | --- |
| `change` | When items are added or removed | e.target.value contains JSON array string |
| `input` | When the text input changes | e.target.value contains JSON array string |

<script setup lang="ts">
import FormDemo from '../vue/FormDemo.vue';
</script>
