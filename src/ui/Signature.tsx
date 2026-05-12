import styled from '@emotion/styled';

export const SignatureContainer = styled.div`
  margin: 0;
  padding: 0;
  position: relative;
`;

export const SignatureCanvas = styled.canvas`
  aspect-ratio: 2 / 1;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
`;

export const SignatureInput = styled.input`
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

export const SignatureSvgOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;
