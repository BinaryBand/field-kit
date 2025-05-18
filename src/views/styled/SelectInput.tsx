import { ComponentProps } from 'react';
import styled, { StyledComponent } from '@emotion/styled';
import Overlay from '@inline/Overlay';

export const ListInputContainer: StyledComponent<ComponentProps<'div'>> = styled.div`
  border: transparent;

  align-items: center;
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  gap: 0.5em;
  position: relative;

  &:not([data-multiple]) > div.token {
    display: none;
  }
`;

export const SelectInput: StyledComponent<ComponentProps<'input'>> = styled.input`
  pointer-events: none;
  visibility: hidden;
`;

export const SelectReference: StyledComponent<ComponentProps<'input'>> = styled.input`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  padding-left: ${(props) => props.style?.paddingLeft ?? 0}px !important;
  padding-top: ${(props) => props.style?.paddingTop ?? 0}px !important;
  margin: 0 !important;
`;

export const SelectOverlay: StyledComponent<OverlayProps> = styled(Overlay)`
  align-items: center;
  display: flex;
  justify-content: end;
  gap: 0.5em;
  padding-right: 0.5em;
`;

export const SelectDropdown: StyledComponent<ComponentProps<'div'>> = styled.div`
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
