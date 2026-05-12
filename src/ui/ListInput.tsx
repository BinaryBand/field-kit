import styled from '@emotion/styled';
import Overlay from '@/bridge/Overlay';

export const ListInputContainer = styled.div`
  box-sizing: border-box;
  min-height: var(--tw-input-min-height, 2.875rem);
  padding: var(--tw-input-padding-block, 0.625rem) var(--tw-input-padding-inline, 0.75rem);
  border: var(--tw-input-border-width, 1px) var(--tw-input-border-style, solid)
    color-mix(
      in srgb,
      var(--tw-border-color, currentColor) calc(var(--tw-border-opacity, 0.3) * 100%),
      transparent
    );
  border-radius: var(--tw-input-border-radius, 0.5rem);
  background-color: var(--tw-input-background, Canvas);
  color: inherit;
  font: inherit;
  line-height: inherit;
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: start;
  gap: 0.5em;

  &:focus-within {
    outline: var(--tw-focus-width, 2px) solid var(--tw-focus-color, currentColor);
    outline-offset: var(--tw-focus-offset, 2px);
  }
`;

export const StyledListInput = styled.input`
  box-sizing: border-box;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: 0 !important;
  background: transparent !important;
  border: none !important;
  color: inherit;
  font: inherit;
  line-height: inherit;
  padding-right: var(--tw-input-padding-inline, 0.75rem);
  padding-bottom: var(--tw-input-padding-block, 0.625rem);
  appearance: none;

  &:focus-visible {
    outline: none !important;
  }
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
    background-color: color-mix(in srgb, var(--tw-token-bg, currentColor) calc(var(--tw-token-opacity, 0.15) * 100%), transparent);
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
  box-sizing: border-box;
  min-width: 8rem;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  line-height: inherit;
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
