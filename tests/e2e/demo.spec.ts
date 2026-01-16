import { test, expect } from '@playwright/test';

test.describe('Docs - Smoke Tests', () => {
  test('should load the docs home page', async ({ page }) => {
    await page.goto('/docs/');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveTitle(/TW Components/);
    await expect(page.locator('h1')).toContainText('TW Components');
    await expect(page.locator('h1')).not.toHaveText('404');
  });

  test('should load key docs routes (not 404)', async ({ page }) => {
    const cases: Array<{ route: string; heading: string }> = [
      { route: '/docs/', heading: 'TW Components' },
      { route: '/docs/utilities/form', heading: 'Form Submit Events' },
      { route: '/docs/inputs/pin', heading: 'PIN Input' },
      { route: '/docs/views/calendar', heading: 'Calendar' },
    ];

    for (const { route, heading } of cases) {
      await page.goto(route);
      await page.waitForLoadState('networkidle');

      const h1 = page.getByRole('heading', { level: 1 });
      await expect(h1).toBeVisible();
      await expect(h1).toContainText(heading);
      await expect(h1).not.toHaveText('404');
    }
  });

  test('should not log critical console errors on docs home', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto('/docs/');
    await page.waitForLoadState('networkidle');

    const criticalErrors = errors.filter(
      (error) =>
        !error.toLowerCase().includes('favicon') &&
        !error.includes('net::ERR_ABORTED') &&
        !error.includes("Content Security Policy directive 'frame-ancestors'") &&
        !error.includes('X-Frame-Options may only be set')
    );

    expect(criticalErrors).toEqual([]);
  });
});
