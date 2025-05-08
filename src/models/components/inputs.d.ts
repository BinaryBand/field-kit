interface IGenericInputElement {
  value: string;
  checked?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
}

type GenericInputElement = IGenericInputElement & HTMLElement;

interface ISelectInputProps extends React.ComponentProps<'select'> {
  'data-placeholder'?: string;
}

type SelectInputProps = ISelectInputProps;
