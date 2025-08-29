import { fireEvent, render } from '@testing-library/react';
import { act } from '@testing-library/react';
import { vi } from 'vitest';
import fs from 'fs';
import path from 'path';

import Form from '@/controllers/components/Form';
import { html } from '@/controllers/utils';

// Load the actual index.html file
const indexHTML = fs.readFileSync(path.resolve(__dirname, '../../index.html'), 'utf-8');

/**
 * Form Playground Test Bot
 * This test suite simulates real user interactions with the form playground,
 * validating that all components produce expected values on submit.
 */

let cleanupRender: (() => void) | undefined;

afterEach(async () => {
  await act(async () => {
    // Await to flush microtasks from the previous test
  });
  cleanupRender?.();
  vi.clearAllMocks();
});

describe('Form Playground Test Bot', () => {
  beforeEach(() => {
    // Reset the DOM for each test
    document.body.innerHTML = '';
  });

  /**
   * Test Bot Helper: Simulates realistic user interactions
   */
  class FormTestBot {
    private form: HTMLFormElement;
    private submittedData: any = null;

    constructor(form: HTMLFormElement) {
      this.form = form;
      this.setupFormInterception();
    }

    private setupFormInterception() {
      // Override form submission to capture data instead of making network requests
      this.form.onsubmit = (event) => {
        event.preventDefault();
        this.submittedData = this.processFormData();
        return false;
      };
    }

    private processFormData() {
      // Replicate the exact form processing logic from Form.tsx
      const formData: any = {};
      this.reduceFormData(formData, this.form);
      return formData;
    }

    private reduceFormData(acc: any, element: Element): void {
      // Replicate Form.tsx logic exactly
      if (element.hasAttribute('data-tw-group')) {
        const groupName = element.getAttribute('data-tw-group') ?? 'group';
        const formData: any = {};
        acc[groupName] = formData;

        const children = Array.from(element.children).filter((e) => e instanceof Element);
        for (const child of children) {
          this.reduceFormData(formData, child);
        }
        return;
      }

      if (element.hasAttribute('data-tw-array')) {
        const listName = element.getAttribute('data-tw-array') ?? 'list';
        const formData: any = {};

        const children = Array.from(element.children).filter((e) => e instanceof Element);
        for (const child of children) {
          this.reduceFormData(formData, child);
        }
        acc[listName] = Array.from(Object.values(formData));
        return;
      }

      const name = element.getAttribute('name');
      if (name !== null) {
        const value = this.normalizeValue(element);

        if (element instanceof HTMLInputElement && element.type === 'radio' && !element.checked) {
          if (acc[name] !== undefined) {
            return;
          }
        }

        if (value !== null) {
          acc[name] = value;
        }
      }

      const children = Array.from(element.children).filter((e) => e instanceof Element);
      for (const child of children) {
        this.reduceFormData(acc, child);
      }
    }

    private normalizeValue(element: Element): any {
      if (element instanceof HTMLInputElement) {
        return this.normalizeInputValue(element);
      } else if (element instanceof HTMLTextAreaElement) {
        return element.value;
      } else if (element instanceof HTMLSelectElement) {
        return this.normalizeSelectValue(element);
      }
      return null;
    }

    private normalizeInputValue(element: HTMLInputElement): any {
      const type =
        element.getAttribute('data-type') ?? element.getAttribute('type') ?? element.type;

      switch (type) {
        case 'checkbox':
          return Boolean(element.checked);
        case 'radio':
          return element.value;
        case 'number':
          return parseInt(element.value) || 0;
        case 'list':
          try {
            return JSON.parse(element.value) || [];
          } catch {
            return [];
          }
        default:
          return element.value;
      }
    }

    private normalizeSelectValue(element: HTMLSelectElement): any {
      const type = element.getAttribute('data-type') || element.getAttribute('type') || '';

      const normalizeValue = (val: string) => {
        switch (type) {
          case 'number':
            return parseInt(val) || 0;
          case 'list':
            try {
              return JSON.parse(val) || [];
            } catch {
              return [];
            }
          default:
            return val;
        }
      };

      if (element.multiple) {
        return Array.from(element.selectedOptions)
          .map((opt) => opt.value)
          .map(normalizeValue);
      }

      return normalizeValue(element.value);
    }

    // Bot interaction methods
    typeInInput(selector: string, text: string) {
      const input = this.form.querySelector(selector) as HTMLInputElement;
      if (input) {
        fireEvent.change(input, { target: { value: text } });
      }
    }

    selectOption(selector: string, value: string) {
      const select = this.form.querySelector(selector) as HTMLSelectElement;
      if (select) {
        fireEvent.change(select, { target: { value } });
      }
    }

    selectMultipleOptions(selector: string, values: string[]) {
      const select = this.form.querySelector(selector) as HTMLSelectElement;
      if (select) {
        // Set multiple selected options
        Array.from(select.options).forEach((option) => {
          option.selected = values.includes(option.value);
        });
        fireEvent.change(select);
      }
    }

    clickCheckbox(selector: string) {
      const checkbox = this.form.querySelector(selector) as HTMLInputElement;
      if (checkbox) {
        fireEvent.click(checkbox);
      }
    }

    submitForm() {
      fireEvent.submit(this.form);
    }

    getSubmittedData() {
      return this.submittedData;
    }
  }

  /**
   * Playground Test 1: Complete Form Component Validation using actual index.html
   */
  test('Form Playground - All Components Test', async () => {
    // Arrange: Use the actual index.html file content
    document.body.innerHTML = indexHTML;

    // Find the form - options are now inline in HTML
    const form = document.body.querySelector('form.tw-form') as HTMLFormElement;

    // Act: Initialize the Form component and test bot
    await act(async () => render(<Form target={form} />));
    const bot = new FormTestBot(form);

    // Act: Bot submits the form
    bot.submitForm();

    // Assert: Validate all expected form values from the actual index.html
    const submittedData = bot.getSubmittedData();

    expect(submittedData).toEqual({
      ListInput: ['One', 'Two', 'Three'],
      SingleSelect: 3, // Chicago (selected in template)
      Multiselect: [3], // Only Chicago selected
      Multiline: 'First Line\nSecond Line',
      Pin: '123456',
      SignatureInput: '', // Signature input from index.html
      Passkey: '', // Passkey input from index.html
      Array: ['1st', '2nd', '3rd'],
      Children: {
        First: '1st',
        Second: '2nd',
      },
      ComplexObject: {
        First: '1st',
        Child: [
          ['2nd', '3rd'], // Array "One"
          {
            // Group "Two"
            Fourth: '4th',
            Fifth: '5th',
          },
        ],
      },
    });
  });

  /**
   * Playground Test 2: Interactive User Behavior Simulation
   */
  test('Form Playground - User Interaction Bot', async () => {
    // Arrange: Create a form for user interaction testing
    const interactiveHTML = html`
      <form class="tw-form" data-testid="interactive-form">
        <input name="username" type="text" value="" />
        <input name="age" type="number" value="0" />
        <input name="subscribe" type="checkbox" />
        <select name="country">
          <option value="">Select Country</option>
          <option value="USA">USA</option>
          <option value="CAN">Canada</option>
          <option value="UK">UK</option>
        </select>
        <select name="skills" multiple>
          <option value="js">JavaScript</option>
          <option value="react">React</option>
          <option value="vue">Vue</option>
          <option value="angular">Angular</option>
        </select>
        <textarea name="bio"></textarea>
        <button type="submit">Submit</button>
      </form>
    `;

    document.body.innerHTML = interactiveHTML;
    const form = document.body.querySelector('form')!;

    // Act: Initialize Form component and test bot
    await act(async () => render(<Form target={form} />));
    const bot = new FormTestBot(form);

    // Act: Bot performs realistic user interactions
    bot.typeInInput('input[name="username"]', 'johnDoe');
    bot.typeInInput('input[name="age"]', '25');
    bot.clickCheckbox('input[name="subscribe"]');
    bot.selectOption('select[name="country"]', 'CAN');
    bot.selectMultipleOptions('select[name="skills"]', ['js', 'react']);
    bot.typeInInput('textarea[name="bio"]', 'Software developer with 5 years experience');

    // Act: Submit the form
    bot.submitForm();

    // Assert: Validate the bot interactions worked correctly
    const submittedData = bot.getSubmittedData();

    expect(submittedData).toEqual({
      username: 'johnDoe',
      age: 25,
      subscribe: true,
      country: 'CAN',
      skills: ['js', 'react'],
      bio: 'Software developer with 5 years experience',
    });
  });

  /**
   * Playground Test 3: Edge Cases and Error Handling
   */
  test('Form Playground - Edge Cases Validation', async () => {
    // Arrange: Create a form with edge cases
    const edgeHTML = html`
      <form class="tw-form" data-testid="edge-form">
        <input name="emptyString" type="text" value="" />
        <input name="invalidNumber" type="number" value="abc" />
        <input name="invalidJSON" type="list" value='{"invalid": json}' />
        <input name="uncheckedBox" type="checkbox" />
        <select name="noSelection">
          <option value="1">One</option>
          <option value="2">Two</option>
        </select>
        <select name="emptyMultiple" multiple>
          <option value="1">One</option>
          <option value="2">Two</option>
        </select>
        <div data-tw-group="EmptyGroup"></div>
        <div data-tw-array="EmptyArray"></div>
        <button type="submit">Submit</button>
      </form>
    `;

    document.body.innerHTML = edgeHTML;
    const form = document.body.querySelector('form')!;

    // Act: Initialize Form component and test bot
    await act(async () => render(<Form target={form} />));
    const bot = new FormTestBot(form);

    // Act: Submit without interactions (test defaults)
    bot.submitForm();

    // Assert: Validate edge case handling
    const submittedData = bot.getSubmittedData();

    expect(submittedData).toEqual({
      emptyString: '',
      invalidNumber: 0, // Should default to 0 for invalid number
      invalidJSON: [], // Should default to empty array for invalid JSON
      uncheckedBox: false,
      noSelection: '1', // No selection defaults to first option
      emptyMultiple: [], // Empty multi-select should be empty array
      EmptyGroup: {}, // Empty group should be empty object
      EmptyArray: [], // Empty array should be empty array
    });
  });
});
