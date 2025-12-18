# Components Overview

TW Components provides a comprehensive collection of custom HTML components designed to enhance user interface interactions while maintaining native HTML behavior and accessibility standards.

## Component Categories

### Input Components

Enhanced input elements that extend standard HTML form controls with additional functionality:

| Component                                              | Description                                                 | Use Cases                                 |
| ------------------------------------------------------ | ----------------------------------------------------------- | ----------------------------------------- |
| [Auto-Resize Textarea](/components/inputs/auto-resize) | Textarea that automatically adjusts height based on content | Comments, messages, descriptions          |
| [List Input](/components/inputs/list)                  | Manage arrays of string values with an intuitive interface  | Tags, keywords, multi-value fields        |
| [Passkey Input](/components/inputs/passkey)            | WebAuthn passkey authentication component                   | Secure login, passwordless authentication |
| [PIN Input](/components/inputs/pin)                    | Secure PIN entry with customizable digit length             | Security codes, verification              |
| [Select Input](/components/inputs/select)              | Enhanced select dropdown with search and multi-select       | Option selection, filtering               |
| [Signature Input](/components/inputs/signature)        | Canvas-based signature capture                              | Digital signatures, drawings              |

### View Components

Interactive components for displaying and organizing content:

| Component                              | Description                              | Use Cases                                 |
| -------------------------------------- | ---------------------------------------- | ----------------------------------------- |
| [Calendar](/components/views/calendar) | Interactive calendar with date selection | Date pickers, scheduling, event planning  |
| [Filter](/components/views/filter)     | Real-time filtering interface for lists  | Search, data filtering, content discovery |

## Design Principles

### Native HTML Behavior

All TW Components are built to behave like standard HTML elements:

- **Form Integration**: Work seamlessly with HTML forms and `FormData`
- **Event Handling**: Emit standard HTML events (`input`, `change`, `focus`, etc.)
- **Accessibility**: Follow ARIA guidelines and keyboard navigation standards
- **Styling**: Accept standard CSS styling and custom properties

## Getting Started

### 1. Choose Your Components

Browse the component documentation to find the right components for your project. Each component page includes:

- **Live Demo**: Interactive examples you can test
- **API Reference**: All available attributes and options
- **Code Examples**: Copy-paste ready HTML code
- **Styling Guide**: CSS customization options

### 2. Basic Usage Pattern

All TW Components follow a consistent usage pattern:

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
2. **Try the Demo**: Visit the [Live Demo](/demo) page to see all components in action
3. **Get Help**: Visit the [GitHub repository](https://github.com/BinaryBand/bulwark-client-app) for support
