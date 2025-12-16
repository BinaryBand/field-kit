---
title: Ripple Effect
description: Material-UI powered ripple effect component for adding interactive visual feedback
---

# Ripple Effect

Material-UI powered ripple effect component for adding interactive visual feedback to any clickable element.

## Demo

<RippleDemo />

<script setup lang="ts">
import RippleDemo from './../../vue/RippleDemo.vue';
</script>

## Basic Usage

### HTML (Class-based)

```html
<!-- Basic ripple effect -->
<button class="tw-ripple">Click Me</button>

<!-- Center ripple for circular buttons -->
<div class="tw-ripple" data-center-ripple>
  <svg>...</svg>
</div>

<!-- Focus ripple for accessibility -->
<button class="tw-ripple" data-focus-ripple>
  Keyboard Accessible
</button>
```

### React (Direct Component)

```tsx
import { Ripple } from 'tw-client';

<Ripple>
  <button>Click Me</button>
</Ripple>

// With options
<Ripple centerRipple focusRipple component="div">
  Icon Button
</Ripple>
```

## Properties

### CSS Classes

| Class | Description |
| ----- | ----------- |
| `tw-ripple` | Activates ripple effect on the element |

### HTML Attributes

| Attribute | Type | Default | Description |
| --------- | ---- | ------- | ----------- |
| `data-center-ripple` | `boolean` | `false` | Ripple originates from center instead of click position |
| `data-focus-ripple` | `boolean` | `false` | Ripple activates on keyboard focus |

### React Component Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `component` | `React.ElementType` | `'div'` | HTML element or React component to render |
| `centerRipple` | `boolean` | `false` | Ripple originates from center |
| `focusRipple` | `boolean` | `false` | Ripple activates on keyboard focus |
| `disableRipple` | `boolean` | `false` | Disable ripple effect entirely |
| `disabled` | `boolean` | `false` | Disable interactions and ripple |
| `children` | `ReactNode` | - | Content to wrap with ripple |
| `className` | `string` | - | CSS class names |
| `style` | `CSSProperties` | - | Inline styles |

## Examples

### Button with Ripple

```html
<button class="tw-ripple" style="padding: 1rem 2rem; background: #007bff; color: white; border: none; border-radius: 4px;">
  Submit Form
</button>
```

### Icon Button with Center Ripple

```html
<div class="tw-ripple" data-center-ripple style="padding: 0.5rem; border-radius: 50%; cursor: pointer;">
  <svg width="24" height="24">
    <path d="M19 13H5v-2h14v2z"/>
  </svg>
</div>
```

### Card with Ripple

```html
<div class="tw-ripple" style="padding: 2rem; border: 1px solid #ddd; border-radius: 8px; cursor: pointer;">
  <h3>Clickable Card</h3>
  <p>Click anywhere on this card to see the ripple effect</p>
</div>
```

### List Items with Ripple

```html
<ul style="list-style: none; padding: 0;">
  <li class="tw-ripple" style="padding: 1rem; border-bottom: 1px solid #eee; cursor: pointer;">
    List Item 1
  </li>
  <li class="tw-ripple" style="padding: 1rem; border-bottom: 1px solid #eee; cursor: pointer;">
    List Item 2
  </li>
  <li class="tw-ripple" style="padding: 1rem; border-bottom: 1px solid #eee; cursor: pointer;">
    List Item 3
  </li>
</ul>
```

### React Examples

```tsx
import { Ripple } from 'tw-client';

// Button
<Ripple component="button" onClick={handleSubmit}>
  Submit
</Ripple>

// Custom styled element
<Ripple 
  component="div"
  style={{
    padding: '1rem 2rem',
    background: '#28a745',
    color: 'white',
    borderRadius: '8px'
  }}
>
  Click Me
</Ripple>

// With TW Components
import { SelectOption } from 'tw-client';

<Ripple component="div" className="option-item">
  <SelectOption value="option1">Option 1</SelectOption>
</Ripple>
```

## Behavior

### Touch Response

- Ripple effect responds to both mouse clicks and touch events
- Optimized for mobile devices with proper touch handling
- Ripple origin matches the exact click/touch position (unless `centerRipple` is enabled)

### Animation

- Smooth expansion from click point
- Fades out gracefully
- Multiple ripples can overlay for rapid clicks
- Performance optimized to handle many instances

### Focus Behavior

When `focusRipple` is enabled:
- Ripple activates when element receives keyboard focus
- Provides visual feedback for keyboard navigation
- Improves accessibility for keyboard-only users

### Center Ripple

When `centerRipple` is enabled:
- Ripple always originates from the center of the element
- Ideal for circular buttons, icons, or symmetric elements
- Creates a more uniform visual effect

## Events

The Ripple component preserves all standard HTML events:

| Event | Description |
| ----- | ----------- |
| `click` | Triggered when element is clicked |
| `focus` | Triggered when element receives focus |
| `blur` | Triggered when element loses focus |
| `mousedown` | Triggered when mouse button is pressed |
| `mouseup` | Triggered when mouse button is released |
| `touchstart` | Triggered when touch begins |
| `touchend` | Triggered when touch ends |

### Example Event Handling

```html
<button class="tw-ripple" onclick="console.log('Clicked!')">
  Click Me
</button>
```

```tsx
// React
<Ripple component="button" onClick={() => console.log('Clicked!')}>
  Click Me
</Ripple>
```

## Styling

### Basic Styling

The ripple adapts to your element's styling:

```html
<button class="tw-ripple" style="
  padding: 1rem 2rem;
  background: linear-gradient(45deg, #fe6b8b 30%, #ff8e53 90%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
">
  Gradient Button
</button>
```

### CSS Classes

```css
.my-ripple-button {
  padding: 0.75rem 1.5rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.my-ripple-button:hover {
  background: #0056b3;
}
```

```html
<button class="tw-ripple my-ripple-button">
  Styled Button
</button>
```

### Customizing Ripple Color

Using MUI theming (React only):

```tsx
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Ripple } from 'tw-client';

const theme = createTheme({
  components: {
    MuiButtonBase: {
      defaultProps: {
        TouchRippleProps: {
          style: {
            color: 'rgba(255, 0, 0, 0.5)',
          },
        },
      },
    },
  },
});

<ThemeProvider theme={theme}>
  <Ripple>Custom ripple color</Ripple>
</ThemeProvider>
```

## Accessibility

The Ripple component maintains accessibility:

- **Keyboard Support**: Works with Tab navigation and Enter/Space activation
- **Focus Ripple**: Use `data-focus-ripple` for keyboard focus feedback
- **Screen Readers**: Preserves semantic HTML and ARIA attributes
- **Touch Targets**: Maintains proper touch target sizes
- **No Functionality Loss**: Ripple is purely visual enhancement

### Accessible Button Example

```html
<button 
  class="tw-ripple" 
  data-focus-ripple
  aria-label="Submit form"
  style="padding: 1rem 2rem; cursor: pointer;"
>
  Submit
</button>
```

## Best Practices

### When to Use

✅ **Good Use Cases:**
- Buttons and clickable elements
- List items in selectable lists
- Cards that trigger actions
- Icon buttons and toolbar items
- Menu items

❌ **Avoid Using:**
- Non-interactive elements (unless made interactive)
- Links for navigation (consider subtle alternatives)
- Extremely small elements (< 24px)
- Already animated elements (can conflict)

### Performance

- Ripple is optimized and can handle hundreds of instances
- No performance impact on page load
- Minimal memory footprint
- GPU-accelerated animations

### Combining with Other Effects

```html
<!-- Ripple + Hover effect -->
<button 
  class="tw-ripple" 
  style="
    padding: 1rem 2rem;
    background: #007bff;
    color: white;
    transition: transform 0.1s;
  "
  onmouseover="this.style.transform='scale(1.05)'"
  onmouseout="this.style.transform='scale(1)'"
>
  Hover + Ripple
</button>
```

## Browser Support

Ripple component uses Material-UI which supports:
- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- iOS Safari (last 2 versions)
- Android Chrome (last 2 versions)

## TypeScript Support

Full TypeScript support when using React:

```tsx
import { Ripple } from 'tw-client';
import { ComponentProps } from 'react';

type RippleButtonProps = ComponentProps<typeof Ripple> & {
  variant?: 'primary' | 'secondary';
};

function RippleButton({ variant = 'primary', children, ...props }: RippleButtonProps) {
  return (
    <Ripple 
      component="button" 
      className={`btn-${variant}`}
      {...props}
    >
      {children}
    </Ripple>
  );
}
```

## Related Components

- [Select Input](/components/inputs/select) - Dropdown with ripple on options
- [List Input](/components/inputs/list) - List management with interactive tokens
- [Filter](/components/views/filter) - Filterable lists with ripple effects
