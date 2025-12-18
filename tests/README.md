# Testing Documentation

This directory contains all tests for the TW Components project, organized by test type.

## Directory Structure

```
tests/
├── unit/              # Unit tests for React components (Vitest)
│   ├── Form.test.tsx
│   ├── GroupedInput.test.tsx
│   ├── GroupedInput.simple.test.tsx
│   ├── init.test.tsx
│   └── Pin.test.tsx
├── e2e/               # End-to-end tests for documentation (Playwright)
│   ├── demo.spec.ts
│   └── README.md
└── README.md          # This file
```

## Test Types

### Unit Tests (`tests/unit/`)

**Framework:** Vitest + React Testing Library  
**Purpose:** Test individual React components and utilities in isolation

#### What's Tested:
- **Form Component** - Form submission, data transformation, nested data structures
- **GroupedInput** - Single and multi-select with grouped options
- **Pin Input** - PIN entry component functionality
- **Initialization** - Component initialization logic

#### Running Unit Tests:

```bash
# Run all unit tests once
npm run test:unit

# Run in watch mode (re-runs on file changes)
npm run test:unit:watch

# Run with UI interface
npm run test:unit:ui

# Run all tests (default)
npm test
```

### E2E Tests (`tests/e2e/`)

**Framework:** Playwright  
**Purpose:** Test the documentation site to ensure components work in production

#### What's Tested:
- Page loading and rendering
- All interactive demo components
- Real-time value tracking with `useFormTracking` composable
- User interactions (clicking, typing, selecting)
- Console errors and component compilation
- DOM structure and styling

#### Running E2E Tests:

```bash
# Run all E2E tests (headless)
npm run test:e2e

# Run with Playwright UI (interactive debugging)
npm run test:e2e:ui

# Run with visible browser
npm run test:e2e:headed

# Debug mode with breakpoints
npm run test:e2e:debug

# Install Playwright browsers (first time only)
npm run playwright:install
```

See [tests/e2e/README.md](./e2e/README.md) for detailed E2E testing documentation.

## Running All Tests

### Local Development

```bash
# RECOMMENDED: Start dev server first, then run tests in another terminal
npm run docs:dev        # Terminal 1 - Start dev server
npm run test:all        # Terminal 2 - Run all tests

# Alternative: Let Playwright start the dev server (slower)
npm run test:all:ci     # Starts server automatically (use in CI/CD)
```

**Why two terminals?** 
- ✅ Faster - dev server stays running between test runs
- ✅ No timeout issues - server is already ready
- ✅ Better for development workflow
- ✅ Can run E2E tests multiple times without waiting

### CI/CD

```bash
# In CI environments, use this to auto-start the server
npm run test:all:ci
```

## Configuration Files

### Vitest Configuration
Unit tests are configured in `vite.config.ts`:

```typescript
test: {
  environment: 'jsdom',
  globals: true,
  setupFiles: './src/setupTests.ts',
  include: ['tests/unit/**/*.test.{ts,tsx}'],
  exclude: ['tests/e2e/**'],
}
```

### Playwright Configuration
E2E tests are configured in `playwright.config.ts`:

```typescript
{
  testDir: './tests/e2e',
  baseURL: 'http://localhost:5175',
  webServer: {
    command: 'npm run docs:dev',
    url: 'http://localhost:5175',
    reuseExistingServer: true,
  }
}
```

## Test Coverage

### Unit Tests Coverage

| Component/Module | Test File | Status |
|-----------------|-----------|--------|
| Form Component | Form.test.tsx | ✅ 100% |
| GroupedInput | GroupedInput.test.tsx | ✅ 100% |
| GroupedInput (Simple) | GroupedInput.simple.test.tsx | ✅ 100% |
| PIN Input | Pin.test.tsx | ✅ 100% |
| Initialization | init.test.tsx | ✅ 100% |

**Total Unit Tests:** 5 test files

### E2E Tests Coverage

| Page/Feature | Test File | Tests | Status |
|-------------|-----------|-------|--------|
| Demo Page | demo.spec.ts | 11 | ✅ 100% |

**Total E2E Tests:** 11 tests

## Writing New Tests

### Adding Unit Tests

1. Create a new file in `tests/unit/` with `.test.tsx` or `.test.ts` extension
2. Import testing utilities:
   ```typescript
   import { render, fireEvent } from '@testing-library/react';
   import { describe, test, expect } from 'vitest';
   ```
3. Write test cases using Vitest's `describe` and `test` functions
4. Use React Testing Library for component testing

**Example:**
```typescript
import { render, fireEvent } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import MyComponent from '@/components/MyComponent';

describe('MyComponent', () => {
  test('renders correctly', () => {
    const { getByText } = render(<MyComponent />);
    expect(getByText('Hello')).toBeInTheDocument();
  });
});
```

### Adding E2E Tests

1. Create a new file in `tests/e2e/` with `.spec.ts` extension
2. Import Playwright test utilities:
   ```typescript
   import { test, expect } from '@playwright/test';
   ```
3. Write test cases using Playwright's API
4. See [tests/e2e/README.md](./e2e/README.md) for detailed guide

**Example:**
```typescript
import { test, expect } from '@playwright/test';

test.describe('New Page Tests', () => {
  test('should load page', async ({ page }) => {
    await page.goto('/docs/new-page');
    await expect(page.locator('h1')).toContainText('New Page');
  });
});
```

## Best Practices

### Unit Tests

✅ **DO:**
- Test component behavior, not implementation details
- Use `data-testid` for stable selectors
- Mock external dependencies (fetch, timers, etc.)
- Test edge cases and error states
- Keep tests isolated and independent

❌ **DON'T:**
- Test internal state directly
- Rely on component implementation details
- Write tests that depend on execution order
- Test third-party library functionality

### E2E Tests

✅ **DO:**
- Test real user workflows
- Wait for elements before interacting
- Use semantic selectors (role, label, text)
- Test critical paths first
- Filter out non-critical console errors

❌ **DON'T:**
- Test implementation details
- Use brittle selectors (CSS classes, XPath)
- Write overly specific assertions
- Rely on exact timing (use waits instead)

## Continuous Integration

### CI Configuration

Tests should run in CI pipelines:

```yaml
# Example GitHub Actions workflow
- name: Run Unit Tests
  run: npm run test:unit

- name: Install Playwright Browsers
  run: npm run playwright:install

- name: Run E2E Tests
  run: npm run test:e2e
```

### Test Requirements

- ✅ All unit tests must pass
- ✅ All E2E tests must pass
- ✅ No console errors in E2E tests
- ✅ Code coverage goals met (if configured)

## Troubleshooting

### Unit Tests Failing

1. **Check imports** - Ensure aliases (@/, @components, etc.) are working
2. **Check mocks** - Verify fetch, timers, and other mocks are set up
3. **Run in watch mode** - `npm run test:unit:watch` for faster feedback
4. **Check setup file** - Verify `src/setupTests.ts` is configured correctly

### E2E Tests Failing

1. **Check dev server** - Ensure it's running on the correct port
2. **Check baseURL** - Verify URL in `playwright.config.ts`
3. **Run headed** - Use `npm run test:e2e:headed` to see browser
4. **Debug** - Use `npm run test:e2e:debug` to step through tests
5. **Check screenshots** - View failure screenshots in `test-results/`

### Port Conflicts

If you get port errors:
1. Stop other dev servers
2. Update port in configs if needed
3. Set `reuseExistingServer: true` in Playwright config

## Viewing Test Results

### Unit Tests
- Terminal output shows pass/fail
- Use `--reporter=verbose` for detailed output
- Use `--ui` flag for visual test runner

### E2E Tests
- HTML report generated after tests
- View report: `npx playwright show-report`
- Screenshots saved in `test-results/` on failure
- Traces available for debugging retries

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Summary

- **Unit Tests**: Fast, isolated tests for React components
- **E2E Tests**: Real browser tests for documentation site
- **Run All**: `npm run test:all`
- **Watch Mode**: `npm run test:unit:watch` (unit only)
- **Debug**: `npm run test:e2e:debug` (E2E only)

Keep tests maintainable, focused, and valuable! 🎯
