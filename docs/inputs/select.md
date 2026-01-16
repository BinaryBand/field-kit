---
title: { { name } }
description: { { description } }
---


<!-- AUTO-GENERATED: docs/.vitepress/data/components.json -->

# Select Input

Enhanced select dropdown with search, multi-select, and grouping capabilities



## Demo

<FormDemo>
<select class="tw-select-group form-control" data-placeholder="Single Select" data-type="number" name="SingleSelect">
  <option class="tw-option" value="1">Albuquerque</option>
  <option class="tw-option" value="2">Boston</option>
  <option class="tw-option" value="3">Chicago</option>
</select>
</FormDemo>

## Basic Usage

```html
<select class="tw-select-group" name="city" data-placeholder="Select a city">
  <option class="tw-option" value="1">New York</option>
  <option class="tw-option" value="2">Los Angeles</option>
  <option class="tw-option" value="3">Chicago</option>
</select>
```

## Properties

### CSS Classes

| Class | Description |
| --- | --- |
| `.tw-select-group` | Required class to activate enhanced select |
| `.tw-option` | Applied to each option element |

### HTML Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | `undefined` | Form field name |
| `data-placeholder` | `string` | `undefined` | Placeholder text shown when no selection |
| `data-type` | `string` | `"string"` | Value type: "string", "number", "boolean" |
| `multiple` | `boolean` | `false` | Enable multi-select mode |
| `disabled` | `boolean` | `false` | Whether field is disabled |
| `required` | `boolean` | `false` | Whether field is required |

### Option Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | `undefined` | Option value |
| `selected` | `boolean` | `undefined` | Whether option is initially selected |
| `disabled` | `boolean` | `undefined` | Whether option is disabled |
| `data-group` | `string` | `undefined` | Group name for organized options |

## Events

| Event | When Triggered | Event Data |
| --- | --- | --- |
| `change` | When selection changes | e.target.value or e.target.values |
| `input` | When search input changes | Standard input event |

<script setup lang="ts">
import FormDemo from '../vue/FormDemo.vue';
</script>
