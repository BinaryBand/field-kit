# Quick Start

Get up and running with TW Components in just a few minutes. This guide assumes you've already [installed the components](/guide/installation) in your project.

## Basic Setup

### 1. Include TW Components

Make sure you have both the CSS and JavaScript files included in your HTML:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TW Components Quick Start</title>
    <!-- TW Components CSS -->
    <link rel="stylesheet" href="/dist/tw-client.css" />
  </head>
  <body>
    <!-- Your content goes here -->

    <!-- TW Components JavaScript -->
    <script src="/dist/main.umd.js" defer></script>
  </body>
</html>
```

### 2. Your First Component

Let's start with a simple PIN input component:

```html
<form>
  <label for="pin">Enter PIN:</label>
  <input id="pin" type="pin" data-size="4" name="userPin" />
  <button type="submit">Submit</button>
</form>
```

This creates a 4-digit PIN input that users can fill out using their keyboard or mouse.

## Common Patterns

### Form Integration

TW Components work seamlessly with standard HTML forms:

```html
<form id="userForm">
  <!-- Standard HTML input -->
  <input type="text" name="username" placeholder="Username" required />

  <!-- TW Components -->
  <input type="pin" name="pin" data-size="6" required />
  <textarea class="tw-auto-resize" name="message" placeholder="Message"></textarea>
  <input type="list" name="tags" value='["tag1", "tag2"]' />

  <button type="submit">Submit Form</button>
</form>
```

### JavaScript Integration

Access component values just like regular HTML elements:

```html
<script>
  document.getElementById('userForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(this);

    // Access TW Component values
    const pin = formData.get('pin');
    const message = formData.get('message');
    const tags = JSON.parse(formData.get('tags') || '[]');

    console.log('PIN:', pin);
    console.log('Message:', message);
    console.log('Tags:', tags);
  });
</script>
```

## Most Popular Components

### Auto-Resize Textarea

Perfect for message inputs and comments:

```html
<textarea class="tw-auto-resize" placeholder="Enter your message...">
This textarea automatically adjusts its height as you type more content.
</textarea>
```

### List Input

Great for tags, categories, or any list of values:

```html
<input type="list" value='["React", "JavaScript", "CSS"]' placeholder="Add technology..." />
```

### Select with Search

Enhanced select dropdown with filtering:

```html
<select class="tw-select-group" data-placeholder="Choose an option">
  <option class="tw-option" value="javascript">JavaScript</option>
  <option class="tw-option" value="typescript">TypeScript</option>
  <option class="tw-option" value="react">React</option>
  <option class="tw-option" value="vue">Vue</option>
</select>
```

### Signature Input

For digital signatures and drawing:

```html
<input type="signature" style="width: 400px; height: 200px;" />
```

## Styling Components

### Custom CSS Classes

You can style TW Components with CSS just like regular HTML elements:

```css
/* Style the PIN input */
input[type='pin'] {
  border: 2px solid #007bff;
  border-radius: 8px;
  padding: 10px;
}

/* Style auto-resize textarea */
.tw-auto-resize {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 12px;
  font-family: inherit;
  resize: none; /* Disable manual resize since it's automatic */
}
```

### CSS Custom Properties

TW Components support CSS custom properties for theming:

```css
:root {
  --tw-primary-color: #007bff;
  --tw-border-radius: 6px;
  --tw-border-color: #dee2e6;
  --tw-focus-color: #0056b3;
}
```

## Event Handling

TW Components emit standard HTML events:

```html
<script>
  // Listen for input changes
  document.querySelector('input[type="pin"]').addEventListener('input', function (e) {
    console.log('PIN changed:', e.target.value);
  });

  // Listen for list changes
  document.querySelector('input[type="list"]').addEventListener('change', function (e) {
    const listValues = JSON.parse(e.target.value || '[]');
    console.log('List updated:', listValues);
  });

  // Listen for signature drawing
  document.querySelector('input[type="signature"]').addEventListener('change', function (e) {
    console.log('Signature updated');
    // e.target.value contains base64 image data
  });
</script>
```

## Complete Example

Here's a complete working example:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TW Components Example</title>
    <link rel="stylesheet" href="/dist/tw-client.css" />
    <style>
      body {
        font-family: system-ui, sans-serif;
        max-width: 600px;
        margin: 2rem auto;
        padding: 1rem;
      }
      .form-group {
        margin-bottom: 1rem;
      }
      label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
      }
      input,
      textarea,
      select {
        width: 100%;
        box-sizing: border-box;
      }
    </style>
  </head>
  <body>
    <h1>Contact Form</h1>

    <form id="contactForm">
      <div class="form-group">
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" required />
      </div>

      <div class="form-group">
        <label for="pin">Security PIN:</label>
        <input type="pin" id="pin" name="pin" data-size="4" required />
      </div>

      <div class="form-group">
        <label for="skills">Skills:</label>
        <input type="list" id="skills" name="skills" value='["JavaScript", "CSS"]' />
      </div>

      <div class="form-group">
        <label for="message">Message:</label>
        <textarea
          class="tw-auto-resize"
          id="message"
          name="message"
          placeholder="Enter your message..."
        ></textarea>
      </div>

      <button type="submit">Submit</button>
    </form>

    <script src="/dist/main.umd.js" defer></script>
    <script>
      document.getElementById('contactForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(this);

        console.log('Form submitted with data:');
        for (let [key, value] of formData.entries()) {
          console.log(`${key}: ${value}`);
        }
      });
    </script>
  </body>
</html>
```

## What's Next?

- Explore all available [Components](/components/) and their options
- Learn about [Form Integration](/guide/form-integration) patterns
- Check out more [Examples](/examples/) for specific use cases
- Learn about [Styling](/guide/styling) components to match your design
