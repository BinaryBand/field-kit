---
title: Form Integration
description: Learn how to integrate TW Components with HTML forms and handle form data
---

# Form Integration

TW Components are designed to work seamlessly with standard HTML forms, providing enhanced functionality while maintaining native form behavior. This guide covers best practices for integrating components with forms and handling form data.

## Basic Form Integration

### Standard HTML Forms

TW Components work with standard HTML forms without any special configuration:

```html
<form id="contactForm" action="/submit" method="POST">
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
    <textarea class="tw-auto-resize" id="message" name="message"></textarea>
  </div>

  <button type="submit">Submit Form</button>
</form>
```

### Accessing Form Data

Use the standard `FormData` API to access component values:

```javascript
document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const formData = new FormData(this);

  // Access individual values
  console.log('Name:', formData.get('name'));
  console.log('PIN:', formData.get('pin'));
  console.log('Skills:', JSON.parse(formData.get('skills') || '[]'));
  console.log('Message:', formData.get('message'));

  // Convert to object
  const data = Object.fromEntries(formData);
  console.log('Form data:', data);
});
```

## Component-Specific Integration

### PIN Input

PIN inputs provide secure numeric input with customizable length:

```html
<form>
  <label for="pin">Enter 6-digit PIN:</label>
  <input type="pin" id="pin" name="pin" data-size="6" required />

  <script>
    document.querySelector('input[type="pin"]').addEventListener('change', function (e) {
      if (e.target.value.length === 6) {
        console.log('PIN entered:', e.target.value);
        // Validate PIN
        validatePIN(e.target.value);
      }
    });
  </script>
</form>
```

### List Input

List inputs manage arrays of string values:

```html
<form>
  <label for="tags">Tags:</label>
  <input type="list" id="tags" name="tags" value='["web", "frontend"]' />

  <script>
    document.querySelector('input[type="list"]').addEventListener('change', function (e) {
      const tags = JSON.parse(e.target.value || '[]');
      console.log('Tags updated:', tags);
      console.log('Tag count:', tags.length);
    });
  </script>
</form>
```

### Select Input

Enhanced select dropdowns with search and multi-select:

```html
<form>
  <label for="frameworks">Select Frameworks:</label>
  <select
    class="tw-select-group"
    id="frameworks"
    name="frameworks"
    data-placeholder="Choose frameworks"
    multiple
  >
    <option class="tw-option" value="react">React</option>
    <option class="tw-option" value="vue">Vue</option>
    <option class="tw-option" value="angular">Angular</option>
    <option class="tw-option" value="svelte">Svelte</option>
  </select>

  <script>
    document.querySelector('.tw-select-group').addEventListener('change', function (e) {
      const selected = Array.from(e.target.selectedOptions).map((option) => option.value);
      console.log('Selected frameworks:', selected);
    });
  </script>
</form>
```

### Auto-Resize Textarea

Textareas that automatically adjust height based on content:

```html
<form>
  <label for="description">Project Description:</label>
  <textarea
    class="tw-auto-resize"
    id="description"
    name="description"
    placeholder="Describe your project..."
  ></textarea>

  <script>
    document.querySelector('.tw-auto-resize').addEventListener('input', function (e) {
      console.log('Content length:', e.target.value.length);
      console.log('Current height:', e.target.scrollHeight + 'px');
    });
  </script>
</form>
```

### Signature Input

Canvas-based signature capture:

```html
<form>
  <label for="signature">Digital Signature:</label>
  <input type="signature" id="signature" name="signature" style="width: 400px; height: 200px;" />

  <script>
    document.querySelector('input[type="signature"]').addEventListener('change', function (e) {
      if (e.target.value) {
        console.log('Signature captured');
        // e.target.value contains base64 image data
        displaySignaturePreview(e.target.value);
      }
    });
  </script>
</form>
```

## Form Validation

### Built-in HTML5 Validation

TW Components support standard HTML5 validation attributes:

```html
<form>
  <input type="text" name="email" required pattern="[^@]+@[^@]+\.[^@]+" />
  <input type="pin" name="pin" data-size="4" required />
  <input type="list" name="skills" required />
  <textarea class="tw-auto-resize" name="bio" required minlength="10"></textarea>

  <button type="submit">Submit</button>
</form>
```

### Custom Validation

Add custom validation logic for component-specific requirements:

```javascript
function validateForm(form) {
  const formData = new FormData(form);
  const errors = {};

  // Validate PIN
  const pin = formData.get('pin');
  if (pin && !/^\d{4}$/.test(pin)) {
    errors.pin = 'PIN must be exactly 4 digits';
  }

  // Validate list input
  const skills = JSON.parse(formData.get('skills') || '[]');
  if (skills.length === 0) {
    errors.skills = 'At least one skill is required';
  }

  // Validate signature
  const signature = formData.get('signature');
  if (!signature) {
    errors.signature = 'Digital signature is required';
  }

  return errors;
}

document.querySelector('form').addEventListener('submit', function (e) {
  e.preventDefault();

  const errors = validateForm(this);
  if (Object.keys(errors).length > 0) {
    displayErrors(errors);
    return;
  }

  // Form is valid, submit it
  submitForm(new FormData(this));
});
```

## Advanced Form Handling

### Dynamic Form Building

Create forms dynamically based on configuration:

```javascript
function createDynamicForm(config) {
  const form = document.createElement('form');

  config.fields.forEach((field) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'form-group';

    const label = document.createElement('label');
    label.textContent = field.label;
    label.setAttribute('for', field.name);
    wrapper.appendChild(label);

    let input;
    switch (field.type) {
      case 'pin':
        input = document.createElement('input');
        input.type = 'pin';
        input.setAttribute('data-size', field.size || '4');
        break;
      case 'list':
        input = document.createElement('input');
        input.type = 'list';
        input.value = JSON.stringify(field.defaultValue || []);
        break;
      case 'auto-resize':
        input = document.createElement('textarea');
        input.className = 'tw-auto-resize';
        break;
      case 'signature':
        input = document.createElement('input');
        input.type = 'signature';
        input.style.width = field.width || '300px';
        input.style.height = field.height || '150px';
        break;
      default:
        input = document.createElement('input');
        input.type = field.type;
    }

    input.name = field.name;
    input.id = field.name;
    if (field.required) input.required = true;
    if (field.placeholder) input.placeholder = field.placeholder;

    wrapper.appendChild(input);
    form.appendChild(wrapper);
  });

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = 'Submit';
  form.appendChild(submitButton);

  return form;
}

// Usage
const formConfig = {
  fields: [
    { name: 'name', type: 'text', label: 'Full Name', required: true },
    { name: 'pin', type: 'pin', label: 'Security PIN', size: 6, required: true },
    { name: 'skills', type: 'list', label: 'Skills', defaultValue: ['JavaScript'] },
    {
      name: 'bio',
      type: 'auto-resize',
      label: 'Biography',
      placeholder: 'Tell us about yourself...',
    },
    { name: 'signature', type: 'signature', label: 'Signature', width: '400px', height: '200px' },
  ],
};

const dynamicForm = createDynamicForm(formConfig);
document.body.appendChild(dynamicForm);
```

### Multi-Step Forms

Handle complex forms with multiple steps:

```javascript
class MultiStepForm {
  constructor(container, steps) {
    this.container = container;
    this.steps = steps;
    this.currentStep = 0;
    this.formData = new Map();
    this.init();
  }

  init() {
    this.render();
    this.attachEventListeners();
  }

  render() {
    const step = this.steps[this.currentStep];
    this.container.innerHTML = `
      <form id="stepForm">
        <h2>${step.title}</h2>
        <div class="step-content">
          ${step.fields.map((field) => this.renderField(field)).join('')}
        </div>
        <div class="step-navigation">
          ${this.currentStep > 0 ? '<button type="button" class="prev-btn">Previous</button>' : ''}
          ${this.currentStep < this.steps.length - 1 ? '<button type="button" class="next-btn">Next</button>' : '<button type="submit">Submit</button>'}
        </div>
        <div class="step-indicator">
          Step ${this.currentStep + 1} of ${this.steps.length}
        </div>
      </form>
    `;
  }

  renderField(field) {
    switch (field.type) {
      case 'pin':
        return `
          <div class="form-group">
            <label for="${field.name}">${field.label}</label>
            <input type="pin" id="${field.name}" name="${field.name}" data-size="${field.size || 4}" ${field.required ? 'required' : ''} />
          </div>
        `;
      case 'list':
        return `
          <div class="form-group">
            <label for="${field.name}">${field.label}</label>
            <input type="list" id="${field.name}" name="${field.name}" value='${JSON.stringify(field.defaultValue || [])}' />
          </div>
        `;
      case 'auto-resize':
        return `
          <div class="form-group">
            <label for="${field.name}">${field.label}</label>
            <textarea class="tw-auto-resize" id="${field.name}" name="${field.name}" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''}></textarea>
          </div>
        `;
      default:
        return `
          <div class="form-group">
            <label for="${field.name}">${field.label}</label>
            <input type="${field.type}" id="${field.name}" name="${field.name}" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''} />
          </div>
        `;
    }
  }

  attachEventListeners() {
    const form = this.container.querySelector('#stepForm');
    const nextBtn = this.container.querySelector('.next-btn');
    const prevBtn = this.container.querySelector('.prev-btn');

    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.nextStep());
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.prevStep());
    }

    form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  nextStep() {
    if (this.validateCurrentStep()) {
      this.saveCurrentStepData();
      this.currentStep++;
      this.render();
      this.restoreStepData();
    }
  }

  prevStep() {
    this.saveCurrentStepData();
    this.currentStep--;
    this.render();
    this.restoreStepData();
  }

  validateCurrentStep() {
    const form = this.container.querySelector('#stepForm');
    return form.checkValidity();
  }

  saveCurrentStepData() {
    const form = this.container.querySelector('#stepForm');
    const formData = new FormData(form);

    for (let [key, value] of formData.entries()) {
      this.formData.set(key, value);
    }
  }

  restoreStepData() {
    const step = this.steps[this.currentStep];
    step.fields.forEach((field) => {
      const input = this.container.querySelector(`[name="${field.name}"]`);
      if (input && this.formData.has(field.name)) {
        input.value = this.formData.get(field.name);
      }
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.saveCurrentStepData();

    // Convert Map to regular object
    const finalData = Object.fromEntries(this.formData);

    console.log('Final form data:', finalData);
    this.onComplete(finalData);
  }

  onComplete(data) {
    // Override this method to handle form completion
    console.log('Multi-step form completed:', data);
  }
}

// Usage
const steps = [
  {
    title: 'Personal Information',
    fields: [
      { name: 'firstName', type: 'text', label: 'First Name', required: true },
      { name: 'lastName', type: 'text', label: 'Last Name', required: true },
      { name: 'email', type: 'email', label: 'Email', required: true },
    ],
  },
  {
    title: 'Security',
    fields: [{ name: 'pin', type: 'pin', label: 'Create PIN', size: 6, required: true }],
  },
  {
    title: 'Profile',
    fields: [
      { name: 'skills', type: 'list', label: 'Skills', defaultValue: [] },
      { name: 'bio', type: 'auto-resize', label: 'Bio', placeholder: 'Tell us about yourself...' },
    ],
  },
];

const multiStepForm = new MultiStepForm(document.getElementById('formContainer'), steps);

multiStepForm.onComplete = function (data) {
  console.log('Registration completed:', data);
  // Submit to server
  submitRegistration(data);
};
```

## Form Submission

### AJAX Submission

Submit forms asynchronously without page reload:

```javascript
async function submitForm(formData, endpoint) {
  try {
    // Convert special component values
    const processedData = new FormData();

    for (let [key, value] of formData.entries()) {
      // Handle list inputs
      if (key.includes('list') || (typeof value === 'string' && value.startsWith('['))) {
        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) {
            parsed.forEach((item, index) => {
              processedData.append(`${key}[${index}]`, item);
            });
            continue;
          }
        } catch (e) {
          // Not JSON, treat as regular value
        }
      }

      processedData.append(key, value);
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      body: processedData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Form submitted successfully:', result);
    return result;
  } catch (error) {
    console.error('Form submission error:', error);
    throw error;
  }
}

// Usage
document.querySelector('form').addEventListener('submit', async function (e) {
  e.preventDefault();

  try {
    const result = await submitForm(new FormData(this), '/api/submit');
    showSuccessMessage('Form submitted successfully!');
  } catch (error) {
    showErrorMessage('Failed to submit form. Please try again.');
  }
});
```

## Best Practices

### 1. Progressive Enhancement

Start with basic HTML forms and enhance with TW Components:

```html
<!-- Base HTML form that works without JavaScript -->
<form>
  <input type="text" name="pin" pattern="[0-9]{4}" placeholder="Enter 4-digit PIN" />
  <textarea name="message" placeholder="Your message"></textarea>
  <button type="submit">Submit</button>
</form>

<!-- Enhanced with TW Components when JavaScript is available -->
<script>
  document.addEventListener('DOMContentLoaded', function () {
    // Enhance PIN input
    const pinInput = document.querySelector('input[name="pin"]');
    if (pinInput) {
      pinInput.type = 'pin';
      pinInput.setAttribute('data-size', '4');
      pinInput.removeAttribute('pattern');
    }

    // Enhance textarea
    const textarea = document.querySelector('textarea[name="message"]');
    if (textarea) {
      textarea.classList.add('tw-auto-resize');
    }
  });
</script>
```

### 2. Accessibility

Ensure forms are accessible to all users:

```html
<form>
  <div class="form-group">
    <label for="pin">Security PIN</label>
    <input type="pin" id="pin" name="pin" data-size="6" aria-describedby="pin-help" required />
    <div id="pin-help" class="help-text">Enter a 6-digit numeric PIN for account security</div>
  </div>

  <div class="form-group">
    <label for="skills">Your Skills</label>
    <input
      type="list"
      id="skills"
      name="skills"
      aria-describedby="skills-help"
      value='["JavaScript"]'
    />
    <div id="skills-help" class="help-text">
      Add your technical skills. Press Enter to add each skill.
    </div>
  </div>
</form>
```

### 3. Error Handling

Provide clear error messages and recovery options:

```javascript
function displayFieldError(fieldName, message) {
  const field = document.querySelector(`[name="${fieldName}"]`);
  const errorElement =
    document.querySelector(`#${fieldName}-error`) || document.createElement('div');

  errorElement.id = `${fieldName}-error`;
  errorElement.className = 'error-message';
  errorElement.textContent = message;
  errorElement.setAttribute('role', 'alert');

  if (!errorElement.parentNode) {
    field.parentNode.appendChild(errorElement);
  }

  field.setAttribute('aria-invalid', 'true');
  field.setAttribute('aria-describedby', errorElement.id);
}

function clearFieldError(fieldName) {
  const field = document.querySelector(`[name="${fieldName}"]`);
  const errorElement = document.querySelector(`#${fieldName}-error`);

  if (errorElement) {
    errorElement.remove();
  }

  field.removeAttribute('aria-invalid');
  field.removeAttribute('aria-describedby');
}
```

### 4. Performance

Optimize form performance for large or complex forms:

```javascript
// Debounce validation to avoid excessive processing
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Debounced validation
const validateField = debounce(function (field) {
  // Perform validation
  console.log('Validating field:', field.name);
}, 300);

// Attach to form inputs
document.querySelectorAll('input, textarea, select').forEach((field) => {
  field.addEventListener('input', () => validateField(field));
});
```

## Troubleshooting

### Common Issues

**Component not initializing:**

- Ensure TW Components CSS and JavaScript are loaded
- Check browser console for JavaScript errors
- Verify HTML structure matches component requirements

**Form data not submitting correctly:**

- Use `FormData` API to access component values
- Handle JSON parsing for list inputs
- Check network requests in browser dev tools

**Validation not working:**

- Ensure HTML5 validation attributes are set correctly
- Check for JavaScript errors preventing validation
- Test with different browsers for compatibility

**Styling issues:**

- Include TW Components CSS before custom styles
- Check for CSS conflicts with existing styles
- Use browser dev tools to inspect computed styles

For more specific issues, refer to individual component documentation or check the browser console for error messages.
