import React, {
  ComponentProps,
  ForwardedRef,
  Fragment,
  KeyboardEvent,
  MutableRefObject,
  ReactNode,
} from 'react';
import {
  SignatureContainer,
  SignatureCanvas,
  SignatureInput,
  SignatureSvgOverlay,
} from '@/views/styled/Signature';

import { createChangeEvent } from '@tools/events';
import { useMergedRef } from '@tools/ref';

const CANVAS_WIDTH: number = 750;
const CANVAS_HEIGHT: number = 375;

type Point = [number, number];

function filterClosePoints(stroke: Point[], minDistance: number = 3): Point[] {
  if (stroke.length === 0) return [];

  const filtered: Point[] = [stroke[0]];
  for (let i = 1; i < stroke.length; i++) {
    const [x1, y1] = filtered[filtered.length - 1];
    const [x2, y2] = stroke[i];
    const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

    if (distance >= minDistance) {
      filtered.push(stroke[i]);
    }
  }
  return filtered;
}

function Signature(
  { defaultValue, disabled, onChange, readOnly, value, ...props }: ComponentProps<'input'>,
  ref: ForwardedRef<HTMLInputElement>
): ReactNode {
  const canvasRef: MutableRefObject<HTMLCanvasElement | null> = React.useRef(null);
  const internalRef: MutableRefObject<HTMLInputElement | null> = React.useRef(null);
  const isDrawing: MutableRefObject<boolean> = React.useRef(false);
  const currentStroke: MutableRefObject<Point[]> = React.useRef([]);
  const ctrlPressed: MutableRefObject<boolean> = React.useRef(false);

  const [signaturePoints, setSignaturePoints] = React.useState<Point[][]>([]);

  const svg: string = React.useMemo((): string => {
    const fmt = (n: number): string => n.toFixed(0);
    const lines: string[] = [];
    for (const stroke of signaturePoints) {
      const filteredStroke = filterClosePoints(stroke, 5);
      for (let i = 1; i < filteredStroke.length; i++) {
        const [x1, y1] = filteredStroke[i - 1];
        const [x2, y2] = filteredStroke[i];
        lines.push(`<line x1="${fmt(x1)}" y1="${fmt(y1)}" x2="${fmt(x2)}" y2="${fmt(y2)}"/>`);
      }
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}" stroke="currentColor">${lines.join('')}</svg>`;
  }, [signaturePoints]);

  function clearSignature(): void {
    setSignaturePoints([]);
  }

  function handleKeyDown(evt: KeyboardEvent<HTMLInputElement>): void {
    switch (evt.key) {
      case 'Control':
        ctrlPressed.current = true;
        break;
      case 'z':
        ctrlPressed.current && setSignaturePoints((prev) => prev.slice(0, -1));
        break;
    }
  }

  function handleKeyUp(evt: KeyboardEvent<HTMLInputElement>): void {
    if (evt.key === 'Control') {
      ctrlPressed.current = false;
    }
  }

  const clearCanvas = React.useCallback((): void => {
    const context = canvasRef.current?.getContext('2d');
    if (context) {
      context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
  }, []);

  const updateSignature = React.useCallback((): void => {
    if (currentStroke.current.length > 0) {
      setSignaturePoints((prev) => [...prev, [...currentStroke.current]]);
      currentStroke.current = [];
    }
  }, []);

  const drawCallback = React.useCallback((evt: MouseEvent): void => {
    if (!isDrawing.current) return;

    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = (evt.clientX - rect.left) * (CANVAS_WIDTH / rect.width);
    const mouseY = (evt.clientY - rect.top) * (CANVAS_HEIGHT / rect.height);
    currentStroke.current.push([mouseX, mouseY]);

    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    context.strokeStyle = 'currentColor';
    context.beginPath();
    context.moveTo(currentStroke.current[0][0], currentStroke.current[0][1]);
    currentStroke.current.forEach(([x, y]) => context.lineTo(x, y));
    context.stroke();
  }, []);

  const startDrawingCallback = React.useCallback((): void => {
    if (!readOnly && !disabled) {
      isDrawing.current = true;
      currentStroke.current = [];
    }
  }, [readOnly, disabled]);

  const stopDrawingCallback = React.useCallback((): void => {
    if (isDrawing.current) {
      updateSignature();
      isDrawing.current = false;
      clearCanvas();
    }
  }, [updateSignature, clearCanvas]);

  // Trigger onChange when signature points change
  React.useEffect((): void => {
    if (internalRef.current) {
      onChange?.(createChangeEvent(internalRef.current, svg));
    }
  }, [signaturePoints, onChange, svg]);

  // Initialize canvas once
  React.useEffect((): void => {
    const canvas: HTMLCanvasElement | null = canvasRef.current;
    if (canvas !== null) {
      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;
    }
  }, []);

  // Setup canvas event handlers
  React.useEffect((): (() => void) => {
    const canvas = canvasRef.current;
    if (!canvas) return () => {};

    canvas.onmousedown = startDrawingCallback;
    canvas.onmousemove = drawCallback;
    canvas.onmouseup = stopDrawingCallback;
    canvas.onmouseleave = stopDrawingCallback;
    canvas.onfocus = () => internalRef.current?.focus();
    canvas.onblur = () => internalRef.current?.blur();

    return (): void => {
      canvas.onmousedown = null;
      canvas.onmousemove = null;
      canvas.onmouseup = null;
      canvas.onmouseleave = null;
      canvas.onfocus = null;
      canvas.onblur = null;
    };
  }, [drawCallback, startDrawingCallback, stopDrawingCallback]);

  return (
    <Fragment>
      <SignatureContainer data-readonly={readOnly || undefined}>
        <SignatureInput
          {...props}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          readOnly
          ref={useMergedRef(ref, internalRef)}
        />
        <div style={{ position: 'relative', width: '100%' }}>
          <SignatureCanvas ref={canvasRef} tabIndex={disabled || readOnly ? -1 : 0}>
            Your browser does not support the HTML5 canvas tag.
          </SignatureCanvas>
          {signaturePoints.length > 0 && (
            <SignatureSvgOverlay dangerouslySetInnerHTML={{ __html: svg }} />
          )}
        </div>
      </SignatureContainer>

      <a type="button" onClick={clearSignature} style={{ cursor: 'pointer' }}>
        Clear
      </a>
    </Fragment>
  );
}

export default React.forwardRef(Signature);
