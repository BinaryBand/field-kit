import { defineConfig, devices } from '@playwright/test';

// Minimal config for running tests against the static demo server (py -m http.server).
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: 0,
  reporter: [['line']],
  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:4173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'py -m http.server 4173',
    cwd: '..',
    url: 'http://localhost:4173/tests/demo.html',
    reuseExistingServer: true,
    timeout: 60_000,
    stderr: 'pipe',
    stdout: 'pipe',
  },
});
