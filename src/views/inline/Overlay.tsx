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
  const frameRef = React.useRef<number | null>(null);
  const { updateTrigger, scrollHeight, scrollWidth, pageWidth, pageHeight } =
    React.useContext(AppContext);

  const [left, setLeft] = React.useState<number>(0);
  const [top, setTop] = React.useState<number>(0);
  const [width, setWidth] = React.useState<number>(0);
  const [height, setHeight] = React.useState<number>(0);

  const leftMemo = React.useMemo(() => left + scrollWidth, [left, scrollWidth]);
  const topMemo = React.useMemo(() => top + scrollHeight, [top, scrollHeight]);

  function measure(): void {
    if (target.current) {
      const rect = target.current.getBoundingClientRect();
      setLeft(rect.left);
      setTop(rect.top);
      setWidth(rect.width);
      setHeight(rect.height);
    }
  }

  React.useEffect(measure, [target, updateTrigger, pageWidth, pageHeight]);

  React.useEffect(() => {
    if (target.current && 'ResizeObserver' in window) {
      const observer = new ResizeObserver(() => measure());
      observer.observe(target.current);
      return () => observer.disconnect();
    }
  }, [target]);

  React.useEffect(() => {
    if (target.current && 'MutationObserver' in window) {
      const observer = new MutationObserver(() => measure());
      observer.observe(target.current, { attributes: true, childList: true, subtree: true });
      return () => observer.disconnect();
    }
  }, [target]);

  React.useEffect(() => {
    const loop = () => {
      measure();
      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [target]);

  return (
    <Portal container={document.body}>
      <StyledOverlay
        {...props}
        ref={ref}
        style={{ ...style, left: leftMemo, top: topMemo, height, width }}
      />
    </Portal>
  );
}

export default React.forwardRef(Overlay);
