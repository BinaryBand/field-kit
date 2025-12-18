import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import SelectInput, { GroupedOption } from '@/views/main/SelectInput';
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

const TestSelectInput = (props: any) => (
  <AppContextWrapper>
    <SelectInput {...props}>
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
    </SelectInput>
  </AppContextWrapper>
);

describe('SelectInput Component', () => {
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
      render(<TestSelectInput {...defaultProps} />);

      const input = screen.getByPlaceholderText('Select options...');
      expect(input).toBeInTheDocument();
    });

    test('renders grouped options when focused', async () => {
      render(<TestSelectInput {...defaultProps} />);

      const input = screen.getByPlaceholderText('Select options...');
      fireEvent.focus(input);

      await waitFor(() => {
        expect(screen.getByText('group1')).toBeInTheDocument();
        expect(screen.getByText('group2')).toBeInTheDocument();

        // Check that all option elements are visible in dropdown
        const visibleOptions = document.querySelectorAll('[data-option-value]:not([hidden])');
        expect(visibleOptions).toHaveLength(4);

        // Check specific options by data attribute
        expect(document.querySelector('[data-option-value="option1"]')).toBeInTheDocument();
        expect(document.querySelector('[data-option-value="option2"]')).toBeInTheDocument();
        expect(document.querySelector('[data-option-value="option3"]')).toBeInTheDocument();
        expect(document.querySelector('[data-option-value="option4"]')).toBeInTheDocument();
      });
    });

    test('renders selected tokens for multiple selection', () => {
      render(<TestSelectInput {...defaultProps} value={['option1', 'option3']} />);

      const tokens = document.querySelectorAll('.token');
      expect(tokens).toHaveLength(2);
      expect(tokens[0].textContent).toContain('Option 1');
      expect(tokens[1].textContent).toContain('Option 3');
    });

    test('displays single selected value in input for non-multiple mode', () => {
      render(<TestSelectInput {...defaultProps} multiple={false} value="option1" />);

      const input = screen
        .getAllByDisplayValue('Option 1')
        .find((el) => el.tagName === 'INPUT' && !el.hasAttribute('readonly'));
      expect(input).toBeInTheDocument();
    });
  });

  describe('Option Selection', () => {
    test('selects option when clicked in multiple mode', async () => {
      const onChange = vi.fn();
      render(<TestSelectInput {...defaultProps} onChange={onChange} />);

      const input = screen.getByPlaceholderText('Select options...');
      fireEvent.focus(input);

      await waitFor(() => {
        const dropdownOption = document.querySelector('[data-option-value="option1"]');
        expect(dropdownOption).toBeInTheDocument();
      });

      const option1 = document.querySelector('[data-option-value="option1"]');
      fireEvent.mouseDown(option1!);

      expect(onChange).toHaveBeenCalled();
    });

    test('deselects option when clicked again in multiple mode', async () => {
      const onChange = vi.fn();
      render(<TestSelectInput {...defaultProps} value={['option1']} onChange={onChange} />);

      const input = document.querySelector('.css-13d28j4') as HTMLInputElement;
      fireEvent.focus(input);

      await waitFor(() => {
        const option1 = document.querySelector('[data-option-value=\"option1\"]');
        expect(option1).toBeInTheDocument();
      });

      const option1 = document.querySelector('[data-option-value="option1"]');
      fireEvent.mouseDown(option1!);

      expect(onChange).toHaveBeenCalled();
    });

    test('replaces selection in single mode', async () => {
      const onChange = vi.fn();
      render(<TestSelectInput {...defaultProps} multiple={false} onChange={onChange} />);

      const input = document.querySelector('.css-13d28j4') as HTMLInputElement;
      fireEvent.focus(input);

      await waitFor(() => {
        const option1 = document.querySelector('[data-option-value=\"option1\"]');
        expect(option1).toBeInTheDocument();
      });

      const option1 = document.querySelector('[data-option-value=\"option1\"]');
      fireEvent.mouseDown(option1!);

      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('Search Functionality', () => {
    test('filters options based on search input', async () => {
      render(<TestSelectInput {...defaultProps} />);

      const input = screen.getByPlaceholderText('Select options...');
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'Option 1' } });

      await waitFor(() => {
        const optionElements = screen.getAllByText('Option 1');
        const visibleOption = optionElements.find((el) => !el.closest('select'));
        expect(visibleOption).toBeInTheDocument();
      });
    });

    test('shows "No Options Available" when no options exist', async () => {
      render(
        <AppContextWrapper>
          <SelectInput {...defaultProps} />
        </AppContextWrapper>
      );

      const input = screen.getByPlaceholderText('Select options...');
      fireEvent.focus(input);

      await waitFor(() => {
        expect(screen.getByText('No Options')).toBeInTheDocument();
      });
    });
  });

  describe('Token Management', () => {
    test('removes token when X button is clicked', () => {
      const onChange = vi.fn();
      render(<TestSelectInput {...defaultProps} value={['option1']} onChange={onChange} />);

      const tokenElement = screen.getAllByText('Option 1').find((el) => el.closest('.token'));
      fireEvent.click(tokenElement!.closest('.token')!);

      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('Dropdown Behavior', () => {
    test('opens dropdown when input is focused', async () => {
      render(<TestSelectInput {...defaultProps} />);

      const input = screen.getByPlaceholderText('Select options...');
      fireEvent.focus(input);

      await waitFor(() => {
        expect(screen.getByText('group1')).toBeInTheDocument();
      });
    });

    test('closes dropdown when input loses focus', async () => {
      render(<TestSelectInput {...defaultProps} />);

      const input = screen.getByPlaceholderText('Select options...');
      fireEvent.focus(input);

      await waitFor(() => {
        expect(screen.getByText('group1')).toBeInTheDocument();
      });

      fireEvent.blur(input);

      await waitFor(
        () => {
          const dropdown = screen.getByTestId('select-dropdown');
          expect(dropdown).toHaveAttribute('hidden');
        },
        { timeout: 2000 }
      );
    });

    test('prevents dropdown from closing when option is clicked', async () => {
      render(<TestSelectInput {...defaultProps} />);

      const input = screen.getByPlaceholderText('Select options...');
      fireEvent.focus(input);

      await waitFor(() => {
        expect(screen.getByText('group1')).toBeInTheDocument();
      });

      const option1 = document.querySelector('[data-option-value=\"option1\"]');

      // Simulate mousedown event (which should prevent blur)
      if (option1) {
        fireEvent.mouseDown(option1);
      }

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
        render(<TestSelectInput {...defaultProps} value={undefined} />);
      }).not.toThrow();
    });

    test('handles empty string value', () => {
      expect(() => {
        render(<TestSelectInput {...defaultProps} value="" />);
      }).not.toThrow();
    });

    test('handles numeric value', () => {
      expect(() => {
        render(<TestSelectInput {...defaultProps} value={123} />);
      }).not.toThrow();
    });

    test('handles array value in non-multiple mode', () => {
      render(<TestSelectInput {...defaultProps} multiple={false} value={['option1']} />);

      const input = screen
        .getAllByDisplayValue('Option 1')
        .find((el) => el.tagName === 'INPUT' && !el.hasAttribute('readonly'));
      expect(input).toBeInTheDocument();
    });
  });
});
