import React, {
  ChangeEvent,
  ComponentProps,
  ForwardedRef,
  Fragment,
  MouseEvent,
  MutableRefObject,
  ReactElement,
} from 'react';
import styled, { StyledComponent } from '@emotion/styled';
import { createChangeEvent, useMergedRef } from '@utils';

import Stack from '@inline/Stack';

import ClearIconUrl from '@/assets/icons/x.svg';
import UploadIconUrl from '@/assets/icons/image.svg';

const CenterContainer: StyledComponent<StackProps> = styled(Stack)`
  align-items: center;
  display: flex;
  gap: 0.5rem;
  justify-content: center;

  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`;

const ImageContainer: StyledComponent<ComponentProps<'div'>> = styled.div`
  border: 2px dashed;  
  cursor: pointer;
  max-width: 100%;
  min-height: 300px;
  position: relative;

  &[data-has-image] > #_image-input {
    flex-direction: row;
    & > img#_upload-icon {
      display: none;
    }
  }

  &:not([data-has-image]) > #_image-input {
      flex-direction: column;
      & > img#_clear-icon {
        display: none;
      }
    }
  }

  &[data-disabled] {
    color: #ccc;
    pointer-events: none;
  }

  &[data-readonly] {
    border: none;
    cursor: default;
  }
`;

function isValidBase64(value: string): boolean {
  return /^data:image\/[^;]+;base64,[A-Za-z0-9+\/=]+$/.test(value);
}

async function normalizeImage(image: File): Promise<string>;
async function normalizeImage(image: string): Promise<string>;
async function normalizeImage(image: File | string): Promise<string> {
  try {
    if (typeof image !== 'string') {
      const url: string = URL.createObjectURL(image);
      return normalizeImage(url);
    }

    if (isValidBase64(image)) {
      return image;
    }

    const response: Response = await fetch(image);
    if (!response.ok) {
      throw new Error(`Error fetching image: ${response.status}`);
    }

    const blob: Blob = await response.blob();
    const reader: FileReader = new FileReader();

    return new Promise(async (resolve, reject) => {
      reader.onloadend = () => resolve((reader.result as string) || '');
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error: unknown) {
    console.error('Error normalizing image:', error);
    return '';
  }
}

function ImageInput(
  {
    className,
    defaultValue,
    disabled,
    placeholder,
    onChange,
    readOnly,
    style,
    value,
    ...props
  }: ComponentProps<'input'>,
  ref: ForwardedRef<HTMLInputElement>
): ReactElement {
  const internalRef: MutableRefObject<HTMLInputElement | null> =
    React.useRef<HTMLInputElement | null>(null);

  const [internalValue, setInternalValue] = React.useState<string>((): string => {
    const internalValue: string = `${value ?? defaultValue ?? ''}`;
    return isValidBase64(internalValue) ? internalValue : '';
  });

  const hasImage: boolean = React.useMemo(
    (): boolean => isValidBase64(internalValue),
    [internalValue]
  );

  async function handleChange(event: ChangeEvent<HTMLInputElement>): Promise<void> {
    const imageFile: File | null = event.target.files?.item(0) ?? null;

    try {
      if (imageFile !== null) {
        const imageUrl: string = await normalizeImage(imageFile);
        setInternalValue(imageUrl);
        onChange?.(createChangeEvent(event.target, imageUrl));
      }
    } catch (error: unknown) {
      console.error('Error handling image change:', error);
    }
  }

  function handleClick(event: MouseEvent): void {
    if (internalRef.current !== null && !readOnly) {
      if (!hasImage) {
        internalRef.current?.click();
        return;
      }

      event.stopPropagation();
      onChange?.(createChangeEvent(internalRef.current, ''));
    }
  }

  React.useEffect((): void => {
    if (!hasImage && internalRef.current !== null) {
      internalRef.current.value = '';
    }
  }, [hasImage]);

  React.useEffect((): void => {
    if (value !== undefined && typeof value === 'string') {
      setInternalValue(value);
    }
  }, [value]);

  return (
    <Fragment>
      <ImageContainer
        className={className}
        data-disabled={disabled || undefined}
        data-has-image={hasImage || undefined}
        data-readonly={readOnly || undefined}
        onClick={handleClick}
        style={style}
      >
        <CenterContainer align="center" gap={1} id="_image-input">
          <img alt="Upload button" id="_upload-icon" src={UploadIconUrl} height={32} />
          <img
            alt="Clear button"
            hidden={readOnly}
            id="_clear-icon"
            src={ClearIconUrl}
            height={32}
          />
          <label
            hidden={readOnly}
            htmlFor={props.id}
            style={{ pointerEvents: 'none', textWrap: 'nowrap' }}
          >
            <span>{hasImage ? 'Clear Image' : (placeholder ?? 'Upload Image')}</span>
          </label>
        </CenterContainer>

        <img src={internalValue} width="100%" />
      </ImageContainer>

      <input
        {...props}
        accept="image/*"
        hidden
        onChange={handleChange}
        ref={useMergedRef(ref, internalRef)}
        type="file"
      />
    </Fragment>
  );
}

export default React.forwardRef(ImageInput);
