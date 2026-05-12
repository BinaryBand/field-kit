import styled from '@emotion/styled';

const Dropdown = styled.div`
  border: 1px solid
    color-mix(in srgb, var(--tw-border-color, currentColor) calc(var(--tw-border-opacity, 0.3) * 100%), transparent);
  border-top: none;
  border-radius: 0 0 0.375rem 0.375rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);

  background-color: inherit;
  color: currentColor;

  overflow-x: hidden;
  overflow-y: scroll;
  z-index: var(--tw-dropdown-z-index, 4);
  left: 0;
  top: 100%;
  position: absolute;
  width: 100%;
  max-height: 256px;

  option {
    background-color: inherit;
    padding: 8px 16px;
    cursor: pointer;

    &:checked,
    &:hover:not(:disabled) {
      background-color: var(--hover-bg-medium);
      color: var(--tw-dropdown-text-color);
    }

    &:disabled {
      color: color-mix(in srgb, currentColor 35%, transparent);
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
      color: color-mix(in srgb, currentColor 35%, transparent);
      text-align: center;
      cursor: default;
      font-style: italic;
    }
  }
`;

export default Dropdown;
