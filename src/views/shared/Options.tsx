import React, { ComponentProps, ReactElement } from 'react';

export interface OptionProps extends Omit<ComponentProps<'option'>, 'value'> {
  children?: React.ReactNode;
  value?: string;
}

export function SelectOption({ children, value, ...props }: OptionProps): ReactElement {
  return <option {...props} children={children} value={value} />;
}
