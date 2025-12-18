import styled from '@emotion/styled';
import Overlay from '@/views/inline/Overlay';

export const ListInputContainer = styled.div`
  padding: 0.2em 0.3em;

  background: none;
  border: transparent;
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: start;
  gap: 0.5em;
`;

export const StyledListInput = styled.input`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: 0 !important;
  background: transparent !important;
  border: none !important;
  outline: none !important;
`;

export const InputToken = styled.div`
  align-items: center;
  border-radius: 16px;
  display: flex;
  gap: 0.3em;
  padding: 0.1em 0.4em;
  position: relative;
  z-index: 3;

  &:not(.option-toggle) {
    border: 1px solid;
  }

  &[data-active='true'] {
    background-color: var(--bs-primary-bg, var(--hover-bg-medium));
  }

  &:hover > svg:last-child {
    background-color: var(--hover-bg-light);
  }

  // Token hover effects for removal indication
  > svg:last-child {
    border-radius: 50%;
    transition: background-color var(--transition-fast);
    box-sizing: content-box;
    padding: 0.15em;
    margin: -0.15em;
  }

  &._tw-placeholder-token {
    pointer-events: none;
    visibility: hidden;
  }
`;

export const HiddenInput = styled.input`
  pointer-events: none;
  visibility: hidden;
`;

export const StyledOverlay = styled(Overlay)`
  align-items: center;
  display: flex;
  justify-content: end;
  gap: 0.5em;
  padding-right: 0.5em;

  // Pass parents' background and color to children while hidden
  background-color: inherit;
  color: currentColor;
  visibility: hidden;
  > * {
    visibility: visible;
  }
`;
