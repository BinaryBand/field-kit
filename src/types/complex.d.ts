// Editor Types
interface IToolbarProps {
  moveUp?: () => void;
  moveDown?: () => void;
  remove: () => void;
}

type ToolbarProps = IToolbarProps & React.ComponentProps<'div'>;

interface CommonComponent {
  id: string;
}

type EditorComponents = {
  text: {
    tag: 'text';
    value: string;
  };
  image: {
    tag: 'image';
    source?: string;
  };
};

type EditorComponent<T extends keyof EditorComponents> = EditorComponents[T] & CommonComponent;

type DocumentComponents = Record<string, EditorComponent<keyof EditorComponents>>;

// Form Types
type FormType = string | string[] | number | number[] | boolean;

interface TwSubmitEvent extends SubmitEvent {
  formData?: Record<string, FormType>;
}

type IFormData = Record<string, FormType> | FormType[];

type TWFormData = FormType | IFormData;

// Input Types
interface INativeInputElement {
  value: string;
  checked?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
}

type NativeInputElement = INativeInputElement & HTMLElement;

interface IBaseSelectProps extends React.ComponentProps<'select'> {
  'data-placeholder'?: string;
}

type BaseSelectProps = IBaseSelectProps;
type SelectInputProps = BaseSelectProps; // Backward compatibility

// Passkey Types
interface IPasskey {
  id: Uint8Array;
  publicKey: Uint8Array;
}

interface ISecurityProps {
  identifier: string;
  userName?: string;
}

type PasskeyProps = Omit<React.ComponentProps<'input'>, 'defaultValue' | 'value'> & ISecurityProps;

// Signature Types
type Point = [number, number];

type PolyLine = Point[];

type SignatureModel = PolyLine[];

// Wrapper Types
type InputTags = 'input' | 'select' | 'textarea';

interface IInputWrapperProps<T extends InputTags, P extends JSX.IntrinsicAttributes> {
  component: T | React.ComponentType<P>;
  container: HTMLElementTagNameMap[T];
}

type InputWrapperProps<T extends InputTags, P extends JSX.IntrinsicAttributes> = IInputWrapperProps<
  T,
  P
> &
  React.ComponentProps<T>;

interface IWrapperOwnProps<C extends React.ElementType> {
  component: C;
  container?: HTMLElement | null;
}

type WrapperProps<C extends React.ElementType> = IWrapperOwnProps<C> &
  Omit<React.ComponentProps<C>, keyof IWrapperOwnProps<C>>;
