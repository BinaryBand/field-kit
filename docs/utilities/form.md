---
title: Form Submit Events
description: Custom form submission events with structured data collection and validation
---

# Form Submit Events

The Form controller enhances standard HTML form submission with automatic data normalization, validation, and custom events.

## Custom Events

### `twinvalid`

Dispatched when form validation fails during submission attempt.

**Event Details:**

- **Type**: `CustomEvent`
- **Bubbles**: `true`
- **Cancelable**: `true`
- **Detail**: `{ invalidFields: HTMLElement[] }`

**Example:**

```js
const formElement = document.querySelector('form.tw-form');

formElement?.addEventListener('twinvalid', (event) => {
  const { invalidFields } = event.detail;
  console.log(`Validation failed: ${invalidFields.length} invalid fields`);

  invalidFields.forEach((field) => {
    field.style.borderColor = 'red';
  });
});
```

### Enhanced `submit` Event

The Form controller automatically enhances the standard `submit` event by adding a `formData` property containing the normalized form data.

**Enhanced Properties:**

- **formData**: Normalized form data built from the DOM, including nested objects/arrays created via `data-tw-group` and `data-tw-array`.

**Type Definition:**

```ts
// High-level shape (see implementation in src/controllers/components/Form.tsx)
type FormPrimitive = string | number | boolean | string[] | number[];
type TWFormData = FormPrimitive | { [key: string]: TWFormData } | TWFormData[];

interface TwSubmitEvent extends SubmitEvent {
  formData?: Record<string, TWFormData>;
}
```

**Example (recommended):** attach an `onsubmit` handler up front so TW Components only augments the event (it will not perform the built-in fetch submit).

```html
<form class="tw-form" action="/api/submit" method="post" onsubmit="handleSubmit(event)">
  <input name="username" type="text" required />
  <input name="age" type="number" required />
  <input name="interests" data-type="list" />
  <input name="subscribe" type="checkbox" />
  <button type="submit">Submit</button>
</form>

<script>
  function handleSubmit(event) {
    event.preventDefault();
    const data = event.formData;
    console.log(data);
  }
</script>
```

**Default behavior:** if the form has no existing `onsubmit` handler, the Form controller intercepts submission and sends JSON to `action` using `fetch()`, then navigates based on the response.

## Data Normalization

The Form controller automatically normalizes input values based on their type:

| Type                            | Normalization                             |
| ------------------------------- | ----------------------------------------- |
| `checkbox`                      | Boolean value of `checked` property       |
| `radio`                         | String value of selected radio button     |
| `number`                        | Parsed integer (defaults to 0 if invalid) |
| `list` (via `data-type="list"`) | Parsed JSON array                         |
| `text` and others               | String value                              |

### Select Elements

Select elements support multiple values and type normalization:

```html
<!-- Single select -->
<select name="country">
  <option value="us">United States</option>
  <option value="ca">Canada</option>
</select>

<!-- Multiple select with number type -->
<select name="ratings" multiple data-type="number">
  <option value="1">1 Star</option>
  <option value="2">2 Stars</option>
  <option value="3">3 Stars</option>
</select>
```

## Grouped Data

Use `data-tw-group` to create nested objects in form data:

```html
<form>
  <div data-tw-group="address">
    <input name="street" type="text" />
    <input name="city" type="text" />
    <input name="zip" type="text" />
  </div>
</form>
```

**Result:**

```json
{
  "address": {
    "street": "123 Main St",
    "city": "Springfield",
    "zip": "12345"
  }
}
```

## Array Data

Use `data-tw-array` to create arrays of objects:

```html
<form>
  <div data-tw-array="items">
    <div>
      <input name="name" value="Item 1" />
      <input name="quantity" type="number" value="2" />
    </div>
    <div>
      <input name="name" value="Item 2" />
      <input name="quantity" type="number" value="5" />
    </div>
  </div>
</form>
```

**Result:**

```json
{
  "items": [
    { "name": "Item 1", "quantity": 2 },
    { "name": "Item 2", "quantity": 5 }
  ]
}
```

## Validation

### Required Fields

The Form controller validates all fields with the `required` attribute before submission:

```html
<input name="email" type="email" required />
<textarea name="message" required></textarea>
<select name="category" required>
  <option value="">Select...</option>
  <option value="bug">Bug</option>
  <option value="feature">Feature</option>
</select>
```

**Validation Rules:**

- **Input (text/email/etc)**: Must have non-empty trimmed value
- **Checkbox**: Must be checked
- **Radio**: At least one option in the group must be selected
- **Textarea**: Must have non-empty trimmed value
- **Select**: Must have a non-empty value
- **Select (multiple)**: Must have at least one option selected

### Invalid Field Markers

When validation fails, invalid fields receive a `data-tw-invalid="true"` attribute for CSS styling:

```css
[data-tw-invalid] {
  border-color: red;
  background-color: #fee;
}
```

The first invalid field automatically receives focus.

## Complete Example

```tsx
import React, { useRef } from 'react';
import { Form } from 'tw-client';

function MyForm() {
  const formRef = useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (!formRef.current) return;

    // Listen for validation errors
    formRef.current.addEventListener('twinvalid', (event) => {
      const { invalidFields } = event.detail;
      alert(`Please fill out ${invalidFields.length} required field(s)`);
    });
  }, []);

  return (
    <Form target={formRef.current}>
      <form
        ref={formRef}
        onSubmit={(e) => {
          // Access normalized data
          const { formData } = e;
          console.log('Submitting:', formData);

          // Optional: prevent default if handling manually
          e.preventDefault();

          // Your custom submission logic
          fetch('/api/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          });
        }}
      >
        <div data-tw-group="user">
          <input name="firstName" type="text" required />
          <input name="lastName" type="text" required />
          <input name="age" type="number" />
        </div>

        <div data-tw-array="preferences">
          <input name="theme" value="dark" type="checkbox" />
          <input name="notifications" value="true" type="checkbox" />
        </div>

        <button type="submit">Submit</button>
      </form>
    </Form>
  );
}
```

## TypeScript Support

```typescript
import type { TwSubmitEvent, IFormData, TWFormData, FormType } from 'tw-client';

// Use enhanced submit event type
function handleSubmit(event: TwSubmitEvent) {
  const data = event.formData;
  // data is typed as Record<string, FormType> | undefined
}

// Type your form data structure
interface UserFormData {
  user: {
    firstName: string;
    lastName: string;
    age: number;
  };
  preferences: Array<{ theme: string; notifications: string }>;
}

function handleTypedSubmit(event: TwSubmitEvent) {
  const data = event.formData as UserFormData;
  console.log(data.user.firstName);
}
```

## Notes

- The `twinvalid` event is fired **before** the `formData` property is populated on the submit event
- Validation prevents form data construction until all required fields are valid
- The Form controller respects existing `onsubmit` handlers and enhances them
- Default form submission behavior is only prevented when validation fails
