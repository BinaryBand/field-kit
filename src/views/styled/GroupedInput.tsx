import { ComponentProps } from 'react';
import styled, { StyledComponent } from '@emotion/styled';

export const GroupedInputContainer: StyledComponent<ComponentProps<'div'>> = styled.div`
  .group-container {
    position: relative;
  }

  .group-separator {
    border: none;
    border-top: 1px solid currentColor;
    opacity: 0.2;
    margin: 0.5em 0;
  }

  .group-content {
    display: flex;
    align-items: flex-start;
    gap: 1em;
    padding: 0.5em 0.75em;
    min-height: 2.5em;
  }

  .group-label {
    min-width: 7.5em;
    max-width: 7.5em;
    font-size: 0.75em;
    font-weight: 600;
    opacity: 0.7;
    text-transform: uppercase;
    letter-spacing: 0.03125em;
    padding-top: 0.375em;
    flex-shrink: 0;
  }

  .group-options {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.5em;
    flex: 1;
    align-items: center;
  }

  .option-toggle {
    cursor: pointer;
    transition:
      padding-left var(--transition-medium),
      padding-right var(--transition-medium),
      background-color var(--transition-fast);

    // Checkmark icon with smooth reveal animation
    .bi-check {
      width: 0;
      opacity: 0;
      overflow: hidden;
      transition:
        width var(--transition-medium),
        opacity var(--transition-fast);
    }

    // Hover states
    &:hover {
      background-color: var(--hover-bg-light);
    }

    // Active/selected state
    &[data-active='true'] {
      padding: {
        left: 0.7em;
        right: 0.7em;
      }

      .bi-check {
        width: 1em;
        opacity: 1;
      }

      &:hover {
        background-color: var(--hover-bg-medium);
      }
    }

    // Special highlighting for selected ungrouped options (third state)
    &:not(.group-options .option-toggle) {
      border: none !important;
      padding: 0.5em 0.25em 0.5em 0.25em;
      margin: 0.25em 0 0.25em 0;

      &[data-active='true'] {
        background-color: var(--hover-bg-medium);

        &:hover {
          background-color: var(--hover-bg-strong);
        }
      }
    }
  }
`;
