import React, { ForwardedRef, ReactElement } from 'react';
import styled from '@emotion/styled';

import AppContext from '@providers/AppContext';
import Portal from '@/bridge/Portal';

const StyledOverlay = styled.div`
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
  const { updateTrigger, pageWidth, pageHeight } = React.useContext(AppContext);

  const [rect, setRect] = React.useState({ left: 0, top: 0, width: 0, height: 0 });

  function measure(): void {
    if (target.current) {
      const r = target.current.getBoundingClientRect();
      setRect({
        left: r.left + window.scrollX,
        top: r.top + window.scrollY,
        width: r.width,
        height: r.height,
      });
    }
  }

  React.useEffect(measure, [target, updateTrigger, pageWidth, pageHeight]);

  React.useEffect(() => {
    window.addEventListener('scroll', measure, { passive: true, capture: true });
    return () => window.removeEventListener('scroll', measure, { capture: true });
  }, [target]);

  React.useEffect(() => {
    if (!target.current || !('ResizeObserver' in window)) return;
    const observer = new ResizeObserver(measure);
    observer.observe(target.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <Portal container={document.body}>
      <StyledOverlay
        {...props}
        ref={ref}
        style={{ ...style, left: rect.left, top: rect.top, height: rect.height, width: rect.width }}
      />
    </Portal>
  );
}

export default React.forwardRef(Overlay);
