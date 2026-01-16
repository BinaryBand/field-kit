---
title: Components
description: Browse all TW Components
---

# Components

<ComponentsCatalog />

## Getting Started

### 1. Choose Your Components

Browse the component documentation to find the right components for your project. Each component page includes:

- **Inline Demo**: Interactive examples you can test
- **API Reference**: All available attributes and options
- **Code Examples**: Copy-paste ready HTML code
- **Styling Guide**: CSS customization options

### 2. Basic Usage Pattern

```html
<!-- Include TW Components assets -->
<link rel="stylesheet" href="/dist/tw-client.css" />
<script src="/dist/main.umd.js" defer></script>

<!-- Use components in your HTML -->
<form>
  <input type="pin" data-size="6" name="securityCode" />
  <textarea class="tw-auto-resize" name="message"></textarea>
  <button type="submit">Submit</button>
</form>
```

### 3. Form Integration

Components integrate naturally with HTML forms:

```javascript
document.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);

  // Access component values like regular inputs
  console.log(formData.get('securityCode'));
  console.log(formData.get('message'));
});
```

## Customization

### CSS Custom Properties

Components support extensive theming through CSS custom properties:

```css
:root {
  --tw-primary-color: #007bff;
  --tw-secondary-color: #6c757d;
  --tw-border-radius: 4px;
  --tw-border-width: 1px;
  --tw-border-color: #dee2e6;
  --tw-focus-color: #0056b3;
  --tw-focus-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}
```

### Component-Specific Styling

Each component can be styled with standard CSS:

```css
/* Style PIN inputs */
input[type='pin'] {
  font-size: 18px;
  letter-spacing: 0.5rem;
  text-align: center;
}

/* Style auto-resize textareas */
.tw-auto-resize {
  border: 2px solid var(--tw-border-color);
  border-radius: var(--tw-border-radius);
  transition: border-color 0.2s ease;
}

.tw-auto-resize:focus {
  border-color: var(--tw-focus-color);
  box-shadow: var(--tw-focus-shadow);
}
```

## Next Steps

1. **Explore Components**: Browse individual component documentation for detailed usage instructions
2. **Get Help**: Visit the [GitHub repository](https://github.com/BinaryBand/bulwark-client-app) for support
