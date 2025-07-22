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
