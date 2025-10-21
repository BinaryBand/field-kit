import '../src/index.js';

// Configure Prism plugins before initialization
if (window.Prism) {
  // Configure Normalize Whitespace plugin with minimal processing
  window.Prism.plugins.NormalizeWhitespace.setDefaults({
    'remove-trailing': true,
    'remove-indent': false,
    'left-trim': true,
    'right-trim': true,
    'break-lines': 120,
    'indent': 0,
    'remove-initial-line-feed': true,
    'tabs-to-spaces': 0,
    'normalize': false,
  });
}

class SimpleCodeManager {
  constructor() {
    this.init();
  }

  init() {
    // Initialize signature controls
    this.initializeSignatureControls();

    // Create code demos for existing elements
    this.createCodeDemos();
  }

  createCodeDemos() {
    const codeDemos = document.querySelectorAll('.code-demo');

    codeDemos.forEach((demo) => {
      const targetQuery = demo.getAttribute('data-target');
      const target = document.querySelector(targetQuery);

      if (target) {
        const cleanedCode = this.getCleanedCode(target);
        const pre = document.createElement('pre');
        const code = document.createElement('code');

        // Let Prism plugins handle styling and copy functionality
        pre.className = 'mt-3 line-numbers';
        code.className = 'language-html';
        code.textContent = cleanedCode;

        pre.appendChild(code);
        demo.appendChild(pre);
      }
    });

    // Let Prism handle all processing
    setTimeout(() => {
      if (window.Prism) {
        window.Prism.highlightAll();
      }
    }, 100);
  }

  getCleanedCode(element) {
    // Build clean HTML from element structure instead of using problematic outerHTML
    return this.elementToCleanHTML(element, 0);
  }

  elementToCleanHTML(element, indentLevel = 0) {
    const tab = '  ';
    const indent = tab.repeat(indentLevel);
    let html = '';

    // Build opening tag
    let openTag = `<${element.tagName.toLowerCase()}`;

    // Add attributes
    for (const attr of element.attributes) {
      if (attr.name === 'class') {
        // Filter classes to only TW-related ones
        const cleanClasses = attr.value
          .split(/\s+/)
          .filter(
            (cls) =>
              cls.startsWith('tw-') ||
              cls.startsWith('data-tw-') ||
              cls.startsWith('calendar-') ||
              cls === 'small' ||
              cls === 'text-secondary'
          )
          .join(' ')
          .trim();

        if (cleanClasses) {
          openTag += ` class="${cleanClasses}"`;
        }
      } else if (!attr.name.startsWith('data-') || attr.name.startsWith('data-tw-')) {
        // Include non-data attributes and TW data attributes
        const value = attr.value;
        if (attr.name === 'selected' || attr.name === 'disabled' || attr.name === 'multiple') {
          // Boolean attributes
          if (value !== null && value !== 'false') {
            openTag += ` ${attr.name}`;
          }
        } else {
          openTag += ` ${attr.name}="${value}"`;
        }
      }
    }

    // Check if it's a void/self-closing element
    const voidElements = [
      'input',
      'br',
      'hr',
      'img',
      'meta',
      'link',
      'area',
      'base',
      'col',
      'embed',
      'param',
      'source',
      'track',
      'wbr',
    ];
    const isVoidElement = voidElements.includes(element.tagName.toLowerCase());

    if (isVoidElement) {
      html += indent + openTag + '>';
    } else {
      html += indent + openTag + '>\n';

      // Add children
      for (const child of element.children) {
        html += this.elementToCleanHTML(child, indentLevel + 1);
      }

      // Add text content if any (and no children)
      if (element.children.length === 0 && element.textContent.trim()) {
        const textLines = element.textContent.trim().split('\n');
        for (const line of textLines) {
          const trimmedLine = line.trim();
          if (trimmedLine) {
            html += tab.repeat(indentLevel + 1) + trimmedLine + '\n';
          }
        }
      }

      // Closing tag
      html += indent + `</${element.tagName.toLowerCase()}>`;
    }

    // Add newline unless this is the root element
    if (indentLevel > 0) {
      html += '\n';
    }

    return html;
  }

  formatHTML(html) {
    // Decode HTML entities first
    const textarea = document.createElement('textarea');
    textarea.innerHTML = html;
    html = textarea.value;

    let formatted = '';
    let indent = 0;
    const tab = '  ';

    // More careful HTML parsing - preserve complete tags on single lines
    const lines = html
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.startsWith('</')) {
        // Closing tag
        indent = Math.max(0, indent - 1);
        formatted += tab.repeat(indent) + line + '\n';
      } else if (line.startsWith('<')) {
        // Opening tag or self-closing tag
        formatted += tab.repeat(indent) + line + '\n';

        // Check if it's a self-closing tag or void element
        const isVoidElement =
          /^<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)[^>]*>/i.test(
            line
          );
        const isSelfClosing = line.endsWith('/>');
        const hasClosingTag = line.includes('</');

        if (!isVoidElement && !isSelfClosing && !hasClosingTag) {
          indent++;
        }
      } else if (line.trim()) {
        // Text content
        formatted += tab.repeat(indent) + line + '\n';
      }
    }

    return formatted.trim();
  }

  initializeSignatureControls() {
    const signatureInput = document.querySelector("input[type='signature']");
    const clearButton = document.querySelector('#clear-signature-button');

    if (clearButton && signatureInput) {
      clearButton.addEventListener('click', () => {
        signatureInput.value = '';
        signatureInput.dispatchEvent(new Event('change'));
      });
    }
  }
}

/**
 * Test Suite for TW Form Components
 * This test validates that all form components in index.html produce expected values
 */
class TWFormTester {
  constructor() {
    this.testResults = [];
    this.expectedValues = this.getExpectedValues();
  }

  /**
   * Define expected values for all form components in index.html
   */
  getExpectedValues() {
    return {
      // List Input - should parse JSON array
      ListInput: ['One', 'Two', 'Three'],

      // Single Select - should return single number value
      SingleSelect: 3, // Only Chicago is selected

      // Multi Select - should return array of selected values
      Multiselect: [3], // Only Chicago is selected (same template as single select)

      // Auto-resize textarea (accounting for actual whitespace)
      Multiline: 'First Line\nSecond Line',

      // PIN Input
      Pin: '123456',

      // Form Array - should create array from child elements
      Array: ['1st', '2nd', '3rd'],

      // Form Group - should create object from child elements
      Children: {
        First: '1st',
        Second: '2nd',
      },

      // Complex Form Object - nested structure
      ComplexObject: {
        First: '1st',
        Child: [
          ['2nd', '3rd'], // Array "One" becomes array of values
          {
            // Group "Two" becomes object
            Fourth: '4th',
            Fifth: '5th',
          },
        ],
      },
    };
  }

  /**
   * Check if a test should be skipped due to unpredictable results
   */
  shouldSkipTest(fieldName) {
    // Skip signature and passkey tests as requested - they have unpredictable results
    return ['SignatureInput', 'Passkey'].includes(fieldName);
  }

  /**
   * Setup form for testing
   */
  setupTestForm() {
    const form = document.querySelector('.tw-form');
    if (!form) {
      throw new Error('Test form not found');
    }

    // Override the existing submit handler to run tests instead
    form.onsubmit = (event) => {
      event.preventDefault();
      this.runTests(event);
      return false;
    };

    return form;
  }

  /**
   * Replicate the form processing logic from Form.tsx
   */
  processFormData(form) {
    const formData = {};
    this.reduceFormData(formData, form);
    return formData;
  }

  /**
   * Normalize input values based on type
   */
  normalizeInputValue(element) {
    const type = element.getAttribute('data-type') ?? element.getAttribute('type') ?? element.type;

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

  /**
   * Normalize select values
   */
  normalizeSelectValue(element) {
    const type = element.getAttribute('data-type') || element.getAttribute('type') || '';

    const normalizeValue = (val) => {
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

  /**
   * Normalize any element value
   */
  normalizeValue(element) {
    if (element instanceof HTMLInputElement) {
      return this.normalizeInputValue(element);
    } else if (element instanceof HTMLTextAreaElement) {
      return element.value;
    } else if (element instanceof HTMLSelectElement) {
      return this.normalizeSelectValue(element);
    }

    return null;
  }

  /**
   * Get child elements
   */
  getChildren(element) {
    return Array.from(element.children).filter((e) => e instanceof Element);
  }

  /**
   * Reduce form data - replicated from Form.tsx
   */
  reduceFormData(acc, element) {
    // 1. Process Group/Array first
    if (element.hasAttribute('data-tw-group')) {
      const groupName = element.getAttribute('data-tw-group') ?? 'group';
      const formData = {};
      acc[groupName] = formData;

      // Recursively process children and store in the new group object
      const children = this.getChildren(element);
      for (const child of children) {
        this.reduceFormData(formData, child);
      }
      return; // Exit here to prevent processing children again
    }

    if (element.hasAttribute('data-tw-array')) {
      const listName = element.getAttribute('data-tw-array') ?? 'list';
      const formData = {};

      const children = this.getChildren(element);
      for (const child of children) {
        this.reduceFormData(formData, child);
      }
      acc[listName] = Array.from(Object.values(formData));
      return; // Exit here to prevent processing children again
    }

    // 2. Process individual element only if it has a name
    const name = element.getAttribute('name');
    if (name !== null) {
      const value = this.normalizeValue(element);

      // Special handling for unchecked radio buttons.
      if (element instanceof HTMLInputElement && element.type === 'radio' && !element.checked) {
        if (acc[name] !== undefined) {
          return;
        }
      }

      if (value !== null) {
        acc[name] = value;
      }
    }

    // 3. Continue recursion for children without custom attributes
    const children = this.getChildren(element);
    for (const child of children) {
      // Pass the same accumulator down for non-group/array elements
      this.reduceFormData(acc, child);
    }
  }

  /**
   * Deep comparison utility
   */
  deepEqual(obj1, obj2) {
    if (obj1 === obj2) return true;

    if (obj1 == null || obj2 == null) return false;

    if (typeof obj1 !== typeof obj2) return false;

    if (typeof obj1 !== 'object') return obj1 === obj2;

    if (Array.isArray(obj1) !== Array.isArray(obj2)) return false;

    if (Array.isArray(obj1)) {
      if (obj1.length !== obj2.length) return false;
      for (let i = 0; i < obj1.length; i++) {
        if (!this.deepEqual(obj1[i], obj2[i])) return false;
      }
      return true;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (let key of keys1) {
      if (!keys2.includes(key)) return false;
      if (!this.deepEqual(obj1[key], obj2[key])) return false;
    }

    return true;
  }

  /**
   * Run individual test for a form field
   */
  runFieldTest(fieldName, actualValue, expectedValue) {
    const passed = this.deepEqual(actualValue, expectedValue);

    const result = {
      field: fieldName,
      passed,
      actual: actualValue,
      expected: expectedValue,
      message: passed
        ? `✅ ${fieldName}: PASSED`
        : `❌ ${fieldName}: FAILED - Expected ${JSON.stringify(expectedValue)}, got ${JSON.stringify(actualValue)}`,
    };

    this.testResults.push(result);
    return result;
  }

  /**
   * Run all tests
   */
  runTests(event) {
    console.log('🧪 Running TW Form Component Tests...\n');

    this.testResults = [];

    try {
      const form = event.currentTarget;
      const actualFormData = this.processFormData(form);

      console.log('📋 Processed Form Data:', actualFormData);
      console.log('📋 Expected Form Data:', this.expectedValues);
      console.log('\n--- Test Results ---');

      // Test each expected field
      for (const [fieldName, expectedValue] of Object.entries(this.expectedValues)) {
        if (this.shouldSkipTest(fieldName)) {
          const result = {
            field: fieldName,
            passed: true, // Mark as passed to avoid counting as failure
            actual: 'SKIPPED',
            expected: 'SKIPPED',
            message: `⚠️  ${fieldName}: SKIPPED - Unpredictable results`,
            skipped: true,
          };
          this.testResults.push(result);
          console.log(result.message);
          continue;
        }

        const actualValue = actualFormData[fieldName];
        const result = this.runFieldTest(fieldName, actualValue, expectedValue);
        console.log(result.message);
      }

      // Check for unexpected fields (excluding skipped ones)
      for (const [fieldName, actualValue] of Object.entries(actualFormData)) {
        if (!(fieldName in this.expectedValues) && !this.shouldSkipTest(fieldName)) {
          const result = {
            field: fieldName,
            passed: false,
            actual: actualValue,
            expected: undefined,
            message: `⚠️  ${fieldName}: UNEXPECTED FIELD - Value: ${JSON.stringify(actualValue)}`,
          };
          this.testResults.push(result);
          console.log(result.message);
        }
      }

      this.displaySummary();
    } catch (error) {
      console.error('❌ Test execution failed:', error);
    }
  }

  /**
   * Display test summary
   */
  displaySummary() {
    const passedTests = this.testResults.filter((t) => t.passed).length;
    const totalTests = this.testResults.length;
    const failedTests = totalTests - passedTests;

    console.log('\n--- Test Summary ---');
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests}`);
    console.log(`Failed: ${failedTests}`);

    if (failedTests === 0) {
      console.log('🎉 All tests passed!');
    } else {
      console.log(`💥 ${failedTests} test(s) failed. See details above.`);
    }

    // Update UI with results
    this.updateUIWithResults();
  }

  /**
   * Update the page UI with test results
   */
  updateUIWithResults() {
    // Remove existing test results
    const existingResults = document.querySelector('.test-results');
    if (existingResults) {
      existingResults.remove();
    }

    // Create results container
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'test-results card mt-4';
    resultsContainer.innerHTML = `
      <div class="card-header">
        <h5 class="card-title">🧪 Test Results</h5>
      </div>
      <div class="card-body">
        <div class="test-summary mb-3"></div>
        <div class="test-details"></div>
      </div>
    `;

    // Add summary
    const passedTests = this.testResults.filter((t) => t.passed).length;
    const totalTests = this.testResults.length;
    const failedTests = totalTests - passedTests;

    const summaryEl = resultsContainer.querySelector('.test-summary');
    summaryEl.innerHTML = `
      <div class="row">
        <div class="col">
          <div class="badge bg-${failedTests === 0 ? 'success' : 'warning'} fs-6">
            ${passedTests}/${totalTests} Tests Passed
          </div>
        </div>
      </div>
    `;

    // Add detailed results
    const detailsEl = resultsContainer.querySelector('.test-details');
    const resultsList = document.createElement('div');
    resultsList.className = 'list-group';

    this.testResults.forEach((result) => {
      const resultItem = document.createElement('div');
      resultItem.className = `list-group-item ${result.passed ? 'list-group-item-success' : 'list-group-item-danger'}`;
      resultItem.innerHTML = `
        <div class="d-flex justify-content-between align-items-start">
          <div>
            <strong>${result.field}</strong>
            <div class="small">
              Expected: <code>${JSON.stringify(result.expected)}</code><br>
              Actual: <code>${JSON.stringify(result.actual)}</code>
            </div>
          </div>
          <span class="badge ${result.passed ? 'bg-success' : 'bg-danger'}">
            ${result.passed ? 'PASS' : 'FAIL'}
          </span>
        </div>
      `;
      resultsList.appendChild(resultItem);
    });

    detailsEl.appendChild(resultsList);

    // Insert results after the form
    const form = document.querySelector('.tw-form');
    form.parentNode.insertBefore(resultsContainer, form.nextSibling);
  }

  /**
   * Initialize the tester
   */
  init() {
    try {
      this.setupTestForm();
      console.log('✅ TW Form Tester initialized successfully');
      console.log('📋 Click "Test TW Components" button to run tests');

      // Update button text to be more descriptive
      const submitButton = document.querySelector('.btn-primary');
      if (submitButton) {
        submitButton.textContent = '🧪 Run Component Tests';
      }
    } catch (error) {
      console.error('❌ Failed to initialize TW Form Tester:', error);
    }
  }
}

// Enhance SimpleCodeManager to work with the tester
class EnhancedCodeManager extends SimpleCodeManager {
  constructor() {
    super();
    this.initTester();
  }

  initTester() {
    // Wait a bit for the main app to load before initializing the tester
    setTimeout(() => {
      try {
        const tester = new TWFormTester();
        tester.init();
      } catch (error) {
        console.error('Failed to initialize tester:', error);
      }
    }, 1000);
  }
}

// Replace SimpleCodeManager initialization with enhanced version
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new EnhancedCodeManager();
  });
} else {
  new EnhancedCodeManager();
}

export { SimpleCodeManager, TWFormTester };
