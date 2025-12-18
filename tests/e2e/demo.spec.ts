import { test, expect } from '@playwright/test';

test.describe('Demo Page - Interactive Components', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/docs/demo');
    // Wait for the page to fully load
    await page.waitForLoadState('networkidle');
  });

  test('should load the demo page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Live Demo.*TW Components/);
    await expect(page.locator('h1')).toContainText('Live Demo');
  });

  test('Select Input (Single) - should display and track value changes', async ({ page }) => {
    const selectInput = page.locator('select[name="SingleSelect"]').first();
    const valueDisplay = page.locator('pre.value-display').first();

    // Check initial value (Boston is selected by default)
    await expect(valueDisplay).toContainText('2');

    // Change selection
    await selectInput.selectOption('3'); // Chicago
    await expect(valueDisplay).toContainText('3');

    // Change to another option
    await selectInput.selectOption('5'); // El Paso
    await expect(valueDisplay).toContainText('5');
  });

  test('Select Input (Multiple) - should track multiple selections', async ({ page }) => {
    const multiSelect = page.locator('select[name="MultiSelect"]');
    const valueDisplay = page.locator('pre.value-display').nth(1);

    // Check initial value (Boston is pre-selected)
    await expect(valueDisplay).toContainText('["bos"]');

    // Select multiple options
    await multiSelect.selectOption(['alb', 'chi', 'den']);
    
    // Wait for value to update and check it contains the selections
    await page.waitForTimeout(100);
    const displayText = await valueDisplay.textContent();
    expect(displayText).toContain('alb');
    expect(displayText).toContain('chi');
    expect(displayText).toContain('den');
  });

  test('Select Input (Grouped) - should handle grouped options', async ({ page }) => {
    const groupedSelect = page.locator('select[name="GroupedSelect"]');
    const valueDisplay = page.locator('pre.value-display').nth(2);

    // Check initial values (carrot, beef, tofu are pre-selected)
    await expect(valueDisplay).toContainText('carrot');
    await expect(valueDisplay).toContainText('beef');
    await expect(valueDisplay).toContainText('tofu');

    // Change selections
    await groupedSelect.selectOption(['apple', 'banana']);
    
    await page.waitForTimeout(100);
    const displayText = await valueDisplay.textContent();
    expect(displayText).toContain('apple');
    expect(displayText).toContain('banana');
  });

  test('List Input - should display and accept input changes', async ({ page }) => {
    const listInput = page.locator('input[name="ListInput"]');
    const valueDisplay = page.locator('pre.value-display').nth(3);

    // Check initial value
    await expect(valueDisplay).toContainText('["One","Two","Three"]');

    // The list input is a custom component, so we'll verify it's present and has value
    await expect(listInput).toBeVisible();
    const inputValue = await listInput.inputValue();
    expect(inputValue).toContain('One');
  });

  test('PIN Input - should display digit boxes', async ({ page }) => {
    const pinInput = page.locator('input[name="PinInput"]');
    const valueDisplay = page.locator('pre.value-display').nth(4);

    // PIN input should be visible
    await expect(pinInput).toBeVisible();
    
    // Initially should be empty or show placeholder
    const displayText = await valueDisplay.textContent();
    expect(displayText).toBeTruthy();
  });

  test('Auto-Resize Textarea - should display and track value', async ({ page }) => {
    const textarea = page.locator('textarea[name="Multiline"]');
    const valueDisplay = page.locator('pre.value-display').nth(5);

    // Check initial value
    await expect(valueDisplay).toContainText('First Line');
    await expect(valueDisplay).toContainText('Second Line');

    // Clear and type new content
    await textarea.click();
    await textarea.fill('New content\nAnother line');
    
    await page.waitForTimeout(100);
    await expect(valueDisplay).toContainText('New content');
    await expect(valueDisplay).toContainText('Another line');
  });

  test('Signature Input - should display canvas and clear button', async ({ page }) => {
    const signatureInput = page.locator('input[name="Signature"]');
    const clearButton = page.locator('button:has-text("Clear Signature")');
    const valueDisplay = page.locator('pre.value-display').nth(6);

    // Signature input and clear button should be visible
    await expect(signatureInput).toBeVisible();
    await expect(clearButton).toBeVisible();

    // Initially should be empty
    const initialText = await valueDisplay.textContent();
    expect(initialText).toContain('(empty)');
  });

  test('All components should compile without errors', async ({ page }) => {
    // Check for console errors
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Wait a bit to catch any delayed errors
    await page.waitForTimeout(1000);

    // Filter out known non-critical errors (like missing favicon)
    const criticalErrors = errors.filter(
      (error) => !error.includes('favicon') && !error.includes('404')
    );

    expect(criticalErrors.length).toBe(0);
  });

  test('All value displays should be present', async ({ page }) => {
    const valueDisplays = page.locator('pre.value-display');
    
    // Should have 7 value displays (one for each component)
    await expect(valueDisplays).toHaveCount(7);

    // All should be visible
    for (let i = 0; i < 7; i++) {
      await expect(valueDisplays.nth(i)).toBeVisible();
    }
  });

  test('Form components should be properly styled', async ({ page }) => {
    // Check that select components have the tw-select-group class
    const selectGroups = page.locator('.tw-select-group');
    await expect(selectGroups.first()).toBeVisible();

    // Check that textarea has the tw-auto-resize class
    const autoResizeTextarea = page.locator('.tw-auto-resize');
    await expect(autoResizeTextarea).toBeVisible();
  });
});
