interface IOverlayProps {
  target: React.MutableRefObject<HTMLElement | null>;
}

type OverlayProps = IOverlayProps & React.ComponentProps<'div'>;

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

interface IStackProps {
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  gap?: number;
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  align?: 'stretch' | 'center' | 'start' | 'end';
  justify?: 'start' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
}

type StackProps = IStackProps & React.ComponentProps<'div'>;
