type TextTag = 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface ITextProps {
  bounce?: boolean;
  magnitude?: number;
  children: string;
}

type SpookyProps = Omit<React.ComponentProps<TextTag>, 'children'> & ITextProps;
