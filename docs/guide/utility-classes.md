---
title: Utility Classes
layout: doc
---

# Utility Classes

TW Components includes a collection of utility classes and components for common UI interactions and effects.

## Ripple Effects

Material-UI powered ripple effects that provide visual feedback on user interactions.

### Ripple Component

The `Ripple` component wraps any element with Material-UI's sophisticated ripple effect.

```tsx
import Ripple from '@/views/shared/Ripple';

<Ripple>
  <button>Click Me</button>
</Ripple>
```

**Features:**
- Professional Material Design ripple animation
- Touch-responsive with proper mobile support
- Automatic color adaptation based on background
- Accessibility-friendly with keyboard support
- Performance optimized for multiple instances

### Basic Usage

Wrap any clickable element:

```tsx
// Button with ripple
<Ripple component="button" className="my-button">
  Submit Form
</Ripple>

// Div with ripple
<Ripple component="div" className="card">
  <h3>Clickable Card</h3>
  <p>Click anywhere on this card</p>
</Ripple>

// Icon button with ripple
<Ripple className="_tw-icon-button">
  <XIcon />
</Ripple>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `component` | `React.ElementType` | `'div'` | HTML element or React component to render |
| `centerRipple` | `boolean` | `false` | If true, ripple always originates from center |
| `focusRipple` | `boolean` | `false` | If true, ripple activates on keyboard focus |
| `disableRipple` | `boolean` | `false` | Disable ripple effect entirely |
| `disabled` | `boolean` | `false` | Disable interactions and ripple |

### Advanced Examples

#### Center Ripple

For circular buttons or icons, center the ripple:

```tsx
<Ripple centerRipple component="button" className="icon-btn">
  <MenuIcon />
</Ripple>
```

#### Focus Ripple

Add ripple on keyboard focus for better accessibility:

```tsx
<Ripple focusRipple component="button">
  Keyboard Accessible Button
</Ripple>
```

#### Custom Styling

The ripple adapts to your styling:

```tsx
<Ripple 
  component="div"
  style={{
    padding: '1rem 2rem',
    background: '#007bff',
    color: 'white',
    borderRadius: '8px',
    cursor: 'pointer'
  }}
>
  Custom Styled Element
</Ripple>
```

## Usage Guidelines

### Combining with TW Components

Ripple works seamlessly with all TW Components:

```tsx
// With Select Input options
<Ripple component="div" className="option-item">
  Option 1
</Ripple>

// With Form buttons
<Ripple component="button" type="submit">
  Submit Form
</Ripple>

// With icon buttons
<Ripple className="_tw-icon-button" centerRipple>
  <XIcon />
</Ripple>
```

### Best Practices

1. **Use centerRipple for icons**: Circular elements look better with centered ripples
2. **Add focusRipple for accessibility**: Keyboard users benefit from visual feedback
3. **Maintain semantic HTML**: Use appropriate `component` prop (button, div, etc.)
4. **Performance**: MUI's ripple is optimized and can handle many instances efficiently
5. **Touch devices**: Ripple automatically adapts for touch interactions

### Integration Patterns

#### Form Elements

```tsx
<form>
  <input type="text" name="username" />
  
  <Ripple component="button" type="submit">
    <CheckIcon />
    Submit
  </Ripple>
</form>
```

#### List Items

```tsx
<ul>
  {items.map(item => (
    <Ripple component="li" key={item.id} onClick={() => handleClick(item)}>
      {item.name}
    </Ripple>
  ))}
</ul>
```

#### Cards

```tsx
<Ripple component="div" className="card" onClick={handleCardClick}>
  <h3>Card Title</h3>
  <p>Click anywhere on this card to interact</p>
</Ripple>
```

## Browser Support

Ripple component uses Material-UI which supports all modern browsers:
- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- iOS Safari (last 2 versions)
- Android Chrome (last 2 versions)

## Customization

Customize ripple appearance using MUI's theming:

```tsx
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiButtonBase: {
      defaultProps: {
        // Customize ripple for all instances
        TouchRippleProps: {
          style: {
            color: 'rgba(0, 123, 255, 0.5)',
          },
        },
      },
    },
  },
});

<ThemeProvider theme={theme}>
  <Ripple>Your content</Ripple>
</ThemeProvider>
```

### Per-Component Styling

Style individual ripple instances:

```tsx
<Ripple 
  sx={{
    '& .MuiTouchRipple-root': {
      color: '#ff0000',
    },
  }}
>
  Custom color ripple
</Ripple>
```

## TypeScript Support

Full TypeScript support with proper typing:

```tsx
import { ComponentProps } from 'react';
import Ripple from '@/views/shared/Ripple';

type MyButtonProps = ComponentProps<typeof Ripple> & {
  variant?: 'primary' | 'secondary';
};

function MyButton({ variant, children, ...props }: MyButtonProps) {
  return (
    <Ripple component="button" className={`btn-${variant}`} {...props}>
      {children}
    </Ripple>
  );
}
```
