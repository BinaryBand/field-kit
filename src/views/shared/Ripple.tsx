import React, { ComponentProps, ForwardedRef, ReactElement, useRef } from 'react';
import { ButtonBase } from '@mui/material';

interface RippleProps extends Omit<ComponentProps<'div'>, 'ref'> {
  component?: React.ElementType;
  disabled?: boolean;
  centerRipple?: boolean;
  focusRipple?: boolean;
  disableRipple?: boolean;
}

/**
 * A wrapper component that adds Material-UI ripple effect to any element
 * 
 * @example
 * ```tsx
 * <Ripple>
 *   <button>Click me</button>
 * </Ripple>
 * ```
 * 
 * @example With custom component
 * ```tsx
 * <Ripple component="div" className="custom-card">
 *   Card content
 * </Ripple>
 * ```
 */
function Ripple(
  {
    children,
    className,
    component = 'div',
    disabled = false,
    centerRipple = false,
    focusRipple = false,
    disableRipple = false,
    ...props
  }: RippleProps,
  ref: ForwardedRef<HTMLElement>
): ReactElement {
  return (
    <ButtonBase
      {...props}
      ref={ref}
      component={component}
      className={className}
      disabled={disabled}
      centerRipple={centerRipple}
      focusRipple={focusRipple}
      disableRipple={disableRipple}
      sx={{
        display: 'inherit',
        alignItems: 'inherit',
        justifyContent: 'inherit',
        flexDirection: 'inherit',
        width: 'auto',
        height: 'auto',
        ...props.style,
      }}
    >
      {children}
    </ButtonBase>
  );
}

export default React.forwardRef(Ripple);
