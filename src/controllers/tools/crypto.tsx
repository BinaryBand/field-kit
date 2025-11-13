import { assert } from './misc';
import { Buffer } from 'buffer';

const KEY_TYPE = 'public-key';
const TEXT_ENCODER: TextEncoder = new TextEncoder();

// Convert signature from ASN.1 sequence to "raw" format
// https://gist.github.com/philholden/50120652bfe0498958fd5926694ba354?permalink_comment_id=3744585#gistcomment-3744585
function asnToRawFormat(signature: ArrayBuffer): Uint8Array {
  const signatureView: Uint8Array = new Uint8Array(signature);

  const rStart: number = signatureView[4] === 0 ? 5 : 4;
  const rEnd: number = rStart + 32;
  const r: Uint8Array = signatureView.slice(rStart, rEnd);

  const sStart: number = signatureView[rEnd + 2] === 0 ? rEnd + 3 : rEnd + 2;
  const s: Uint8Array = signatureView.slice(sStart);

  return new Uint8Array([...r, ...s]);
}

export function decodeKey(passkey: IPasskey): string {
  const { id, publicKey } = passkey;
  const passkeyBuffer: Buffer = Buffer.concat([id, publicKey]);
  return passkeyBuffer.toString('base64');
}

export function parsePasskey(passkeyString: string): IPasskey {
  const passkeyBuffer: Buffer = Buffer.from(passkeyString, 'base64');
  const id: Buffer = passkeyBuffer.subarray(0, 32);
  const publicKey: Buffer = passkeyBuffer.subarray(32);
  return { id, publicKey };
}

function savePasskey(identifier: string, passkey: IPasskey): void {
  const key: string = `passkey-${identifier}`;
  const passkeyString: string = decodeKey(passkey);
  localStorage.setItem(key, passkeyString);

  console.log(`Passkey successfully saved for ${identifier}.`);
}

export function removePasskey(identifier: string): void {
  const key: string = `passkey-${identifier}`;
  localStorage.removeItem(key);

  console.log(`Passkey successfully removed for ${identifier}.`);
}

export function getPasskey(identifier: string): IPasskey | null {
  const key: string = `passkey-${identifier}`;
  const passkeyString: string | null = localStorage.getItem(key);

  if (passkeyString === null) return null;

  return parsePasskey(passkeyString);
}

export async function createPasskey(identifier: string, name: string): Promise<void> {
  const hostname: string = location.hostname;
  const id: BufferSource = TEXT_ENCODER.encode(identifier);
  const challenge: BufferSource = crypto.getRandomValues(new Uint8Array(32));

  const registrationOptions: CredentialCreationOptions = {
    publicKey: {
      rp: { id: hostname, name: hostname },
      user: { id, displayName: name, name },
      challenge,
      pubKeyCredParams: [{ type: KEY_TYPE, alg: -7 }],
      timeout: 60000,
      attestation: 'none',
    },
  };

  const credential: Credential | null = await navigator.credentials.create(registrationOptions);
  assert(credential instanceof PublicKeyCredential, 'Credential creation was null or undefined.');

  const response: AuthenticatorResponse = credential.response;
  assert(response instanceof AuthenticatorAttestationResponse, 'Credential response is not valid.');

  const publicKey: ArrayBuffer | null = response.getPublicKey();
  assert(publicKey, 'Public key is undefined.');

  const passkey: IPasskey = {
    id: new Uint8Array(credential.rawId),
    publicKey: new Uint8Array(publicKey),
  };

  savePasskey(identifier, passkey);
}

export async function signChallenge(
  passkey: IPasskey,
  challenge: BufferSource
): Promise<AuthenticatorAssertionResponse> {
  const rpId: string = location.hostname;
  const id: BufferSource = Buffer.from(passkey.id);

  const authenticationOptions: CredentialRequestOptions = {
    publicKey: {
      challenge,
      rpId,
      allowCredentials: [{ id, type: KEY_TYPE }],
      timeout: 60000,
    },
  };

  const assertion: Credential | null = await navigator.credentials.get(authenticationOptions);
  assert(assertion instanceof PublicKeyCredential, 'Credential assertion was undefined.');

  const response: AuthenticatorResponse = assertion.response;
  assert(response instanceof AuthenticatorAssertionResponse, 'Credential response is not valid.');

  return response;
}

export async function verifyPasskey(passkey: IPasskey): Promise<boolean> {
  const challenge: BufferSource = crypto.getRandomValues(new Uint8Array(32));

  const { authenticatorData, clientDataJSON, signature } = await signChallenge(passkey, challenge);
  const publicKey: BufferSource = Buffer.from(passkey.publicKey);
  const rawSignature: BufferSource = Buffer.from(asnToRawFormat(signature));

  const importAlgoParams: EcKeyImportParams = { name: 'ECDSA', namedCurve: 'P-256' };
  const key: CryptoKey = await crypto.subtle.importKey('spki', publicKey, importAlgoParams, false, [
    'verify',
  ]);

  const dataSignature: ArrayBuffer = await crypto.subtle.digest('SHA-256', clientDataJSON);
  const dataToVerify: BufferSource = new Uint8Array([
    ...new Uint8Array(authenticatorData),
    ...new Uint8Array(dataSignature),
  ]);

  const hashAlgoParams: EcdsaParams = { name: 'ECDSA', hash: 'SHA-256' };
  return crypto.subtle.verify(hashAlgoParams, key, rawSignature, dataToVerify);
}
