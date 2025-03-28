interface BasePortalProps<E extends HTMLElement> {
  children: React.ReactNode;
  container?: E | null;
}

interface IPortalProps<T extends React.ElementType<{}>, E extends HTMLElement> {
  component: T;
  container: E;
}

type PortalProps<
  T extends React.ElementType<{}>,
  P extends React.ComponentProps<T>,
  E extends HTMLElement = HTMLElement,
> = IPortalProps<T, E> & P;
