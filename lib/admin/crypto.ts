// Browser-side AES-GCM decrypt for the bundled-but-encrypted PAT.
// Symmetric to scripts/encrypt-admin-pat.mjs:
//   blob = base64(salt(16) || iv(12) || ciphertext+tag)
// Key is derived with PBKDF2-SHA256 / 600k iterations — same on both
// sides; if either constant changes, decryption fails silently.

const PBKDF2_ITERATIONS = 600_000;

export class WrongPasswordError extends Error {
  constructor() {
    super('Wrong password.');
    this.name = 'WrongPasswordError';
  }
}

function base64ToBytes(b64: string): Uint8Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/**
 * Derive an AES-256-GCM key from the password using PBKDF2.
 * Slow on purpose — makes brute-forcing the password expensive.
 */
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const baseKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );
}

/**
 * Decrypt the bundled PAT with the owner's password. Throws
 * WrongPasswordError if the password doesn't match (which is the
 * happy-path failure mode).
 */
export async function decryptPat(password: string, blobBase64: string): Promise<string> {
  if (!blobBase64) {
    throw new Error('No encrypted token bundled. The build secret may be missing.');
  }
  const blob = base64ToBytes(blobBase64);
  if (blob.length < 16 + 12 + 16) {
    throw new Error('Encrypted token looks malformed.');
  }
  const salt = blob.slice(0, 16);
  const iv = blob.slice(16, 28);
  const ciphertextWithTag = blob.slice(28);

  const key = await deriveKey(password, salt);
  let decrypted: ArrayBuffer;
  try {
    decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv as BufferSource },
      key,
      ciphertextWithTag as BufferSource
    );
  } catch {
    // Wrong password OR tampered blob both throw OperationError. We
    // can't distinguish — for owner UX it's "wrong password" either way.
    throw new WrongPasswordError();
  }
  return new TextDecoder().decode(decrypted);
}
