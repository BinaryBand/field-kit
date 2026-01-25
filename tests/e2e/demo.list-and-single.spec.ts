import { test } from '@playwright/test';

// Skipped — consolidated into tests/e2e/demo.spec.ts
test.skip(true, 'Consolidated into demo.spec.ts');
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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

function serveStatic(req: IncomingMessage, res: ServerResponse): void {
  const url = new URL(req.url ?? '/', 'http://localhost');
  const pathname = decodeURIComponent(url.pathname);

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.statusCode = 405;
    res.end('Method Not Allowed');
    return;
  }

  const resolved = path.resolve(repoRoot, `.${pathname}`);
  if (!resolved.startsWith(repoRoot)) {
    res.statusCode = 403;
    res.end('Forbidden');
    return;
  }

  if (!fs.existsSync(resolved) || fs.statSync(resolved).isDirectory()) {
    res.statusCode = 404;
    res.end('Not Found');
    return;
  }

  res.statusCode = 200;
  res.setHeader('Content-Type', contentType(resolved));

  if (req.method === 'HEAD') {
    res.end();
    return;
  }

  fs.createReadStream(resolved).pipe(res);
}

let serverBaseURL: string;
let server: ReturnType<typeof createServer> | undefined;

test.beforeAll(async () => {
  const distBundle = path.join(repoRoot, 'dist', 'main.umd.js');
  test.skip(!fs.existsSync(distBundle), 'dist/main.umd.js missing; run `npm run build` first');

  server = createServer(serveStatic);
  await new Promise<void>((resolve) => {
    server!.listen(0, '127.0.0.1', () => resolve());
  });

  const addr = server.address();
  if (!addr || typeof addr === 'string') throw new Error('Failed to bind test server');
  serverBaseURL = `http://127.0.0.1:${addr.port}`;
});

test.afterAll(async () => {
  if (!server) return;
  await new Promise<void>((resolve) => server!.close(() => resolve()));
});

// Helper to wait for the portal dropdown to appear
async function openDropdownFor(page: any, selector: string) {
  await page.evaluate((sel: string) => {
    const native: Element | null = document.querySelector(sel);
    const wrapper: HTMLElement | null = (native?.previousElementSibling as HTMLElement | null);
    const input: HTMLInputElement | null = wrapper?.querySelector('input[type="text"]') as HTMLInputElement | null;
    input?.focus();
  }, selector);

  // wait for dropdown portal
  await page.waitForSelector('[data-testid="select-dropdown"]:not([hidden])');
}

test('demo: list input reflects programmatic change; single select updates via UI', async ({ page }) => {
  await page.goto(`${serverBaseURL}/tests/demo.html`);

  // Wait until inline wrappers attach
  await page.waitForSelector('._tw-wrapper', { state: 'attached' });
  await page.waitForSelector('#form-list:not([data-tw-proxy])', { state: 'attached' });

  // 1) List input: update native value and dispatch change -- component should read it
  await page.evaluate(() => {
    const el = document.querySelector<HTMLInputElement>('#form-list:not([data-tw-proxy])');
    if (!el) throw new Error('list native not found');
    el.value = JSON.stringify(['uno', 'tres']);
    el.dispatchEvent(new Event('change', { bubbles: true }));
  });

  // Wait for tokens to appear in the rendered component (find wrapper then tokens)
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

  // 2) Single select: open proxy dropdown and pick Option 1 using the portal dropdown
  await openDropdownFor(page, '#single-select:not([data-tw-proxy])');

  await page.evaluate(() => {
    const dropdown = document.querySelector<HTMLElement>('[data-testid="select-dropdown"]:not([hidden])');
    if (!dropdown) throw new Error('dropdown not found');
    const opt = dropdown.querySelector<HTMLElement>('[data-option-value="Option 1"]');
    if (!opt) throw new Error('option not found');
    opt.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
  });

  // Assert native hidden select value updated
  const nativeVal = await page.$eval('#single-select:not([data-tw-proxy])', (s) => (s as HTMLSelectElement).value);
  expect(nativeVal).toBe('Option 1');

  // And proxy hidden select should also reflect it
  const proxyVal = await page.$eval('#single-select[data-tw-proxy] ', (s) => (s as HTMLSelectElement).value);
  expect(proxyVal).toBe('Option 1');
});
