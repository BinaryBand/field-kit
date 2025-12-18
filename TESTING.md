# Testing Quick Reference

## Quick Start

### Run All Tests (Recommended)

```bash
# Terminal 1: Start the dev server
npm run docs:dev

# Terminal 2: Run all tests
npm run test:all
```

### Run Unit Tests Only

```bash
npm run test:unit
```

### Run E2E Tests Only

```bash
# Make sure dev server is running first!
npm run test:e2e
```

## Test Commands Cheat Sheet

### Unit Tests (Vitest)
```bash
npm run test:unit           # Run once
npm run test:unit:watch     # Watch mode (auto-rerun)
npm run test:unit:ui        # Visual UI interface
npm test                    # Same as test:unit
```

### E2E Tests (Playwright)
```bash
npm run test:e2e            # Headless mode
npm run test:e2e:ui         # Interactive UI
npm run test:e2e:headed     # Visible browser
npm run test:e2e:debug      # Debug mode
npm run test:e2e:report     # View last report
```

### Combined
```bash
npm run test:all            # Unit + E2E (needs dev server running)
npm run test:all:ci         # Auto-starts server (CI/CD)
```

## First Time Setup

```bash
# Install Playwright browsers
npm run playwright:install
```

## Common Workflows

### During Development
```bash
# Terminal 1
npm run docs:dev

# Terminal 2 - Keep this open for testing
npm run test:unit:watch     # Auto-runs on file changes
```

### Before Committing
```bash
# Terminal 1
npm run docs:dev

# Terminal 2
npm run test:all            # Verify all tests pass
```

### CI/CD Pipeline
```bash
npm run test:all:ci         # Automatically starts/stops server
```

## Troubleshooting

### E2E Tests Timeout
**Problem:** Tests fail with "Timed out waiting 120000ms"

**Solution:** 
1. Make sure dev server is running: `npm run docs:dev`
2. Then run tests in another terminal: `npm run test:e2e`
3. Or use `npm run test:all:ci` to auto-start (slower)

### Port Already in Use
**Problem:** Port 5175 is already in use

**Solution:**
- The tests will reuse the existing server (this is good!)
- If you need to stop it: Close the terminal running `docs:dev`

### Tests Pass Locally But Fail in CI
**Problem:** E2E tests work locally but fail in CI

**Solution:**
- Use `npm run test:all:ci` in CI - it auto-manages the server
- Set `CI=true` environment variable
- Increase timeout in `playwright.config.ts` if needed

## Test Structure

```
tests/
├── unit/          # 41 tests - React component tests
│   ├── Form.test.tsx (6 tests)
│   ├── GroupedInput.test.tsx (19 tests)
│   ├── GroupedInput.simple.test.tsx (10 tests)
│   ├── init.test.tsx (2 tests)
│   └── Pin.test.tsx (4 tests)
└── e2e/           # 11 tests - Browser tests
    └── demo.spec.ts (11 tests)
```

## What Gets Tested

### Unit Tests ✅
- Form submission and data handling
- Grouped select inputs
- PIN input functionality
- Component initialization
- Edge cases and validation

### E2E Tests ✅
- Documentation site loads correctly
- All interactive components render
- Value tracking works (useFormTracking)
- User interactions (clicks, typing, selections)
- No console errors
- Proper styling applied

## Total Test Count

- **Unit Tests:** 41 tests in 5 files
- **E2E Tests:** 11 tests in 1 file
- **Total:** 52 comprehensive tests

## Documentation

- Full guide: `tests/README.md`
- E2E details: `tests/e2e/README.md`
- This file: Quick reference only

---

**Pro Tip:** Keep the dev server running while developing and use watch mode for unit tests to get instant feedback!
