import { ComponentProps } from 'react';
import styled, { StyledComponent } from '@emotion/styled';

export const SignatureContainer: StyledComponent<ComponentProps<'div'>> = styled.div`
  margin: 0;
  padding: 0;
  position: relative;
`;

export const SignatureCanvas: StyledComponent<ComponentProps<'canvas'>> = styled.canvas`
  aspect-ratio: 2 / 1;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
`;

export const SignatureInput: StyledComponent<ComponentProps<'input'>> = styled.input`
  background-color: transparent;
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  text-align: center;

  font-size: 0;
  ::placeholder {
    font-size: initial;
  }
`;

export const SignatureSvgOverlay: StyledComponent<ComponentProps<'div'>> = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;
