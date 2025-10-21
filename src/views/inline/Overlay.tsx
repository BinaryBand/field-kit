import React, { ComponentProps, ForwardedRef, ReactElement } from 'react';
import styled, { StyledComponent } from '@emotion/styled';

import AppContext from '@providers/AppContext';
import Portal from '@/views/inline/Portal';

const StyledOverlay: StyledComponent<ComponentProps<'div'>> = styled.div`
  background: none;
  position: absolute;
  pointer-events: none;

  & > * {
    pointer-events: all;
  }
`;

function Overlay(
  { style, target, ...props }: OverlayProps,
  ref: ForwardedRef<HTMLDivElement>
): ReactElement {
  const { updateTrigger, scrollHeight, scrollWidth, pageWidth, pageHeight } =
    React.useContext(AppContext);

  const [left, setLeft] = React.useState<number>(0);
  const [top, setTop] = React.useState<number>(0);
  const [width, setWidth] = React.useState<number>(0);
  const [height, setHeight] = React.useState<number>(0);

  function handleResize(): void {
    if (target.current !== null) {
      const { left, top, width, height } = target.current.getBoundingClientRect();
      setLeft(left + scrollWidth);
      setTop(top + scrollHeight);
      setWidth(width);
      setHeight(height);
    }
  }

  React.useEffect(handleResize, [
    target,
    updateTrigger,
    scrollHeight,
    scrollWidth,
    pageWidth,
    pageHeight,
  ]);

  return (
    <Portal container={document.body}>
      <StyledOverlay {...props} ref={ref} style={{ ...style, left, top, height, width }} />
    </Portal>
  );
}

export default React.forwardRef(Overlay);
