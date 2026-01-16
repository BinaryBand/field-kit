---
title: { { name } }
description: { { description } }
---


<!-- AUTO-GENERATED: docs/.vitepress/data/components.json -->

# Passkey Input

Secure WebAuthn passkey registration and verification component

> **Note:** The passkey value will NOT appear at `event.formData[name]` during a submit event. Instead, the public key will be broadcasted in `event.currentTarget.value` during `change` events.


## Demo

<FormDemo>
<input class="btn" data-identifier="j@ne.com" data-user="Jane" id="passkey-input" name="Passkey" type="passkey" />
</FormDemo>

## Basic Usage

```html
<input type="passkey" data-identifier="user@example.com" data-user="John Doe" name="Passkey" />
```

## Properties

### CSS Classes

_None_

### HTML Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `string` | `"passkey"` | Must be set to "passkey" to activate component |
| `name` | `string` | `undefined` | Form field name |
| `data-identifier` | `string` | `**required**` | Unique user identifier (email, username, etc.) |
| `data-user` | `string` | `undefined` | Display name for the user |
| `disabled` | `boolean` | `false` | Whether field is disabled |

### Option Attributes

_None_

## Events

| Event | When Triggered | Event Data |
| --- | --- | --- |
| `change` | When passkey is registered or removed | e.currentTarget.value contains public key |
| `click` | When button is clicked | Standard click event |

<script setup lang="ts">
import FormDemo from '../vue/FormDemo.vue';
</script>
