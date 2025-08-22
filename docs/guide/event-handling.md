---
title: Event Handling
description: Learn how to handle events from TW Components and integrate with your application logic
---

# Event Handling

TW Components emit standard HTML events and custom events to provide rich interaction capabilities. This guide covers how to listen for and handle these events effectively in your applications.

## Standard HTML Events

All TW Components support standard HTML events that you're familiar with from native elements.

### Common Events

#### Input Events

Handle user input and value changes:

```javascript
// Listen for input changes (real-time)
document.querySelector('input[type="pin"]').addEventListener('input', function (e) {
  console.log('PIN input changed:', e.target.value);
  console.log('Current length:', e.target.value.length);

  // Enable/disable submit button based on completeness
  const submitBtn = document.querySelector('#submitBtn');
  submitBtn.disabled = e.target.value.length < 4;
});

// Listen for change events (after blur or completion)
document.querySelector('input[type="list"]').addEventListener('change', function (e) {
  const items = JSON.parse(e.target.value || '[]');
  console.log('List updated:', items);
  console.log('Item count:', items.length);
});
```

#### Focus Events

Track when components gain or lose focus:

```javascript
document.querySelector('.tw-auto-resize').addEventListener('focus', function (e) {
  console.log('Textarea focused');
  // Show additional help text or expand interface
  showHelpText(e.target);
});

document.querySelector('.tw-auto-resize').addEventListener('blur', function (e) {
  console.log('Textarea blurred');
  // Hide help text or validate content
  hideHelpText(e.target);
  validateContent(e.target);
});
```

#### Keyboard Events

Handle keyboard interactions for enhanced UX:

```javascript
document.querySelector('input[type="pin"]').addEventListener('keydown', function (e) {
  console.log('Key pressed:', e.key);

  // Handle escape key to clear
  if (e.key === 'Escape') {
    e.target.value = '';
    e.target.dispatchEvent(new Event('input'));
  }

  // Handle enter key for form submission
  if (e.key === 'Enter' && e.target.value.length === 4) {
    document.querySelector('form').requestSubmit();
  }
});

// Filter component keyboard shortcuts
document.querySelector('input[type="filter"]').addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    // Clear filter
    e.target.value = '';
    e.target.dispatchEvent(new Event('input'));
  }
});
```

## Component-Specific Events

### PIN Input Events

```javascript
const pinInput = document.querySelector('input[type="pin"]');

pinInput.addEventListener('input', function (e) {
  const value = e.target.value;
  const size = parseInt(e.target.getAttribute('data-size'));

  console.log(`PIN progress: ${value.length}/${size}`);

  if (value.length === size) {
    console.log('PIN complete:', value);
    // Automatically move to next field or validate
    validatePIN(value);
  }
});

// Listen for PIN completion
pinInput.addEventListener('change', function (e) {
  if (e.target.value.length === parseInt(e.target.getAttribute('data-size'))) {
    console.log('PIN entered successfully');
    // Trigger next step in form flow
    proceedToNextStep();
  }
});
```

### List Input Events

```javascript
const listInput = document.querySelector('input[type="list"]');

listInput.addEventListener('input', function (e) {
  const items = JSON.parse(e.target.value || '[]');
  console.log('List items updated:', items);

  // Update UI based on item count
  updateItemCounter(items.length);
});

listInput.addEventListener('change', function (e) {
  const items = JSON.parse(e.target.value || '[]');
  console.log('Final list state:', items);

  // Validate items
  const validItems = items.filter((item) => item.trim() !== '');
  if (validItems.length !== items.length) {
    // Update with cleaned items
    e.target.value = JSON.stringify(validItems);
  }
});

// Listen for individual item actions
listInput.addEventListener('tw:item:added', function (e) {
  console.log('Item added:', e.detail.item);
  console.log('New total:', e.detail.items.length);
});

listInput.addEventListener('tw:item:removed', function (e) {
  console.log('Item removed:', e.detail.item);
  console.log('Remaining items:', e.detail.items);
});
```

### Auto-Resize Textarea Events

```javascript
const autoResizeTextarea = document.querySelector('.tw-auto-resize');

autoResizeTextarea.addEventListener('input', function (e) {
  console.log('Content length:', e.target.value.length);
  console.log('Current height:', e.target.scrollHeight + 'px');

  // Show character count
  updateCharacterCount(e.target.value.length);
});

// Listen for resize events
autoResizeTextarea.addEventListener('tw:resized', function (e) {
  console.log('Textarea resized to:', e.detail.height + 'px');
  console.log('Previous height:', e.detail.previousHeight + 'px');

  // Adjust page layout if needed
  adjustLayoutForTextarea(e.detail.height);
});
```

### Select Input Events

```javascript
const selectInput = document.querySelector('.tw-select-group');

selectInput.addEventListener('change', function (e) {
  const selectedOptions = Array.from(e.target.selectedOptions);
  const values = selectedOptions.map((option) => option.value);
  const texts = selectedOptions.map((option) => option.textContent);

  console.log('Selected values:', values);
  console.log('Selected texts:', texts);

  // Update dependent fields
  updateDependentFields(values);
});

// Listen for search events
selectInput.addEventListener('tw:search', function (e) {
  console.log('User searched for:', e.detail.query);

  // Implement custom search logic if needed
  if (e.detail.query.length > 2) {
    performCustomSearch(e.detail.query);
  }
});
```

### Signature Input Events

```javascript
const signatureInput = document.querySelector('input[type="signature"]');

signatureInput.addEventListener('change', function (e) {
  if (e.target.value) {
    console.log('Signature captured');
    // Show signature preview
    displaySignaturePreview(e.target.value);
  } else {
    console.log('Signature cleared');
    // Hide preview
    hideSignaturePreview();
  }
});

// Listen for drawing events
signatureInput.addEventListener('tw:drawing:start', function (e) {
  console.log('User started drawing');
  // Show drawing indicators
  showDrawingFeedback();
});

signatureInput.addEventListener('tw:drawing:end', function (e) {
  console.log('User finished drawing');
  // Hide drawing indicators
  hideDrawingFeedback();
});
```

### Filter Events

```javascript
const filterGroup = document.querySelector('.tw-filter-group');
const filterInput = filterGroup.querySelector('input[type="filter"]');

filterInput.addEventListener('input', function (e) {
  console.log('Filter query:', e.target.value);

  // Show/hide clear button
  toggleClearButton(e.target.value.length > 0);
});

// Listen for filter results
filterGroup.addEventListener('tw:filter:applied', function (e) {
  console.log('Filter applied:', e.detail.query);
  console.log('Visible items:', e.detail.visibleCount);
  console.log('Total items:', e.detail.totalCount);

  // Update result summary
  updateResultSummary(e.detail.visibleCount, e.detail.totalCount);
});

filterGroup.addEventListener('tw:filter:cleared', function (e) {
  console.log('Filter cleared');
  console.log('All items visible:', e.detail.totalCount);

  // Reset UI state
  resetFilterUI();
});
```

## Custom Event Patterns

### Event Delegation

Use event delegation for dynamically added components:

```javascript
// Listen for events on a parent container
document.addEventListener('input', function (e) {
  // Handle PIN inputs
  if (e.target.type === 'pin') {
    console.log('PIN input detected:', e.target.value);
    handlePINInput(e.target, e.target.value);
  }

  // Handle list inputs
  if (e.target.type === 'list') {
    console.log('List input detected');
    handleListInput(e.target, JSON.parse(e.target.value || '[]'));
  }

  // Handle filter inputs
  if (e.target.type === 'filter') {
    console.log('Filter input detected:', e.target.value);
    handleFilterInput(e.target, e.target.value);
  }
});

// Listen for change events
document.addEventListener('change', function (e) {
  if (e.target.matches('.tw-auto-resize')) {
    console.log('Auto-resize textarea changed');
    handleTextareaChange(e.target);
  }

  if (e.target.matches('input[type="signature"]')) {
    console.log('Signature changed');
    handleSignatureChange(e.target);
  }
});
```

### Debounced Event Handling

Prevent excessive event firing with debouncing:

```javascript
function debounce(func, wait, immediate) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
}

// Debounced input handler
const debouncedInputHandler = debounce(function (e) {
  console.log('Debounced input:', e.target.value);
  // Perform expensive operations like API calls
  searchAPI(e.target.value);
}, 300);

// Apply to filter inputs
document.addEventListener('input', function (e) {
  if (e.target.type === 'filter') {
    debouncedInputHandler(e);
  }
});
```

### Event Composition

Combine multiple events for complex interactions:

```javascript
class FormEventHandler {
  constructor(form) {
    this.form = form;
    this.state = {
      isValid: false,
      hasChanges: false,
      components: new Map(),
    };

    this.attachListeners();
  }

  attachListeners() {
    // Track all component changes
    this.form.addEventListener('input', (e) => {
      this.handleInput(e);
    });

    this.form.addEventListener('change', (e) => {
      this.handleChange(e);
    });

    // Custom component events
    this.form.addEventListener('tw:component:ready', (e) => {
      this.registerComponent(e.detail.component);
    });
  }

  handleInput(e) {
    const component = this.getComponentInfo(e.target);

    // Update component state
    this.state.components.set(e.target.name, {
      ...component,
      value: e.target.value,
      lastModified: Date.now(),
    });

    // Mark form as having changes
    this.state.hasChanges = true;

    // Validate form
    this.validateForm();

    // Emit form state change
    this.form.dispatchEvent(
      new CustomEvent('form:state:changed', {
        detail: this.state,
      })
    );
  }

  handleChange(e) {
    console.log(`Component ${e.target.name} changed:`, e.target.value);

    // Perform final validation for this component
    this.validateComponent(e.target);

    // Check if all required fields are complete
    this.checkFormCompletion();
  }

  getComponentInfo(element) {
    return {
      type: element.type,
      name: element.name,
      required: element.required,
      value: element.value,
    };
  }

  validateForm() {
    // Implement comprehensive form validation
    const isValid = this.form.checkValidity();
    this.state.isValid = isValid;

    // Update UI state
    this.updateFormUI(isValid);
  }

  validateComponent(element) {
    // Component-specific validation
    switch (element.type) {
      case 'pin':
        return this.validatePIN(element);
      case 'list':
        return this.validateList(element);
      case 'signature':
        return this.validateSignature(element);
      default:
        return element.checkValidity();
    }
  }

  validatePIN(element) {
    const value = element.value;
    const size = parseInt(element.getAttribute('data-size'));

    if (value.length !== size) {
      element.setCustomValidity(`PIN must be exactly ${size} digits`);
      return false;
    }

    element.setCustomValidity('');
    return true;
  }

  validateList(element) {
    try {
      const items = JSON.parse(element.value || '[]');

      if (element.required && items.length === 0) {
        element.setCustomValidity('At least one item is required');
        return false;
      }

      element.setCustomValidity('');
      return true;
    } catch (e) {
      element.setCustomValidity('Invalid list format');
      return false;
    }
  }

  validateSignature(element) {
    if (element.required && !element.value) {
      element.setCustomValidity('Signature is required');
      return false;
    }

    element.setCustomValidity('');
    return true;
  }

  updateFormUI(isValid) {
    const submitButton = this.form.querySelector('[type="submit"]');
    if (submitButton) {
      submitButton.disabled = !isValid;
    }

    // Update form classes for styling
    this.form.classList.toggle('form-valid', isValid);
    this.form.classList.toggle('form-invalid', !isValid);
  }

  checkFormCompletion() {
    const allRequired = this.form.querySelectorAll('[required]');
    const completed = Array.from(allRequired).every((field) => {
      return this.validateComponent(field);
    });

    if (completed) {
      this.form.dispatchEvent(
        new CustomEvent('form:completed', {
          detail: { formData: new FormData(this.form) },
        })
      );
    }
  }
}

// Usage
const formHandler = new FormEventHandler(document.querySelector('#myForm'));

document.querySelector('#myForm').addEventListener('form:state:changed', function (e) {
  console.log('Form state updated:', e.detail);
});

document.querySelector('#myForm').addEventListener('form:completed', function (e) {
  console.log('Form completed successfully:', e.detail.formData);
  // Auto-submit or show completion message
});
```

## Performance Considerations

### Event Throttling

Limit event frequency for performance-intensive operations:

```javascript
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Throttled scroll handler for signature canvas
const throttledScrollHandler = throttle(function (e) {
  console.log('Signature canvas scrolled');
  // Expensive scroll operations
}, 16); // ~60fps

document
  .querySelector('input[type="signature"]')
  .addEventListener('scroll', throttledScrollHandler);
```

### Memory Management

Clean up event listeners to prevent memory leaks:

```javascript
class ComponentManager {
  constructor() {
    this.components = new Map();
    this.eventListeners = new Map();
  }

  addComponent(element) {
    const listeners = [];

    // Add input listener
    const inputHandler = (e) => this.handleInput(e);
    element.addEventListener('input', inputHandler);
    listeners.push(['input', inputHandler]);

    // Add change listener
    const changeHandler = (e) => this.handleChange(e);
    element.addEventListener('change', changeHandler);
    listeners.push(['change', changeHandler]);

    // Store listeners for cleanup
    this.eventListeners.set(element, listeners);
    this.components.set(element, { element, listeners });
  }

  removeComponent(element) {
    const listeners = this.eventListeners.get(element);

    if (listeners) {
      // Remove all event listeners
      listeners.forEach(([event, handler]) => {
        element.removeEventListener(event, handler);
      });

      // Clean up maps
      this.eventListeners.delete(element);
      this.components.delete(element);
    }
  }

  destroy() {
    // Clean up all components
    for (const element of this.components.keys()) {
      this.removeComponent(element);
    }
  }

  handleInput(e) {
    console.log('Input handled:', e.target.value);
  }

  handleChange(e) {
    console.log('Change handled:', e.target.value);
  }
}

// Usage
const manager = new ComponentManager();

// Add components as they're created
document.querySelectorAll('input[type="pin"], input[type="list"]').forEach((element) => {
  manager.addComponent(element);
});

// Clean up when page unloads
window.addEventListener('beforeunload', () => {
  manager.destroy();
});
```

## Event Testing

### Unit Testing Events

Test event handling with Jest or similar frameworks:

```javascript
// __tests__/pin-input.test.js
describe('PIN Input Events', () => {
  let pinInput;

  beforeEach(() => {
    document.body.innerHTML = '<input type="pin" data-size="4" />';
    pinInput = document.querySelector('input[type="pin"]');
  });

  test('should emit input event when value changes', () => {
    const mockHandler = jest.fn();
    pinInput.addEventListener('input', mockHandler);

    // Simulate user input
    pinInput.value = '123';
    pinInput.dispatchEvent(new Event('input'));

    expect(mockHandler).toHaveBeenCalled();
    expect(mockHandler.mock.calls[0][0].target.value).toBe('123');
  });

  test('should emit change event when PIN is complete', () => {
    const mockHandler = jest.fn();
    pinInput.addEventListener('change', mockHandler);

    // Complete PIN entry
    pinInput.value = '1234';
    pinInput.dispatchEvent(new Event('change'));

    expect(mockHandler).toHaveBeenCalled();
  });
});
```

### Integration Testing

Test component interactions:

```javascript
describe('Form Event Integration', () => {
  let form, pinInput, listInput, submitButton;

  beforeEach(() => {
    document.body.innerHTML = `
      <form id="testForm">
        <input type="pin" name="pin" data-size="4" required />
        <input type="list" name="skills" required />
        <button type="submit">Submit</button>
      </form>
    `;

    form = document.querySelector('#testForm');
    pinInput = document.querySelector('input[name="pin"]');
    listInput = document.querySelector('input[name="skills"]');
    submitButton = document.querySelector('button[type="submit"]');
  });

  test('should enable submit button when all fields are valid', () => {
    // Initially disabled
    expect(submitButton.disabled).toBe(true);

    // Fill PIN
    pinInput.value = '1234';
    pinInput.dispatchEvent(new Event('input'));

    // Fill skills
    listInput.value = '["JavaScript", "CSS"]';
    listInput.dispatchEvent(new Event('change'));

    // Form should now be valid
    expect(form.checkValidity()).toBe(true);
  });
});
```

## Troubleshooting

### Common Event Issues

**Events not firing:**

- Check that elements have the correct classes or types
- Verify event listeners are attached after DOM is ready
- Ensure elements haven't been replaced or removed

**Memory leaks:**

- Remove event listeners when components are destroyed
- Use weak references for large data structures
- Avoid creating closures that capture large objects

**Performance issues:**

- Debounce or throttle high-frequency events
- Use event delegation instead of multiple listeners
- Consider using passive event listeners for scroll events

**Event timing issues:**

- Use `addEventListener` with capture phase if needed
- Consider using `setTimeout` to defer processing
- Check event propagation and bubbling behavior

### Debugging Events

```javascript
// Event debugging helper
function debugEvents(element, events = ['input', 'change', 'focus', 'blur']) {
  events.forEach((eventType) => {
    element.addEventListener(eventType, function (e) {
      console.group(`Event: ${eventType}`);
      console.log('Target:', e.target);
      console.log('Value:', e.target.value);
      console.log('Event object:', e);
      console.groupEnd();
    });
  });
}

// Debug all TW Components
document
  .querySelectorAll('input[type="pin"], input[type="list"], .tw-auto-resize')
  .forEach((element) => {
    debugEvents(element);
  });
```

This comprehensive event handling system allows you to build rich, interactive applications with TW Components while maintaining good performance and user experience.
