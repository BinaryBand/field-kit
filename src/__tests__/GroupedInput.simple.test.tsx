import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import GroupedInput, { GroupedOption } from '@/views/main/GroupedInput';
import GroupedInputContext from '@providers/GroupedInputContext';
import AppContext from '@providers/AppContext';

// Mock the debounce hook to avoid timing issues in tests
vi.mock('use-debounce', () => ({
  useDebounce: vi.fn((value) => [value, value]),
}));

// Mock the tools
vi.mock('@tools/events', () => ({
  createChangeEvent: vi.fn(() => ({
    target: { value: '' },
    type: 'change',
  })),
}));

vi.mock('@tools/ref', () => ({
  useMergedRef: vi.fn(() => vi.fn()),
}));

vi.mock('@tools/misc', () => ({
  tryParse: vi.fn((value) => {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }),
}));

// Test wrapper component
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
  
  return (
    <AppContext.Provider value={mockAppContext}>
      {children}
    </AppContext.Provider>
  );
};

describe('GroupedInput Basic Tests', () => {
  const defaultProps = {
    'data-placeholder': 'Select options...',
    multiple: true,
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders without crashing', () => {
    expect(() => {
      render(
        <AppContextWrapper>
          <GroupedInput {...defaultProps} />
        </AppContextWrapper>
      );
    }).not.toThrow();
  });

  test('renders with children', () => {
    expect(() => {
      render(
        <AppContextWrapper>
          <GroupedInput {...defaultProps}>
            <GroupedOption value="test">Test Option</GroupedOption>
          </GroupedInput>
        </AppContextWrapper>
      );
    }).not.toThrow();
  });

  test('handles undefined value prop', () => {
    expect(() => {
      render(
        <AppContextWrapper>
          <GroupedInput {...defaultProps} value={undefined} />
        </AppContextWrapper>
      );
    }).not.toThrow();
  });

  test('handles empty string value', () => {
    expect(() => {
      render(
        <AppContextWrapper>
          <GroupedInput {...defaultProps} value="" />
        </AppContextWrapper>
      );
    }).not.toThrow();
  });

  test('handles array value', () => {
    expect(() => {
      render(
        <AppContextWrapper>
          <GroupedInput {...defaultProps} value={['option1']} />
        </AppContextWrapper>
      );
    }).not.toThrow();
  });

  test('handles number value', () => {
    expect(() => {
      render(
        <AppContextWrapper>
          <GroupedInput {...defaultProps} value={123} />
        </AppContextWrapper>
      );
    }).not.toThrow();
  });

  test('GroupedOption registers with context', () => {
    const mockAddOption = vi.fn();
    const mockContext = {
      options: {},
      addOption: mockAddOption,
    };

    render(
      <GroupedInputContext.Provider value={mockContext}>
        <GroupedOption value="test" group="group1">Test Option</GroupedOption>
      </GroupedInputContext.Provider>
    );

    expect(mockAddOption).toHaveBeenCalledWith('test', 'Test Option', 'group1');
  });

  test('GroupedOption registers without group', () => {
    const mockAddOption = vi.fn();
    const mockContext = {
      options: {},
      addOption: mockAddOption,
    };

    render(
      <GroupedInputContext.Provider value={mockContext}>
        <GroupedOption value="test">Test Option</GroupedOption>
      </GroupedInputContext.Provider>
    );

    expect(mockAddOption).toHaveBeenCalledWith('test', 'Test Option', undefined);
  });

  test('renders placeholder when no value', () => {
    render(
      <AppContextWrapper>
        <GroupedInput {...defaultProps} />
      </AppContextWrapper>
    );

    const input = screen.getByPlaceholderText('Select options...');
    expect(input).toBeInTheDocument();
  });

  test('renders with className prop', () => {
    const { container } = render(
      <AppContextWrapper>
        <GroupedInput {...defaultProps} className="test-class" />
      </AppContextWrapper>
    );

    expect(container.querySelector('.test-class')).toBeInTheDocument();
  });
});