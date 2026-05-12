import { test, expect } from '@playwright/test';

test.describe('Demo — Integration smoke (demo.html)', () => {
  // Minimal static server and helpers (same pattern used by other demos)
  let serverBaseURL: string;
  let server: ReturnType<typeof import('node:http').createServer> | undefined;

  test.beforeAll(async () => {
    const { createServer } = await import('node:http');
    const fs = await import('node:fs');
    const path = await import('node:path');
    const { fileURLToPath } = await import('node:url');
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const repoRoot = path.resolve(__dirname, '../..');

    function contentType(filePath: string): string {
      const ext = path.extname(filePath).toLowerCase();
      switch (ext) {
        case '.html':
          return 'text/html; charset=utf-8';
        case '.js':
          return 'text/javascript; charset=utf-8';
        case '.css':
          return 'text/css; charset=utf-8';
        case '.map':
          return 'application/json; charset=utf-8';
        case '.svg':
          return 'image/svg+xml';
        case '.png':
          return 'image/png';
        default:
          return 'application/octet-stream';
      }
    }

    function serveStatic(req: import('node:http').IncomingMessage, res: import('node:http').ServerResponse) {
      const url = new URL(req.url ?? '/', 'http://localhost');
      const pathname = decodeURIComponent(url.pathname);
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.statusCode = 405;
        res.end('Method Not Allowed');
        return;
      }

      const resolved = path.resolve(repoRoot, `.${pathname}`);
      if (!resolved.startsWith(repoRoot) || !fs.existsSync(resolved) || fs.statSync(resolved).isDirectory()) {
        res.statusCode = 404;
        res.end('Not Found');
        return;
      }

      res.setHeader('Content-Type', contentType(resolved));
      if (req.method === 'HEAD') return res.end();
      fs.createReadStream(resolved).pipe(res);
    }

    const distBundle = path.join(repoRoot, 'dist', 'main.umd.js');
    if (!fs.existsSync(distBundle)) test.skip(true, 'dist/main.umd.js missing; run `npm run build` first');

    server = createServer(serveStatic);
    await new Promise<void>((resolve) => server!.listen(0, '127.0.0.1', () => resolve()));
    const addr = server.address();
    if (!addr || typeof addr === 'string') throw new Error('Failed to bind test server');
    serverBaseURL = `http://127.0.0.1:${(addr as any).port}`;
  });

  test.afterAll(async () => {
    if (!server) return;
    await new Promise<void>((resolve) => server!.close(() => resolve()));
  });

  async function openDropdownFor(page: any, nativeSelector: string) {
    await page.evaluate((sel: string) => {
      const native = document.querySelector(sel);
      const wrapper = native?.previousElementSibling as HTMLElement | null;
      const input = wrapper?.querySelector('input[type="text"]') as HTMLElement | null;
      input?.focus();
    }, nativeSelector);
    await page.waitForSelector('[data-testid="select-dropdown"]:not([hidden])');
  }

  async function pickOption(page: any, optionValue: string) {
    const optionLocator = page.locator(`[data-testid="select-dropdown"]:not([hidden]) [data-option-value="${optionValue}"]`);
    await optionLocator.waitFor({ state: 'attached' });
    await optionLocator.click({ force: true });
  }

  test('demo integrated smoke: list, single and multi select flows', async ({ page }) => {
    await page.goto(`${serverBaseURL}/tests/demo.html`);

    await page.waitForSelector('._tw-wrapper', { state: 'attached' });
    await page.waitForSelector('#form-list:not([data-tw-proxy])', { state: 'attached' });

    // Update list native input
    await page.evaluate(() => {
      const el = document.querySelector<HTMLInputElement>('#form-list:not([data-tw-proxy])');
      if (!el) throw new Error('list native not found');
      el.value = JSON.stringify(['uno', 'tres']);
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });

    await page.waitForFunction(() => {
      const native = document.querySelector('#form-list:not([data-tw-proxy])');
      const wrapper = native?.previousElementSibling as HTMLElement | null;
      return !!wrapper?.querySelector('.token');
    });

    const tokens = await page.evaluate(() => {
      const native = document.querySelector<HTMLInputElement>('#form-list:not([data-tw-proxy])');
      const wrapper = native?.previousElementSibling as HTMLElement | null;
      if (!wrapper) return [] as string[];
      return Array.from(wrapper.querySelectorAll<HTMLDivElement>('.token small')).map((n) => n.textContent?.trim() ?? '');
    });
    expect(tokens).toEqual(expect.arrayContaining(['uno', 'tres']));

    // Single select
    await openDropdownFor(page, '#single-select:not([data-tw-proxy])');
    await pickOption(page, 'Option 1');

    const nativeVal = await page.$eval('#single-select:not([data-tw-proxy])', (s) => (s as HTMLSelectElement).value);
    expect(nativeVal).toBe('Option 1');
    const proxyVal = await page.$eval('#single-select[data-tw-proxy]', (s) => (s as HTMLSelectElement).value);
    expect(proxyVal).toBe('Option 1');

    // Multi select
    await openDropdownFor(page, '#multi-select:not([data-tw-proxy])');
    await pickOption(page, 'Option B');
    await openDropdownFor(page, '#multi-select:not([data-tw-proxy])');
    await pickOption(page, 'Option D');

    const multiNative = await page.$eval('#multi-select:not([data-tw-proxy])', (s) => Array.from((s as HTMLSelectElement).selectedOptions).map((o) => o.value));
    expect(multiNative).toEqual(expect.arrayContaining(['Option B', 'Option D']));
    const multiProxy = await page.$eval('#multi-select[data-tw-proxy]', (s) => Array.from((s as HTMLSelectElement).selectedOptions).map((o) => o.value));
    expect(multiProxy).toEqual(expect.arrayContaining(['Option B', 'Option D']));
  });
});
