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

interface IWrapperProps<
  P extends JSX.IntrinsicAttributes,
  C extends keyof JSX.IntrinsicElements | React.ComponentType<P>,
> {
  component: C;
  container?: HTMLElement | null;
}

type WrapperProps<
  P extends JSX.IntrinsicAttributes,
  C extends keyof JSX.IntrinsicElements | React.ComponentType<P>,
> = IWrapperProps<P, C> & React.ComponentType<C>;
