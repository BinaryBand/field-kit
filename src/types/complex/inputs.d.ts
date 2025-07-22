interface INativeInputElement {
  value: string;
  checked?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
}

type NativeInputElement = INativeInputElement & HTMLElement;

interface ISelectInputProps extends React.ComponentProps<'select'> {
  'data-placeholder'?: string;
}

type SelectInputProps = ISelectInputProps;
