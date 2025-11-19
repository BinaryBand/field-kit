---
title: Passkey Input
description: Secure WebAuthn passkey registration and verification component
---

# Passkey Input

Secure WebAuthn passkey registration and verification component

**Important**: The passkey value will NOT appear at `event.formData[name]` during a submit event. Instead, the public key will be broadcasted in `event.currentTarget.value` during `change` events.

## Demo

<FormDemo>
<input class="btn" data-identifier="j@ne.com" data-user="Jane" id="passkey-input" name="Passkey" type="passkey" />
</FormDemo>

## Basic Usage

```html
<input type="passkey" data-identifier="user@example.com" data-user="John Doe" name="Passkey" />
```

## Properties

### HTML Attributes

| Attribute | Type | Default | Description |
| --------- | --------- | --------- | --------- |
| `type` | `string` | `"passkey"` | Must be set to "passkey" to activate component |
| `name` | `string` | `undefined` | Form field name |
| `data-identifier` | `string` | `**required**` | Unique user identifier (email, username, etc.) |
| `data-user` | `string` | `undefined` | Display name for the user |
| `disabled` | `boolean` | `false` | Whether field is disabled |

## Examples

(Examples section - see original documentation)

## Behavior

### Registration Flow

1. User clicks the passkey input button
2. Browser prompts for biometric/security key authentication
3. Passkey is created and stored securely by the browser
4. Public key is emitted via `change` event
5. Button text changes to indicate registered state

### Verification Flow

1. User clicks registered passkey button
2. Browser prompts for authentication
3. User verifies with biometric/security key
4. Passkey is validated against stored credential

### Removal Flow

1. Click registered passkey button
2. Verify with biometric/security key
3. Passkey is removed from storage
4. Empty `change` event is emitted

## Events

### Standard HTML Events

| Event | When Triggered | Event Data |
| --------- | --------- | --------- |
| `change` | When passkey is registered or removed | e.currentTarget.value contains public key |
| `click` | When button is clicked | Standard click event |

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

- **Private key never exposed**: Private keys remain in secure hardware
- **Phishing resistant**: Passkeys are bound to specific domains
- **Device-bound**: Credentials stored securely on user's device
- **Biometric optional**: Can use PIN or other authentication methods
- **No password transmission**: More secure than traditional passwords

<script setup lang='ts'>
  import FormDemo from './../../vue/FormDemo.vue';
</script>