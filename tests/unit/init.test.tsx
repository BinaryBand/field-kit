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

  test('should upgrade legacy input[type=list] to tw-list and preserve value', async () => {
    // Arrange: Set up the DOM with legacy markup.
    const initialValue = JSON.stringify(['item1', 'item2', 'item3']);
    document.body.innerHTML = `
      <div>
        <input id="list-input-native" name="ListInput" type="list" value=${initialValue} />
      </div>
    `;

    // Act: Initialize the app.
    const { unmount } = render(<App root={document.body} />);
    cleanupRender = unmount;

    await act(async () => init(document.body));

    // Assert: the legacy input was replaced by tw-list with the same id/value.
    const listElement = document.querySelector('tw-list#list-input-native') as HTMLElement | null;
    expect(listElement).toBeInTheDocument();
    expect(listElement?.getAttribute('value')).toBe(initialValue);
  });

  test('should upgrade legacy input[type=pin] to tw-pin and preserve value', async () => {
    // Arrange: Set up the DOM with legacy markup.
    const initialValue = '123456';
    document.body.innerHTML = `
      <div>
        <input id="pin-input-native" name="Pin" type="pin" value=${initialValue} />
      </div>
    `;

    // Act: Initialize the app.
    const { unmount } = render(<App root={document.body} />);
    cleanupRender = unmount;

    await act(async () => init(document.body));

    // Assert: the legacy input was replaced by tw-pin with the same id/value.
    const pinElement = document.querySelector('tw-pin#pin-input-native') as HTMLElement | null;
    expect(pinElement).toBeInTheDocument();
    expect(pinElement?.getAttribute('value')).toBe(initialValue);
  });
});
