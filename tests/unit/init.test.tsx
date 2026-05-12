import { render } from '@testing-library/react';
import { act } from '@testing-library/react';
import { vi } from 'vitest';

import App from '@/App';
import init from '@/index';

// Global cleanup for tests
let cleanupRender: (() => void) | undefined;
afterEach(async () => {
  await act(async () => {
    /** nothing to do here, just await to flush */
  });

  cleanupRender?.();
  vi.clearAllMocks();
});

describe('init function', () => {
  // Use a beforeEach hook to reset the DOM for each test
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('should preserve direct tw-list elements when initializing', async () => {
    const initialValue = JSON.stringify(['item1', 'item2', 'item3']);
    document.body.innerHTML = `
      <div>
        <tw-list id="list-input-native" name="ListInput" value='${initialValue}'></tw-list>
      </div>
    `;

    // Act: Initialize the app.
    const { unmount } = render(<App root={document.body} />);
    cleanupRender = unmount;

    await act(async () => init(document.body));

    const listElement = document.querySelector('tw-list#list-input-native') as HTMLElement | null;
    expect(listElement).toBeInTheDocument();
    expect(listElement?.getAttribute('value')).toBe(initialValue);
  });

  test('should preserve direct tw-pin elements when initializing', async () => {
    const initialValue = '123456';
    document.body.innerHTML = `
      <div>
        <tw-pin id="pin-input-native" name="Pin" value="${initialValue}" data-size="6"></tw-pin>
      </div>
    `;

    // Act: Initialize the app.
    const { unmount } = render(<App root={document.body} />);
    cleanupRender = unmount;

    await act(async () => init(document.body));

    const pinElement = document.querySelector('tw-pin#pin-input-native') as HTMLElement | null;
    expect(pinElement).toBeInTheDocument();
    expect(pinElement?.getAttribute('value')).toBe(initialValue);
  });
});
