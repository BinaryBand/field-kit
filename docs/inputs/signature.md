---
title: { { name } }
description: { { description } }
---


<!-- AUTO-GENERATED: docs/.vitepress/data/components.json -->

# Signature Input

Interactive canvas component for capturing handwritten signatures

> **Note:** The value attribute contains a base64-encoded PNG image of the signature.


## Demo

<FormDemo>
<input type="signature" name="Signature" placeholder="Sign Here" />
</FormDemo>

## Basic Usage

```html
<input type="signature" name="Signature" placeholder="Sign Here" />
```

## Properties

### CSS Classes

_None_

### HTML Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `string` | `"signature"` | Must be set to "signature" to activate |
| `name` | `string` | `undefined` | Form field name |
| `placeholder` | `string` | `undefined` | Text shown when canvas is empty |
| `value` | `string` | `undefined` | Base64-encoded image data |
| `disabled` | `boolean` | `false` | Whether field is disabled |
| `readOnly` | `boolean` | `false` | Whether field is read-only |
| `required` | `boolean` | `false` | Whether field is required |

### Option Attributes

_None_

## Events

| Event | When Triggered | Event Data |
| --- | --- | --- |
| `change` | When drawing is complete | e.target.value contains base64 image |
| `input` | During drawing (frequent) | e.target.value contains base64 image |

<script setup lang="ts">
import FormDemo from '../vue/FormDemo.vue';
</script>
