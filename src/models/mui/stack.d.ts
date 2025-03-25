interface IStackProps {
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  gap?: number;
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  align?: 'stretch' | 'center' | 'start' | 'end';
  justify?: 'start' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
}

type StackProps = IStackProps & React.ComponentProps<'div'>;
