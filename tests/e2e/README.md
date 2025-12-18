# E2E Testing Documentation

## Overview

This directory contains end-to-end (E2E) tests for the TW Components documentation using Playwright.

## Test Suite: Demo Page (`demo.spec.ts`)

### Purpose
Validates that all interactive components on `/docs/demo` page compile correctly, render properly, and track values accurately.

### Test Coverage (11 Tests)

#### 1. **Page Load Test**
- ✅ Verifies demo page loads successfully
- ✅ Checks page title and H1 heading

#### 2. **Select Input (Single)**
- ✅ Tests single-select dropdown
- ✅ Verifies initial value (Boston = "2")
- ✅ Changes selection and validates updates
- ✅ Tests: Chicago (3) and El Paso (5)

#### 3. **Select Input (Multiple)**
- ✅ Tests multi-select functionality
- ✅ Verifies initial selection: `["bos"]`
- ✅ Selects multiple options simultaneously
- ✅ Validates JSON array format in display

#### 4. **Select Input (Grouped)**
- ✅ Tests grouped options (Fruits/Vegetables/Proteins)
- ✅ Checks pre-selected: carrot, beef, tofu
- ✅ Changes selections to fruits
- ✅ Validates grouping works correctly

#### 5. **List Input**
- ✅ Verifies custom List Input component renders
- ✅ Checks initial value: `["One","Two","Three"]`
- ✅ Validates input visibility and value

#### 6. **PIN Input**
- ✅ Tests PIN input with 6-digit boxes
- ✅ Verifies input field visibility
- ✅ Checks value display presence

#### 7. **Auto-Resize Textarea**
- ✅ Tests textarea with auto-resize
- ✅ Verifies initial multi-line content
- ✅ Types new content and validates tracking
- ✅ Confirms real-time value updates

#### 8. **Signature Input**
- ✅ Verifies signature canvas renders
- ✅ Checks "Clear Signature" button exists
- ✅ Confirms initial empty state: `(empty)`

#### 9. **Console Error Detection**
- ✅ Monitors browser console for JS errors
- ✅ Filters non-critical errors (favicon, 404s)
- ✅ Ensures components compile without errors

#### 10. **Value Display Count**
- ✅ Verifies all 7 value displays present
- ✅ Confirms each display is visible

#### 11. **Component Styling**
- ✅ Checks CSS classes applied correctly
- ✅ Verifies `.tw-select-group` on selects
- ✅ Confirms `.tw-auto-resize` on textarea

## Running Tests

### Basic Commands

```bash
# Run all tests (headless)
npm run test:e2e

# Run with Playwright UI (interactive)
npm run test:e2e:ui

# Run with visible browser
npm run test:e2e:headed

# Debug mode with breakpoints
npm run test:e2e:debug
```

### First Time Setup

```bash
# Install Playwright browsers
npm run playwright:install
```

## Configuration

Tests are configured in `playwright.config.ts`:

- **Base URL:** `http://localhost:5175`
- **Browser:** Chromium (Desktop Chrome)
- **Test Directory:** `./tests/e2e`
- **Reporter:** HTML (view results in browser)
- **Dev Server:** Auto-starts before tests
- **Retries:** 2 on CI, 0 locally
- **Screenshots:** On failure only
- **Trace:** On first retry

## What This Validates

### Component Compilation
- All Vue components compile without TypeScript errors
- No runtime JavaScript errors in browser console
- Components render correctly in VitePress

### Value Tracking (useFormTracking)
- Form values update reactively
- Multi-select properly tracks arrays
- Single inputs track string values
- Initial values load correctly

### User Interactions
- Select dropdowns respond to changes
- Textarea accepts input
- Input fields update values
- Custom components (List, PIN, Signature) work

### DOM & Rendering
- All 7 value displays render
- Components have correct CSS classes
- Elements are visible and accessible
- Page structure is correct

## Test Results

After running tests, view the HTML report:

```bash
npx playwright show-report
```

## CI/CD Integration

Tests are configured to run in CI with:
- 2 retries on failure
- Single worker (no parallel execution)
- `forbidOnly` to prevent accidental `.only()` commits

## Adding New Tests

1. Create a new `.spec.ts` file in `tests/e2e/`
2. Import Playwright test and expect:
   ```typescript
   import { test, expect } from '@playwright/test';
   ```
3. Use `test.describe()` to group related tests
4. Use `test.beforeEach()` for common setup
5. Write assertions using Playwright's expect API

## Best Practices

- ✅ Use data attributes or semantic selectors
- ✅ Wait for `networkidle` on navigation
- ✅ Use `.nth()` for multiple elements with same selector
- ✅ Filter console errors to avoid false positives
- ✅ Add small timeouts after interactions if needed
- ✅ Test both initial state and user interactions

## Troubleshooting

### Tests Failing Locally

1. Ensure dev server is running on correct port (5175)
2. Check if Playwright browsers are installed
3. Run with `--headed` to see what's happening
4. Use `--debug` to step through tests

### Port Conflicts

If port 5175 is in use:
1. Update `baseURL` in `playwright.config.ts`
2. Update `url` in `webServer` config
3. Or close other dev servers

### Flaky Tests

- Add explicit waits: `await page.waitForLoadState('networkidle')`
- Increase timeout for specific actions
- Use `await expect().toBeVisible()` before interactions
- Check for race conditions

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Tests](https://playwright.dev/docs/debug)
