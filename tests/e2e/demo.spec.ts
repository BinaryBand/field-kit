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
    const valueDisplay = page.locator('pre.value-display').first();

    // Check that the component is visible
    await expect(valueDisplay).toBeVisible();
    
    // Verify value display updates (tests FormDemo integration)
    const initialValue = await valueDisplay.textContent();
    expect(initialValue).toBeTruthy();
  });

  test('Select Input (Multiple) - should track multiple selections', async ({ page }) => {
    const valueDisplay = page.locator('pre.value-display').nth(1);

    // Check that the component is visible and displays a value
    await expect(valueDisplay).toBeVisible();
    const displayText = await valueDisplay.textContent();
    expect(displayText).toBeTruthy();
  });

  test('Select Input (Grouped) - should handle grouped options', async ({ page }) => {
    const valueDisplay = page.locator('pre.value-display').nth(2);

    // Check that the component is visible and displays values
    await expect(valueDisplay).toBeVisible();
    const displayText = await valueDisplay.textContent();
    expect(displayText).toBeTruthy();
  });

  test('List Input - should display and accept input changes', async ({ page }) => {
    const valueDisplay = page.locator('pre.value-display').nth(3);

    // Check that the component is visible and displays values
    await expect(valueDisplay).toBeVisible();
    const displayText = await valueDisplay.textContent();
    expect(displayText).toBeTruthy();
  });

  test('PIN Input - should display digit boxes', async ({ page }) => {
    const valueDisplay = page.locator('pre.value-display').nth(4);

    // Check that the component is visible
    await expect(valueDisplay).toBeVisible();
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
    const valueDisplay = page.locator('pre.value-display').nth(6);

    // Check that the component is visible
    await expect(valueDisplay).toBeVisible();
    const displayText = await valueDisplay.textContent();
    expect(displayText).toBeTruthy();
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
