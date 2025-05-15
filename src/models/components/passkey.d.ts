interface IPasskey {
  id: Uint8Array;
  publicKey: Uint8Array;
}

interface ISecurityProps {
  identifier: string;
  userName?: string;
}

type PasskeyProps = Omit<React.ComponentProps<'input'>, 'defaultValue' | 'value'> & ISecurityProps;
