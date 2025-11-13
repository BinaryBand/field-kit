import { ComponentProps } from 'react';
import styled, { StyledComponent } from '@emotion/styled';

const Dropdown: StyledComponent<ComponentProps<'div'>> = styled.div`
  /* Define CSS variables with system color fallbacks */
  --tw-dropdown-bg: var(--bs-body-bg, Canvas);
  --tw-dropdown-border-color: var(
    --bs-border-color-translucent,
    color-mix(in srgb, currentColor 20%, transparent)
  );
  --tw-dropdown-text-color: var(--bs-body-color, CanvasText);
  --tw-dropdown-hover-bg: var(--bs-secondary-bg, color-mix(in srgb, currentColor 8%, transparent));
  --tw-dropdown-disabled-color: var(
    --bs-secondary-color,
    color-mix(in srgb, currentColor 35%, transparent)
  );

  background-color: var(--tw-dropdown-bg);
  border: 1px solid var(--tw-dropdown-border-color);
  border-top: none;
  border-radius: 0 0 0.375rem 0.375rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);

  overflow-x: hidden;
  overflow-y: scroll;
  z-index: 4;
  left: 0;
  top: 100%;
  position: absolute;
  width: 100%;
  max-height: 256px;

  option {
    background-color: inherit;
    color: var(--tw-dropdown-text-color);
    padding: 8px 16px;
    cursor: pointer;

    &:checked,
    &[data-selected='true'],
    &:hover:not(:disabled) {
      background-color: var(--tw-dropdown-hover-bg);
      color: var(--tw-dropdown-text-color);
    }

    &:disabled {
      color: var(--tw-dropdown-disabled-color);
      cursor: not-allowed;
    }

    &._tw-no-options,
    &[data-blurred='true'],
    &[value=''] {
      display: none;
    }
  }

  /* Show the "no options" message only when no other options are visible */
  &:not(:has(option[data-blurred='false'])) {
    & > option._tw-no-options {
      display: block;
      color: var(--tw-dropdown-disabled-color);
      text-align: center;
      cursor: default;
      font-style: italic;
    }
  }
`;

export default Dropdown;
