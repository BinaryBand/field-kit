import { ComponentProps } from 'react';
import styled, { StyledComponent } from '@emotion/styled';

const Dropdown: StyledComponent<ComponentProps<'div'>> = styled.div`
  overflow-x: hidden;
  overflow-y: scroll;
  z-index: 4;
  left: 0;
  top: 100%;
  position: absolute;
  width: 100%;

  option {
    background-color: inherit;
    color: inherit;
    padding: 4px 6px;

    &:checked,
    &:hover:not(:disabled) {
      background-color: rgba(var(--bs-gray-500-rgb, 128, 128, 128), 0.5);
    }

    &._tw-no-options,
    &[data-blurred='true'],
    &[value=''] {
      display: none;
    }
  }

  &:not(:has(option[data-blurred='false'])) {
    & > option._tw-no-options {
      display: block;
    }
  }
`;

export default Dropdown;
