interface IOverlayProps {
  target: React.MutableRefObject<HTMLElement | null>;
}

type OverlayProps = IOverlayProps & React.ComponentProps<'div'>;
