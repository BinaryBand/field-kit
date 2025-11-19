---
title: Live Demo
description: Interactive demo of TW components in action
---

# Live Demo

<InteractiveDemo />

<script setup lang="ts">
import InteractiveDemo from './vue/InteractiveDemo.vue';
</script>

## About This Demo

This interactive demo showcases all TW components working together in a real form. Try interacting with each component to see how they behave.

### Components Shown

- **Single-Select**: Choose one item from a dropdown
- **Multi-Select**: Select multiple items with checkboxes
- **Grouped Select**: Options organized by category
- **List Input**: Add and remove items dynamically
- **PIN Input**: Secure numeric entry
- **Auto-Resize Textarea**: Grows with content

Click "Submit Form" to see the collected form data displayed below the form.

## Running Locally

To see all components in action with full interactivity:

```bash
# Start the development server
npm run dev
```

Then open your browser to the URL shown in the terminal (typically `http://localhost:5173`).

## What's in the Demo

The demo app (`index.html`) showcases:

### Select Components

- **Single-Select**: Choose one item from a dropdown
- **Multi-Select**: Select multiple items with checkboxes
- **Grouped Select**: Organized options by category (Fruits, Vegetables, Proteins)

### Interactive Features

- Live code preview for each component
- Bootstrap 5 styling with dark theme
- Real form submission handling
- Syntax highlighting with Prism.js

## Demo Source Code

The demo is located in the project root:

- **HTML**: `index.html` - Main demo page structure
- **Scripts**: `scripts.js` - Helper utilities and code rendering
- **Components**: `src/index.tsx` - React component initialization

### Key Code Snippets

#### Single Select Example

```html
<select
  class="form-control tw-select-group"
  name="SingleSelect"
  data-placeholder="Choose items from groups..."
>
  <option class="tw-option" value="salt">Salt</option>
  <option class="tw-option" value="pepper" selected>Pepper</option>
  <option class="tw-option" value="olive-oil">Olive Oil</option>
</select>
```

#### Multi-Select Example

```html
<select
  class="form-control tw-select-group"
  multiple
  name="MultiSelect"
  data-placeholder="Choose items from groups..."
>
  <option class="tw-option" value="salt">Salt</option>
  <option class="tw-option" value="pepper" selected>Pepper</option>
  <option class="tw-option" value="olive-oil">Olive Oil</option>
</select>
```

#### Grouped Select Example

```html
<select
  class="form-control tw-select-group"
  multiple
  name="GroupedSelect"
  data-placeholder="Choose items from groups..."
>
  <option class="tw-option" value="apple" data-group="Fruits">Apple</option>
  <option class="tw-option" value="banana" data-group="Fruits">Banana</option>
  <option class="tw-option" value="orange" data-group="Fruits">Orange</option>

  <option class="tw-option" value="carrot" data-group="Vegetables">Carrot</option>
  <option class="tw-option" value="broccoli" data-group="Vegetables">Broccoli</option>
  <option class="tw-option" value="spinach" data-group="Vegetables">Spinach</option>
</select>
```

## Form Handling

The demo includes form submission handling:

```javascript
function handleSubmit(event) {
  event.preventDefault();
  console.log(event.formData);
}
```

All component values are accessible through the standard form data:

```javascript
const form = document.querySelector('.tw-form');
const formData = new FormData(form);

// Get single select value
const singleValue = formData.get('SingleSelect');

// Get multi-select values
const multiValues = formData.getAll('MultiSelect');
```

## Styling

The demo uses:

- **Bootstrap 5.3.3**: For base styling and components
- **Bootstrap Icons**: For UI icons
- **Dark Theme**: `data-bs-theme="dark"` on body
- **Responsive Design**: Mobile-friendly with custom breakpoints

## Development Tips

### Hot Module Replacement

The dev server supports HMR - changes to components will reload automatically.

### Debugging

Open DevTools console to see:

- Form data on submission
- Component initialization logs
- Event handling outputs

### Customization

Edit `index.html` to add more component examples or modify styling. The demo app is separate from the documentation build, so you can experiment freely.
