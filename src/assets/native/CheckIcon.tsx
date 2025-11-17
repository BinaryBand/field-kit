import React, { ForwardedRef, ReactElement, SVGProps } from 'react';

function CheckIcon(props: SVGProps<SVGSVGElement>, ref: ForwardedRef<SVGSVGElement>): ReactElement {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      fill="currentColor"
      viewBox="0 0 16 16"
      {...props}
      ref={ref}
    >
      <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
    </svg>
  );
}

export default React.forwardRef(CheckIcon);
