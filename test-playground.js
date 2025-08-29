// Note: We'll get reduceFormData from the global scope after the main app loads
// since we can't directly import TypeScript modules in this context

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
      SingleSelect: 3, // Chicago is selected by default

      // Multi Select - should return array of selected values
      Multiselect: [3, 5], // Chicago and El Paso are selected by default

      // Auto-resize textarea
      Multiline: 'First Line\nSecond Line',

      // PIN Input
      Pin: '123456',

      // Signature Input (will be empty initially)
      SignatureInput: '',

      // Passkey Input (special handling needed)
      Passkey: '', // Will be empty until user interaction

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
   * Setup form for testing
   */
  setupTestForm() {
    const form = document.querySelector('.tw-form');
    if (!form) {
      throw new Error('Test form not found');
    }

    // Override the existing submit handler
    const originalOnSubmit = form.onsubmit;
    form.onsubmit = (event) => {
      event.preventDefault();
      this.runTests(event);
      return false;
    };

    return form;
  }

  /**
   * Process form data using the same logic as Form.tsx
   */
  processFormData(form) {
    const formData = {};
    reduceFormData(formData, form);
    return formData;
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
        const actualValue = actualFormData[fieldName];
        const result = this.runFieldTest(fieldName, actualValue, expectedValue);
        console.log(result.message);
      }

      // Check for unexpected fields
      for (const [fieldName, actualValue] of Object.entries(actualFormData)) {
        if (!(fieldName in this.expectedValues)) {
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

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new TWFormTester().init();
  });
} else {
  new TWFormTester().init();
}

export { TWFormTester };
