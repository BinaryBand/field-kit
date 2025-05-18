import React, { ComponentProps, ForwardedRef, MutableRefObject, ReactNode, RefObject } from 'react';
import { SignatureContainer, SignatureCanvas, SignatureInput } from '@/views/styled/Signature';
import { createChangeEvent, useMergedRef } from '@utils';

const CANVAS_WIDTH: number = 750;
const CANVAS_HEIGHT: number = 375;

function Signature(
  { defaultValue, disabled, onChange, readOnly, value = '', ...props }: ComponentProps<'input'>,
  ref: ForwardedRef<HTMLInputElement>
): ReactNode {
  const canvasRef: RefObject<HTMLCanvasElement> = React.createRef();
  const internalRef: MutableRefObject<HTMLInputElement | null> = React.useRef(null);
  const isDrawing: MutableRefObject<boolean> = React.useRef(false);
  const [signatureDataUrl, setSignatureDataUrl] = React.useState<string>(`${defaultValue ?? ''}`);

  const isSigned: boolean = React.useMemo((): boolean => {
    return !isDrawing.current && signatureDataUrl !== '';
  }, [isDrawing.current, signatureDataUrl]);

  const updateSignature = React.useCallback((): void => {
    if (canvasRef.current && isDrawing.current) {
      const dataUrl: string = canvasRef.current.toDataURL();
      setSignatureDataUrl(dataUrl);

      if (internalRef.current) {
        onChange?.(createChangeEvent(internalRef.current, dataUrl));
      }
    }
  }, [canvasRef, onChange]);

  const drawCallback = React.useCallback(
    (evt: MouseEvent): void => {
      if (!isDrawing.current) return;

      const canvas: HTMLCanvasElement | null = canvasRef.current;
      const context: CanvasRenderingContext2D | null = canvas?.getContext('2d') ?? null;

      if (canvas !== null && context !== null) {
        context.lineWidth = 2;
        context.strokeStyle = 'currentColor';

        const rect: DOMRect = canvas.getBoundingClientRect();
        const mouseX: number = (evt.clientX - rect.left) * (CANVAS_WIDTH / rect.width);
        const mouseY: number = (evt.clientY - rect.top) * (CANVAS_HEIGHT / rect.height);

        context.lineTo(mouseX, mouseY);
        context.stroke();
        context.beginPath();
        context.moveTo(mouseX, mouseY);
      }
    },
    [canvasRef, isDrawing.current]
  );

  const startDrawingCallback = React.useCallback((): void => {
    isDrawing.current = !readOnly && !disabled;
  }, []);

  const stopDrawingCallback = React.useCallback((): void => {
    updateSignature();
    isDrawing.current = false;
  }, [updateSignature]);

  React.useEffect((): void => {
    const canvas: HTMLCanvasElement | null = canvasRef.current;
    const context: CanvasRenderingContext2D | null = canvas?.getContext('2d') ?? null;

    if (canvas !== null && context !== null) {
      const img: HTMLImageElement = new Image();
      img.src = signatureDataUrl;

      img.onload = (): void => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context?.drawImage(img, 0, 0, canvas.width, canvas.height);
      };

      img.onerror = (): void => context.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [canvasRef, signatureDataUrl]);

  React.useEffect((): (() => void) => {
    const canvas: HTMLCanvasElement | null = canvasRef.current;
    const context: CanvasRenderingContext2D | null = canvas?.getContext('2d') ?? null;

    if (canvas !== null && context !== null) {
      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;

      canvas.onmousedown = startDrawingCallback;
      canvas.onmousemove = drawCallback;
      canvas.onmouseup = stopDrawingCallback;
      canvas.onmouseleave = stopDrawingCallback;
    }

    return (): void => {
      if (canvas !== null) {
        canvas.onmousedown = null;
        canvas.onmousemove = null;
        canvas.onmouseup = null;
        canvas.onmouseleave = null;
      }
    };
  }, [canvasRef, drawCallback, startDrawingCallback, stopDrawingCallback]);

  React.useEffect((): void => {
    setSignatureDataUrl(`${value ?? ''}`);
  }, [value]);

  return (
    <SignatureContainer
      className={isSigned ? '_tw-signed' : ''}
      data-readonly={readOnly || undefined}
    >
      <SignatureInput {...props} readOnly ref={useMergedRef(ref, internalRef)} value={value} />
      <SignatureCanvas ref={canvasRef}>
        Your browser does not support the HTML5 canvas tag.
      </SignatureCanvas>
    </SignatureContainer>
  );
}

export default React.forwardRef(Signature);
