import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import SelectInput, { GroupedOption } from '@/components/SelectInput';
import AppContext from '@providers/AppContext';

// Match the existing unit-test strategy: avoid debounce timing complexity.
vi.mock('use-debounce', () => ({
  useDebounce: vi.fn((value) => [value, value]),
}));

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

function renderSelect(props: Partial<SelectInputProps> = {}) {
  const onChange = vi.fn();

  render(
    <AppContextWrapper>
      <SelectInput data-placeholder="Select..." multiple onChange={onChange} {...props}>
        <GroupedOption value="Option A">Option A</GroupedOption>
        <GroupedOption value="Option B">Option B</GroupedOption>
        <GroupedOption value="Option C">Option C</GroupedOption>
        <GroupedOption value="Option D">Option D</GroupedOption>
      </SelectInput>
    </AppContextWrapper>
  );

  const input = screen.getByPlaceholderText('Select...') as HTMLInputElement;
  const internalSelect = document.querySelector('select[hidden]') as HTMLSelectElement | null;
  if (!internalSelect) throw new Error('internal hidden select not found');

  return { input, internalSelect, onChange };
}

describe('SelectInput (unit)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('multi-select accumulates selections in uncontrolled mode (even with onChange)', async () => {
    const { input, internalSelect } = renderSelect();

    // Select Option B
    fireEvent.focus(input);
    await waitFor(() => expect(document.querySelector('[data-option-value="Option B"]')).toBeInTheDocument());
    fireEvent.mouseDown(document.querySelector('[data-option-value="Option B"]')!);

    // Dropdown closes after pick; refocus to pick again.
    fireEvent.focus(input);
    await waitFor(() => expect(document.querySelector('[data-option-value="Option D"]')).toBeInTheDocument());
    fireEvent.mouseDown(document.querySelector('[data-option-value="Option D"]')!);

    // Tokens should reflect BOTH selections.
    const tokens = document.querySelectorAll('.token');
    expect(tokens).toHaveLength(2);

    const selectedValues = Array.from(internalSelect.selectedOptions).map((o) => o.value).sort();
    expect(selectedValues).toEqual(['Option B', 'Option D'].sort());
  });

  test('multi-select can deselect an already-selected option', async () => {
    const { input, internalSelect } = renderSelect();

    // Select B + D
    fireEvent.focus(input);
    await waitFor(() => expect(document.querySelector('[data-option-value="Option B"]')).toBeInTheDocument());
    fireEvent.mouseDown(document.querySelector('[data-option-value="Option B"]')!);

    fireEvent.focus(input);
    await waitFor(() => expect(document.querySelector('[data-option-value="Option D"]')).toBeInTheDocument());
    fireEvent.mouseDown(document.querySelector('[data-option-value="Option D"]')!);

    // Deselect B
    fireEvent.focus(input);
    await waitFor(() => expect(document.querySelector('[data-option-value="Option B"]')).toBeInTheDocument());
    fireEvent.mouseDown(document.querySelector('[data-option-value="Option B"]')!);

    const tokens = document.querySelectorAll('.token');
    expect(tokens).toHaveLength(1);

    const selectedValues = Array.from(internalSelect.selectedOptions).map((o) => o.value);
    expect(selectedValues).toEqual(['Option D']);
  });

  test('single-select updates internal selection and displayed value', async () => {
    const onChange = vi.fn();

    render(
      <AppContextWrapper>
        <SelectInput data-placeholder="Pick one" multiple={false} onChange={onChange}>
          <GroupedOption value="Option A">Option A</GroupedOption>
          <GroupedOption value="Option B">Option B</GroupedOption>
          <GroupedOption value="Option C">Option C</GroupedOption>
        </SelectInput>
      </AppContextWrapper>
    );

    const input = screen.getByPlaceholderText('Pick one') as HTMLInputElement;

    fireEvent.focus(input);
    await waitFor(() => expect(document.querySelector('[data-option-value="Option C"]')).toBeInTheDocument());
    fireEvent.mouseDown(document.querySelector('[data-option-value="Option C"]')!);

    // The component renders a hidden internal <select> for form submission.
    const internalSelect = document.querySelector('select[hidden]') as HTMLSelectElement;
    expect(internalSelect.value).toBe('Option C');

    // And the text input should show the selected label.
    await waitFor(() => {
      const maybe = document.querySelector('input[type="text"]') as HTMLInputElement | null;
      expect(maybe?.value).toContain('Option C');
    });
  });
});
