import styled from '@emotion/styled';
import Overlay from '@/bridge/Overlay';

export const SelectInputContainer = styled.div`
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
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  gap: 0.5em;
  position: relative;

  &:focus-within {
    outline: var(--tw-focus-width, 2px) solid var(--tw-focus-color, currentColor);
    outline-offset: var(--tw-focus-offset, 2px);
  }

  &:not([data-multiple]) > div.token {
    display: none !important;
  }
`;

export const SelectOverlay = styled(Overlay)`
  align-items: center;
  display: flex;
  justify-content: end;
  gap: 0.5em;
  padding-right: 0.5em;
`;
