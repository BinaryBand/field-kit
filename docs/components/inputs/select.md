---
title: Select Input
description: Enhanced select dropdown with search, multi-select, and grouping capabilities
---

# Select Input

Enhanced select dropdown with search, multi-select, and grouping capabilities

## Demo

### Single Select

<FormDemo>
  <select class="tw-select-group form-control" data-placeholder="Single Select" data-type="number" name="SingleSelect">
  <option class="tw-option" value="1">Albuquerque</option>
  <option class="tw-option" value="2">Boston</option>
  <option class="tw-option" value="3">Chicago</option>
</select>
</FormDemo>

### Multiple Select

<FormDemo>
  <select class="tw-select-group form-control" data-placeholder="Multiple Select" multiple name="MultipleSelect">
  <option class="tw-option" value="alb">Albuquerque</option>
  <option class="tw-option" value="bos">Boston</option>
  <option class="tw-option" value="chi">Chicago</option>
</select>
</FormDemo>

### Grouped Select

<FormDemo>
  <select class="tw-select-group form-control" data-placeholder="Multiple Select" multiple name="MultipleSelect">
  <option class="tw-option" value="alb" data-group="West">Albuquerque</option>
  <option class="tw-option" value="bos" data-group="East">Boston</option>
  <option class="tw-option" value="chi" data-group="East">Chicago</option>
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
| --------- | --------- |
| `.tw-select-group` | Required class to activate enhanced select |
| `.tw-option` | Applied to each option element |

### HTML Attributes

| Attribute | Type | Default | Description |
| --------- | --------- | --------- | --------- |
| `name` | `string` | `undefined` | Form field name |
| `data-placeholder` | `string` | `undefined` | Placeholder text shown when no selection |
| `data-type` | `string` | `"string"` | Value type: "string", "number", "boolean" |
| `multiple` | `boolean` | `false` | Enable multi-select mode |
| `disabled` | `boolean` | `false` | Whether field is disabled |
| `required` | `boolean` | `false` | Whether field is required |

### Option Attributes

| Attribute | Type | Default | Description |
| --------- | --------- | --------- | --------- |
| `value` | `string` | `undefined` | Option value |
| `selected` | `boolean` | `undefined` | Whether option is initially selected |
| `disabled` | `boolean` | `undefined` | Whether option is disabled |
| `data-group` | `string` | `undefined` | Group name for organized options |

## Examples

(Examples section - see original documentation)

## Features

### Search Functionality

- Type to filter options in real-time
- Case-insensitive search
- Highlights matching text
- Works with grouped options

### Multi-Select

- Select multiple options
- Visual tags for selected items
- Remove individual selections
- Clear all button

### Option Grouping

- Organize options into logical groups
- Group headers in dropdown
- Improved navigation for large option sets

### Value Types

- String values (default)
- Numeric values with `data-type="number"`
- Boolean values with `data-type="boolean"`

## Events

### Standard HTML Events

| Event | When Triggered | Event Data |
| --------- | --------- | --------- |
| `change` | When selection changes | e.target.value or e.target.values |
| `input` | When search input changes | Standard input event |

### Example Event Handling

(See original documentation for examples)

## Accessibility

This component follows WAI-ARIA best practices:

- Supports standard `aria-label`, `aria-describedby`, and `aria-required` attributes
- Compatible with screen readers
- Full keyboard navigation support
- Proper focus management
- Inherits all standard select accessibility features


<script setup lang='ts'>
  import FormDemo from './../../vue/FormDemo.vue';
</script>