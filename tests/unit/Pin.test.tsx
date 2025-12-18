// src/__tests__/PinInput.test.tsx
import { render, screen, fireEvent, act } from '@testing-library/react';
import { vi } from 'vitest';

import PinInput from '@components/PinInput';

// Mock the useMergedRef utility since it's an external dependency.
vi.mock('@/controllers/utils', () => ({
  createChangeEvent: vi.fn((target, value) => ({
    target,
    currentTarget: target,
    type: 'change',
    bubbles: true,
    cancelable: false,
    defaultPrevented: false,
    nativeEvent: {},
    isDefaultPrevented: () => false,
    isPropagationStopped: () => false,
    persist: () => {},
    preventDefault: () => {},
    stopPropagation: () => {},
    value,
  })),
  useMergedRef: vi.fn(),
}));

describe('PinInput Component', () => {
  // A helper function to find all the pin input fields
  const getPinInputs = () => screen.getAllByDisplayValue<HTMLInputElement>(/.*/);

  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
  });

  test('should allow a user to type digits and move to the next field', async () => {
    render(<PinInput />);
    const inputs = getPinInputs();

    // Act: Type '1' in the first input
    await act(async () => fireEvent.change(inputs[0], { target: { value: '1' } }));

    // Assert: The first input should have '1' and focus should be on the second
    expect(inputs[0].value).toBe('1');
    expect(inputs[1]).toHaveFocus();

    // Act: Type '2' in the second input
    await act(async () => fireEvent.change(inputs[1], { target: { value: '2' } }));

    // Assert: The second input should have '2' and focus should be on the third
    expect(inputs[1].value).toBe('2');
    expect(inputs[2]).toHaveFocus();
  });

  test('should handle backspace and delete keys correctly', async () => {
    render(<PinInput defaultValue="123" />);
    const inputs = getPinInputs();

    // Act: Press Backspace in the third input
    await act(async () => inputs[2].focus());
    await act(async () => fireEvent.keyDown(inputs[2], { key: 'Backspace' }));

    // Assert: The third input should be cleared, and focus should move to the second
    expect(inputs[2].value).toBe('');
    expect(inputs[1]).toHaveFocus();

    // Act: Press Delete in the second input
    await act(async () => fireEvent.keyDown(inputs[1], { key: 'Delete' }));

    // Assert: The second input should be cleared, and focus should remain on it
    expect(inputs[1].value).toBe('');
    expect(inputs[1]).toHaveFocus();
  });

  test('should handle pasting a string of digits', async () => {
    render(<PinInput />);
    const inputs = getPinInputs();
    inputs[0].focus();

    // Act: Paste '123456' into the first input
    await act(async () => {
      fireEvent.paste(inputs[0], {
        clipboardData: {
          getData: () => '123456',
        },
      });
    });

    // Assert: All inputs should be filled, and the last input should be focused
    expect(inputs.map((input) => input.value).join('')).toBe('123456');
    expect(inputs[5]).toHaveFocus();
  });

  test('should handle pasting a string of digits with an offset', async () => {
    // 1. Arrange: Render the component
    const { unmount } = render(<PinInput />);
    const inputs = screen.getAllByRole<HTMLInputElement>('textbox');

    // Act: Manually set the focus to the third input
    await act(async () => inputs[2].focus());

    // Act: Simulate pasting '789' into the third input
    await act(async () => {
      fireEvent.paste(inputs[2], {
        clipboardData: {
          getData: () => '789',
        },
      });
    });

    // Assert: The inputs should be filled starting from the third position.
    expect(inputs.map((input) => input.value || ' ').join('')).toBe('  789 ');

    // The active index should be at the end of the pasted digits.
    expect(inputs[5]).toHaveFocus();

    unmount();
  });
});
