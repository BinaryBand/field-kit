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

// Test wrapper components
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

const TestGroupedInput = (props: any) => (
  <AppContextWrapper>
    <GroupedInput {...props}>
      <GroupedOption value="option1" group="group1">
        Option 1
      </GroupedOption>
      <GroupedOption value="option2" group="group1">
        Option 2
      </GroupedOption>
      <GroupedOption value="option3" group="group2">
        Option 3
      </GroupedOption>
      <GroupedOption value="option4">Ungrouped Option</GroupedOption>
    </GroupedInput>
  </AppContextWrapper>
);

describe('GroupedInput Component', () => {
  const defaultProps = {
    'data-placeholder': 'Select options...',
    'multiple': true,
    'onChange': vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    test('renders with placeholder when no options selected', () => {
      render(<TestGroupedInput {...defaultProps} />);

      const input = screen.getByPlaceholderText('Select options...');
      expect(input).toBeInTheDocument();
    });

    test('renders grouped options when focused', async () => {
      render(<TestGroupedInput {...defaultProps} />);

      const input = screen.getByPlaceholderText('Select options...');
      fireEvent.focus(input);

      await waitFor(() => {
        expect(screen.getByText('group1')).toBeInTheDocument();
        expect(screen.getByText('group2')).toBeInTheDocument();
        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(screen.getByText('Option 2')).toBeInTheDocument();
        expect(screen.getByText('Option 3')).toBeInTheDocument();
        expect(screen.getByText('Ungrouped Option')).toBeInTheDocument();
      });
    });

    test('renders selected tokens for multiple selection', () => {
      render(<TestGroupedInput {...defaultProps} value={['option1', 'option3']} />);

      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 3')).toBeInTheDocument();
    });

    test('displays single selected value in input for non-multiple mode', () => {
      render(<TestGroupedInput {...defaultProps} multiple={false} value="option1" />);

      const input = screen.getByDisplayValue('Option 1');
      expect(input).toBeInTheDocument();
    });
  });

  describe('Option Selection', () => {
    test('selects option when clicked in multiple mode', async () => {
      const onChange = vi.fn();
      render(<TestGroupedInput {...defaultProps} onChange={onChange} />);

      const input = screen.getByPlaceholderText('Select options...');
      fireEvent.focus(input);

      await waitFor(() => {
        const option1 = screen.getByText('Option 1');
        expect(option1).toBeInTheDocument();
      });

      const option1 = screen.getByText('Option 1');
      fireEvent.mouseDown(option1);

      expect(onChange).toHaveBeenCalled();
    });

    test('deselects option when clicked again in multiple mode', async () => {
      const onChange = vi.fn();
      render(<TestGroupedInput {...defaultProps} value={['option1']} onChange={onChange} />);

      const input = screen.getByPlaceholderText('Select options...');
      fireEvent.focus(input);

      await waitFor(() => {
        const option1 = screen.getByText('Option 1');
        expect(option1).toBeInTheDocument();
      });

      const option1 = screen.getByText('Option 1');
      fireEvent.mouseDown(option1);

      expect(onChange).toHaveBeenCalled();
    });

    test('replaces selection in single mode', async () => {
      const onChange = vi.fn();
      render(<TestGroupedInput {...defaultProps} multiple={false} onChange={onChange} />);

      const input = screen.getByPlaceholderText('Select options...');
      fireEvent.focus(input);

      await waitFor(() => {
        const option1 = screen.getByText('Option 1');
        expect(option1).toBeInTheDocument();
      });

      const option1 = screen.getByText('Option 1');
      fireEvent.mouseDown(option1);

      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('Search Functionality', () => {
    test('filters options based on search input', async () => {
      render(<TestGroupedInput {...defaultProps} />);

      const input = screen.getByPlaceholderText('Select options...');
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'Option 1' } });

      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
      });
    });

    test('shows "No Options Available" when no options exist', async () => {
      render(
        <AppContextWrapper>
          <GroupedInput {...defaultProps} />
        </AppContextWrapper>
      );

      const input = screen.getByPlaceholderText('Select options...');
      fireEvent.focus(input);

      await waitFor(() => {
        expect(screen.getByText('No Options Available')).toBeInTheDocument();
      });
    });
  });

  describe('Token Management', () => {
    test('removes token when X button is clicked', () => {
      const onChange = vi.fn();
      render(<TestGroupedInput {...defaultProps} value={['option1']} onChange={onChange} />);

      const removeButton = screen.getByRole('button');
      fireEvent.click(removeButton);

      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('Dropdown Behavior', () => {
    test('opens dropdown when input is focused', async () => {
      render(<TestGroupedInput {...defaultProps} />);

      const input = screen.getByPlaceholderText('Select options...');
      fireEvent.focus(input);

      await waitFor(() => {
        expect(screen.getByText('group1')).toBeInTheDocument();
      });
    });

    test('closes dropdown when input loses focus', async () => {
      render(<TestGroupedInput {...defaultProps} />);

      const input = screen.getByPlaceholderText('Select options...');
      fireEvent.focus(input);

      await waitFor(() => {
        expect(screen.getByText('group1')).toBeInTheDocument();
      });

      fireEvent.blur(input);

      await waitFor(() => {
        expect(screen.queryByText('group1')).not.toBeInTheDocument();
      });
    });

    test('prevents dropdown from closing when option is clicked', async () => {
      render(<TestGroupedInput {...defaultProps} />);

      const input = screen.getByPlaceholderText('Select options...');
      fireEvent.focus(input);

      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
      });

      const option1 = screen.getByText('Option 1');

      // Simulate mousedown event (which should prevent blur)
      fireEvent.mouseDown(option1);

      // Dropdown should still be visible
      expect(screen.getByText('group1')).toBeInTheDocument();
    });
  });

  describe('GroupedOption Component', () => {
    test('registers option with context', () => {
      const mockAddOption = vi.fn();
      const mockContext = {
        options: {},
        addOption: mockAddOption,
      };

      render(
        <GroupedInputContext.Provider value={mockContext}>
          <GroupedOption value="test" group="testGroup">
            Test Option
          </GroupedOption>
        </GroupedInputContext.Provider>
      );

      expect(mockAddOption).toHaveBeenCalledWith('test', 'Test Option', 'testGroup');
    });

    test('registers ungrouped option without group', () => {
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
  });

  describe('Edge Cases', () => {
    test('handles undefined value prop', () => {
      expect(() => {
        render(<TestGroupedInput {...defaultProps} value={undefined} />);
      }).not.toThrow();
    });

    test('handles empty string value', () => {
      expect(() => {
        render(<TestGroupedInput {...defaultProps} value="" />);
      }).not.toThrow();
    });

    test('handles numeric value', () => {
      expect(() => {
        render(<TestGroupedInput {...defaultProps} value={123} />);
      }).not.toThrow();
    });

    test('handles array value in non-multiple mode', () => {
      render(<TestGroupedInput {...defaultProps} multiple={false} value={['option1']} />);

      const input = screen.getByDisplayValue('Option 1');
      expect(input).toBeInTheDocument();
    });
  });
});
