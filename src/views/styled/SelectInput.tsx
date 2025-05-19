import { ComponentProps } from 'react';
import styled, { StyledComponent } from '@emotion/styled';
import Overlay from '@inline/Overlay';

export const SelectInputContainer: StyledComponent<ComponentProps<'div'>> = styled.div`
  border: transparent;

  align-items: center;
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  gap: 0.5em;
  position: relative;

  &:not([data-multiple]) > div.token {
    display: none !important;
  }
`;

export const SelectOverlay: StyledComponent<OverlayProps> = styled(Overlay)`
  align-items: center;
  display: flex;
  justify-content: end;
  gap: 0.5em;
  padding-right: 0.5em;
`;
