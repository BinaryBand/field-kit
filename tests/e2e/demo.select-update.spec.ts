import { test, expect } from '@playwright/test';

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

  // Only serve GET/HEAD.
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
  // This demo page loads the prebuilt UMD bundle.
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

test('demo.html: updating selects via JS updates underlying select state', async ({ page }) => {
  await page.goto(`${serverBaseURL}/tests/demo.html`);

  // Wait until the library finishes initializing (DOM markers).
  await page.waitForSelector('._tw-wrapper', { state: 'attached' });
  await page.waitForSelector('#single-select[data-tw-proxy="true"]', { state: 'attached' });

  // Helpers: choose the *original* select, and the React proxy select.
  const getNative = (id: string) => `${id}:not([data-tw-proxy])`;
  const getProxy = (id: string) => `${id}[data-tw-proxy="true"]`;

  // Single select: drive the TW UI (focus input + mousedown option).
  await page.evaluate(async () => {
    const native = document.querySelector<HTMLSelectElement>('#single-select:not([data-tw-proxy])');
    if (!native) throw new Error('single-select (native) not found');

    const wrapper = native.previousElementSibling as HTMLElement | null;
    if (!wrapper?.classList.contains('_tw-wrapper')) throw new Error('single-select wrapper not found');

    const input = wrapper.querySelector<HTMLInputElement>('input[type="text"]');
    if (!input) throw new Error('single-select proxy input not found');
    input.focus();

    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

    const dropdown = document.querySelector<HTMLElement>('[data-testid="select-dropdown"]:not([hidden])');
    if (!dropdown) throw new Error('single-select dropdown not found');

    const option = dropdown.querySelector<HTMLElement>('[data-option-value="Option 3"]');
    if (!option) throw new Error('Option 3 toggle not found');
    option.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
  });

  await expect(page.locator(getNative('#single-select'))).toHaveValue('Option 3');
  await expect(page.locator(getProxy('#single-select'))).toHaveValue('Option 3');

  // Multi select: pick two options (dropdown closes after each pick).
  await page.evaluate(async () => {
    const native = document.querySelector<HTMLSelectElement>('#multi-select:not([data-tw-proxy])');
    if (!native) throw new Error('multi-select (native) not found');

    const wrapper = native.previousElementSibling as HTMLElement | null;
    if (!wrapper?.classList.contains('_tw-wrapper')) throw new Error('multi-select wrapper not found');

    const input = wrapper.querySelector<HTMLInputElement>('input[type="text"]');
    if (!input) throw new Error('multi-select proxy input not found');

    const pick = (value: string) => {
      input.focus();
      return new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          const dropdown = document.querySelector<HTMLElement>('[data-testid="select-dropdown"]:not([hidden])');
          if (!dropdown) throw new Error('multi-select dropdown not found');

          const option = dropdown.querySelector<HTMLElement>(`[data-option-value="${value}"]`);
          if (!option) throw new Error(`Option ${value} toggle not found`);
          option.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
          resolve();
        });
      });
    };

    const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

    // Demo starts with Option A and Option C selected.
    await pick('Option A');
    await sleep(100);
    await pick('Option C');
    await sleep(100);
    await pick('Option B');
    await sleep(100);
    await pick('Option D');
  });

  await expect(page.locator(getNative('#multi-select'))).toHaveValues(['Option B', 'Option D']);
  await expect(page.locator(getProxy('#multi-select'))).toHaveValues(['Option B', 'Option D']);
});
