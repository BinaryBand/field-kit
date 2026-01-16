---
title: TW Components
description: Getting started with TW Components
---

# TW Components

Custom HTML components with native form behavior.

## Getting Started

### 1) Install

```bash
npm install
```

### 2) Build the library

```bash
npm run build
```

### 3) Include the assets

```html
<link rel="stylesheet" href="/dist/tw-client.css" />
<script src="/dist/main.umd.js" defer></script>
```

### 4) Use components in HTML

```html
<form class="tw-form" onsubmit="handleSubmit(event)">
  <input type="pin" data-size="6" name="securityCode" />
  <textarea class="tw-auto-resize" name="message"></textarea>
  <button type="submit">Submit</button>
</form>
```

### 5) Read values on submit

```js
function handleSubmit(event) {
  // TW Components enhances the native submit event with a `formData` property
  // containing normalized values (including nested group/array structures).
  event.preventDefault();

  const data = event.formData;
  console.log(data);
  console.log(data?.securityCode);
  console.log(data?.message);
}
```

## Docs

- Inputs live under `/inputs/*`.
- Views live under `/views/*`.
- Utilities live under `/utilities/*`.
