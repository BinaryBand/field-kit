import React, { ForwardedRef, Fragment, ReactElement, ReactNode, RefObject } from 'react';

import { decodeKey, getPasskey, removePasskey, createPasskey, verifyPasskey } from '@tools/crypto';
import { createChangeEvent, useMergedRef } from '@/controllers/utils';
import { assert } from '@tools/misc';

function PasskeyInput(
  {
    children,
    className,
    disabled,
    hidden,
    identifier,
    onChange,
    style,
    userName,
    ...props
  }: PasskeyProps,
  ref: ForwardedRef<HTMLInputElement>
): ReactElement {
  const internalRef: RefObject<HTMLInputElement | null> = React.useRef<HTMLInputElement>(null);

  const [passkey, setPasskey] = React.useState<IPasskey | null>(null);

  const isSupported: boolean = React.useMemo(() => Boolean(window.PublicKeyCredential), []);
  const isDisabled: boolean = React.useMemo(
    () => disabled || !isSupported,
    [disabled, isSupported]
  );

  const text: ReactNode = React.useMemo(
    () => children ?? (!passkey ? 'Not registered' : 'Registered'),
    [children, passkey]
  );

  async function handleRegistration(identifier: string): Promise<void> {
    await createPasskey(identifier, userName ?? '');
    const passkey: IPasskey | null = getPasskey(identifier);
    setPasskey(passkey);
  }

  async function handleRemoval(): Promise<void> {
    try {
      const passkey: IPasskey = getPasskey(identifier)!;
      const success: boolean = await verifyPasskey(passkey);
      if (success) {
        removePasskey(identifier);
        const updatedPasskey: IPasskey | null = getPasskey(identifier);
        setPasskey(updatedPasskey);
      } else {
        throw 'Passkey verification failed.';
      }
    } catch (error) {
      console.error('Error during passkey removal:', error);
    }
  }

  function handleClick(): void {
    assert(isSupported, 'Passkey is not supported in this browser.');
    passkey === null ? handleRegistration(identifier) : handleRemoval();
  }

  React.useEffect((): void => {
    const nativeInput: HTMLInputElement | null = internalRef.current;

    const passkey: IPasskey | null = getPasskey(identifier);
    if (nativeInput !== null && onChange !== undefined) {
      const passkeyString: string = passkey !== null ? decodeKey(passkey) : '';
      onChange(createChangeEvent(nativeInput, passkeyString));
    }
  }, [passkey]);

  React.useEffect((): void => {
    !identifier && console.warn('Provide a identifier by passing data-identifier prop.');
  }, [identifier]);

  React.useEffect((): void => {
    const passkey: IPasskey | null = getPasskey(identifier);
    setPasskey(passkey);
  }, []);

  return (
    <Fragment>
      <button
        className={className}
        disabled={isDisabled}
        onClick={handleClick}
        style={style}
        type="button"
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>{text}</span>
      </button>

      <input {...props} hidden readOnly ref={useMergedRef(ref, internalRef)} />
    </Fragment>
  );
}

export default React.forwardRef(PasskeyInput);
