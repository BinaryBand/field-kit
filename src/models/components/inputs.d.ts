interface IGenericInputElement {
  value: string;
  checked?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
}

type GenericInputElement = IGenericInputElement & HTMLElement;

interface ISelectInputProps extends WrapperProps<'select'> {
  'data-placeholder'?: string;
}

type SelectInputProps = WrapperProps<'select'> & ISelectInputProps;

interface ISelectInputContext {
  options: Record<string, ReactNode>;
  addOption: (key: string, value: ReactNode) => void;
}
