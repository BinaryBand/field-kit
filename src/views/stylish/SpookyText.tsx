/** @jsxImportSource @emotion/react */
import React, { ForwardedRef, MutableRefObject, ReactElement } from 'react';
import { css, keyframes } from '@emotion/react';
import { useMergedRef } from '@tools/ref';

function SpookyText<T extends TextTag = 'p'>(
  { bounce, magnitude = 0.5, children, ...props }: SpookyProps,
  ref: ForwardedRef<HTMLElementTagNameMap[T]>
): ReactElement {
  const ghostBounce =
    bounce !== false
      ? keyframes`
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-${magnitude}em); }
  `
      : '';

  const cascadingBounceStyle = css`
    display: inline-flex;
    white-space: pre-wrap;
  `;

  const characterStyle = (index: number) => css`
    display: inline-block;
    animation: ${ghostBounce} 1.5s ease-in-out infinite;
    animation-delay: ${index * 0.1}s;
  `;

  const internalRef: MutableRefObject<HTMLDivElement | null> =
    React.createRef<HTMLDivElement | null>();

  // Split the text into individual characters
  const characters = children.split('').map((char, index) => (
    <span key={index} css={characterStyle(index)}>
      {char}
    </span>
  ));

  return (
    <div {...props} ref={useMergedRef(ref, internalRef)}>
      <span css={cascadingBounceStyle}>{characters}</span>
    </div>
  );
}

export default React.forwardRef(SpookyText);
