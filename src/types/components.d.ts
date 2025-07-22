interface IPinInputProps {
  size?: number;
}

type PinInputProps = Omit<React.ComponentProps<'input'>, 'type'> & IPinInputProps;
