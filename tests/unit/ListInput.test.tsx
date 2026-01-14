import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

import ListInput from '@/views/main/ListInput';
import AppContext from '@providers/AppContext';

// Mock the debounce hook to avoid timing issues in tests
vi.mock('use-debounce', () => ({
  useDebounce: vi.fn((value) => [value, value]),
}));

// Mock the tools to keep the unit test focused
vi.mock('@tools/events', () => ({
  createChangeEvent: vi.fn((target, value) => ({
    target: { ...target, value },
    type: 'change',
  })),
}));

vi.mock('@tools/ref', () => ({
  useMergedRef: vi.fn((...refs) => (el: any) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') ref(el);
      else if (ref) ref.current = el;
    });
  }),
}));

vi.mock('@tools/misc', () => ({
  tryParse: vi.fn((value) => {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }),
}));

const AppContextWrapper = ({ children }: { children: React.ReactNode }) => {
  const mockRoot = document.createElement('div');
  const mockAppContext: IAppContext = {
    root: mockRoot,
    updateTrigger: 0,
    scrollHeight: 768,
    scrollWidth: 1024,
    pageWidth: 1024,
    pageHeight: 768,
  };

  return <AppContext.Provider value={mockAppContext}>{children}</AppContext.Provider>;
};

describe('ListInput Component', () => {
  test('adds a token on Enter (uncontrolled mode)', () => {
    render(
      <AppContextWrapper>
        <ListInput placeholder="Add item" />
      </AppContextWrapper>
    );

    const textInput = screen.getByPlaceholderText('Add item') as HTMLInputElement;

    fireEvent.change(textInput, { target: { value: 'alpha' } });
    fireEvent.keyDown(textInput, { key: 'Enter', code: 'Enter' });

    expect(screen.getByText('alpha')).toBeInTheDocument();
  });

  test('does not add a token when input is empty', () => {
    render(
      <AppContextWrapper>
        <ListInput placeholder="Add item" />
      </AppContextWrapper>
    );

    const textInput = screen.getByPlaceholderText('Add item') as HTMLInputElement;

    fireEvent.change(textInput, { target: { value: '' } });
    fireEvent.keyDown(textInput, { key: 'Enter', code: 'Enter' });

    expect(document.querySelectorAll('.token')).toHaveLength(0);
  });
});
