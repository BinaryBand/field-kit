import { ComponentProps } from 'react';
import styled, { StyledComponent } from '@emotion/styled';
import Overlay from '@/views/inline/Overlay';

export const ListInputContainer: StyledComponent<ComponentProps<'div'>> = styled.div`
  background: none;
  border: transparent;
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: start;
  gap: 0.5em;
`;

export const StyledListInput: StyledComponent<ComponentProps<'input'>> = styled.input`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  padding-left: ${(props) => props.style?.paddingLeft ?? 0}px !important;
  padding-top: ${(props) => props.style?.paddingTop ?? 0}px !important;
  margin: 0 !important;
`;

export const InputToken: StyledComponent<ComponentProps<'div'>> = styled.div`
  align-items: center;
  border: 1px solid;
  border-radius: 12px;
  display: flex;
  gap: 0.3em;
  padding: 0.1em 0.5em;
  position: relative;
  z-index: 3;

  &._tw-placeholder-token {
    pointer-events: none;
    visibility: hidden;
  }
`;

export const HiddenInput: StyledComponent<ComponentProps<'input'>> = styled.input`
  pointer-events: none;
  visibility: hidden;
`;

export const StyledOverlay: StyledComponent<OverlayProps> = styled(Overlay)`
  align-items: center;
  display: flex;
  justify-content: end;
  gap: 0.5em;
  padding-right: 0.5em;
`;
