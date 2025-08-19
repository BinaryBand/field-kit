import { render, screen } from '@testing-library/react';
import { act } from '@testing-library/react';
import { vi } from 'vitest';

import App from '@/App';
import init from '@/index';
import { html } from '@/controllers/utils';

// Global cleanup for tests
let cleanupRender: (() => void) | undefined;
afterEach(async () => {
  await act(async () => {
    /** nothing to do here, just await to flush */
  });

  cleanupRender?.();
  vi.clearAllMocks();
});

// Mock the components that `init` will render
vi.mock('@components/ListInput', () => ({
  default: () => <div data-testid="list-input"></div>,
}));

describe('init function', () => {
  // Use a beforeEach hook to reset the DOM for each test
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('should render a ListInput with the correct initial value', async () => {
    // Arrange: Set up the DOM and get a reference to the native element.
    const initialValue = JSON.stringify(['item1', 'item2', 'item3']);
    document.body.innerHTML = html`
      <div>
        <input id="list-input-native" name="ListInput" type="list" value=${initialValue} />
      </div>
    `;
    const nativeInput = document.querySelector<HTMLInputElement>('#list-input-native')!;

    // Act: Render the app and initialize the custom components.
    const { unmount } = render(<App root={document.body} />);
    cleanupRender = unmount;

    await act(async () => init(document.body));

    // Assert: Check that the React component is rendered and the native value is correct.
    const listInputComponent = screen.getByTestId('list-input');
    expect(listInputComponent).toBeInTheDocument();
    expect(nativeInput.value).toBe(initialValue);
  });

  test('should render a PinInput with the correct initial value', async () => {
    // Arrange: Set up the DOM and get a reference to the native element.
    const initialValue = '123456';
    document.body.innerHTML = html`
      <div>
        <input id="pin-input-native" name="Pin" type="pin" value=${initialValue} />
      </div>
    `;
    const nativeInput = document.querySelector<HTMLInputElement>('#pin-input-native')!;

    // Act: Render the app and initialize the custom components.
    const { unmount } = render(<App root={document.body} />);
    cleanupRender = unmount;

    await act(async () => init(document.body));

    // Assert: Check that the React component is rendered and the native value is correct.
    const pinInputComponent = screen.getByTestId('pin-input');
    expect(pinInputComponent).toBeInTheDocument();
    expect(nativeInput.value).toBe(initialValue);
  });
});
