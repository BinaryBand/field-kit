import React, { ComponentProps, ForwardedRef, Fragment, MutableRefObject, ReactNode } from 'react';
import DOMPurify from 'dompurify';
import {
  SignatureContainer,
  SignatureCanvas,
  SignatureInput,
  SignatureSvgOverlay,
} from '@/ui/Signature';

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

function buildPath(points: Point[]): string {
  if (points.length === 0) return '';
  const filtered = filterClosePoints(points, 5);
  if (filtered.length === 0) return '';
  const [firstX, firstY] = filtered[0];
  const segments: string[] = [`M${fmt(firstX)} ${fmt(firstY)}`];
  for (let i = 1; i < filtered.length; i++) {
    const [x, y] = filtered[i];
    segments.push(`L${fmt(x)} ${fmt(y)}`);
  }
  return `<path d="${segments.join(' ')}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
}

function fmt(n: number): string {
  return n.toFixed(0);
}

function normalizeSvg(svg: string): string {
  const isSvg = /<svg[\s\S]*?<\/svg>/i.test(svg);
  if (!isSvg) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 750 375" stroke="currentColor"></svg>';
  }

  // Parse and ensure required attributes exist
  const parser = new DOMParser();
  const doc = parser.parseFromString(svg, 'image/svg+xml');
  const svgEl = doc.documentElement;

  // Check for parse errors
  if (svgEl.querySelector('parsererror')) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 750 375" stroke="currentColor"></svg>';
  }

  // Ensure required attributes
  if (!svgEl.hasAttribute('xmlns')) {
    svgEl.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  }
  if (!svgEl.hasAttribute('viewBox')) {
    svgEl.setAttribute('viewBox', '0 0 750 375');
  }
  if (!svgEl.hasAttribute('stroke')) {
    svgEl.setAttribute('stroke', 'currentColor');
  }

  return svgEl.outerHTML;
}

function Signature(
  { defaultValue, disabled, onChange, readOnly, value, ...props }: ComponentProps<'input'>,
  ref: ForwardedRef<HTMLInputElement>
): ReactNode {
  const canvasRef: MutableRefObject<HTMLCanvasElement | null> = React.useRef(null);
  const internalRef: MutableRefObject<HTMLInputElement | null> = React.useRef(null);
  const isDrawing: MutableRefObject<boolean> = React.useRef(false);
  const currentStroke: MutableRefObject<Point[]> = React.useRef([]);

  const [internalVal, setInternalVal] = React.useState(() => normalizeSvg(String(defaultValue)));
  const [isEmpty, setIsEmpty] = React.useState<boolean>(!internalVal || internalVal === '');

  // Parse current SVG string to DOM
  const svg: HTMLElement = React.useMemo((): HTMLElement => {
    if (typeof window === 'undefined') {
      // Return a dummy element for SSR
      return (new (require('jsdom').JSDOM)('').window.document.createElement('svg'));
    }
    const PARSER = new DOMParser();
    const doc = PARSER.parseFromString(internalVal, 'image/svg+xml');
    setIsEmpty(doc.documentElement.children.length === 0 || internalVal === '');
    return doc.documentElement;
  }, [internalVal]);

  function clearSignature(): void {
    if (!internalRef.current) return;

    const emptySvg = normalizeSvg('');
    setInternalVal(emptySvg);
    onChange?.(createChangeEvent(internalRef.current, emptySvg));

    const context = canvasRef.current?.getContext('2d');
    context?.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  const updateSignature = React.useCallback((): void => {
    if (!internalRef.current || currentStroke.current.length === 0) return;

    const pathMarkup = buildPath(currentStroke.current);
    currentStroke.current = [];
    if (pathMarkup) {
      svg.insertAdjacentHTML('beforeend', pathMarkup);
      setInternalVal(svg.outerHTML);
      onChange?.(createChangeEvent(internalRef.current, svg.outerHTML));
    }
  }, [svg, onChange]);

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
    }
  }, [updateSignature]);

  React.useEffect((): void => {
    const canvas: HTMLCanvasElement | null = canvasRef.current;
    if (canvas !== null) {
      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;
    }
  }, []);

  React.useEffect(() => {
    if (internalVal) {
      setInternalVal(normalizeSvg(String(value)));
    }
  }, [internalVal, value]);

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
          readOnly
          ref={useMergedRef(ref, internalRef)}
          value={isEmpty ? '' : internalVal}
        />
        <div style={{ position: 'relative', width: '100%' }}>
          <SignatureCanvas ref={canvasRef}>
            Your browser does not support the HTML5 canvas tag.
          </SignatureCanvas>
          <SignatureSvgOverlay 
            dangerouslySetInnerHTML={{ 
              __html: DOMPurify.sanitize(svg.outerHTML, { 
                USE_PROFILES: { svg: true, svgFilters: true },
                ADD_TAGS: ['path'],
                ADD_ATTR: ['viewBox', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'd', 'fill']
              }) 
            }} 
          />
        </div>
      </SignatureContainer>

      <button hidden type="button" onClick={clearSignature} data-testid="clear-signature-button" />
    </Fragment>
  );
}

export default React.forwardRef(Signature);
