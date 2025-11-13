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
  }
`;
