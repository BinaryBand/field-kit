---
title: Signature Input
description: Interactive canvas component for capturing handwritten signatures
---

# Signature Input

Interactive canvas component for capturing handwritten signatures

## Demo

<FormDemo>
<SignatureDemo />
</FormDemo>

## Basic Usage

```html
<input type="signature" name="Signature" placeholder="Sign Here" />
```

## Properties

### HTML Attributes

| Attribute | Type | Default | Description |
| --------- | --------- | --------- | --------- |
| `type` | `string` | `"signature"` | Must be set to "signature" to activate |
| `name` | `string` | `undefined` | Form field name |
| `placeholder` | `string` | `undefined` | Text shown when canvas is empty |
| `value` | `string` | `undefined` | Base64-encoded image data |
| `disabled` | `boolean` | `false` | Whether field is disabled |
| `readOnly` | `boolean` | `false` | Whether field is read-only |
| `required` | `boolean` | `false` | Whether field is required |

## Examples

(Examples section - see original documentation)

## Behavior

### Drawing

- **Mouse**: Click and drag to draw
- **Touch**: Touch and drag with finger or stylus
- **Smooth lines**: Automatic line smoothing for better appearance
- **Real-time preview**: See signature as you draw

### Value Storage

The component stores the signature as a base64-encoded PNG:

```javascript
const signatureInput = document.querySelector('input[type="signature"]');

// After drawing
console.log(signatureInput.value);
// Output: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."

// To display the signature
const img = document.createElement('img');
img.src = signatureInput.value;
document.body.appendChild(img);
```

### Clearing

To programmatically clear the signature:

```javascript
const signatureInput = document.querySelector('input[type="signature"]');
signatureInput.value = '';
signatureInput.dispatchEvent(new Event('change'));
```

## Events

### Standard HTML Events

| Event | When Triggered | Event Data |
| --------- | --------- | --------- |
| `change` | When drawing is complete | e.target.value contains base64 image |
| `input` | During drawing (frequent) | e.target.value contains base64 image |

### Example Event Handling

(See original documentation for examples)

## Accessibility

This component follows WAI-ARIA best practices:

- Supports standard `aria-label`, `aria-describedby`, and `aria-required` attributes
- Compatible with screen readers
- Full keyboard navigation support
- Proper focus management
- Behaves like a native HTML input element


## Server-Side Handling

### Saving Signatures

```javascript
// Frontend
async function saveSignature(base64Image) {
  const response = await fetch('/api/signatures', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ signature: base64Image })
  });
  return response.json();
}

// Backend (Node.js example)
app.post('/api/signatures', (req, res) => {
  const { signature } = req.body;
  
  // Remove data:image/png;base64, prefix
  const base64Data = signature.replace(/^data:image\/png;base64,/, '');
  
  // Convert to buffer
  const buffer = Buffer.from(base64Data, 'base64');
  
  // Save to file
  fs.writeFileSync('signature.png', buffer);
  
  res.json({ success: true });
});
```

### Converting to Image

```javascript
// Convert base64 to Blob
function base64ToBlob(base64, mimeType = 'image/png') {
  const byteString = atob(base64.split(',')[1]);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);
  
  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }
  
  return new Blob([arrayBuffer], { type: mimeType });
}

// Upload as file
const blob = base64ToBlob(signatureInput.value);
const formData = new FormData();
formData.append('signature', blob, 'signature.png');
```

<script setup lang='ts'>
  import FormDemo from './../../vue/FormDemo.vue';
  import SignatureDemo from './../../vue/SignatureDemo.vue'
</script>