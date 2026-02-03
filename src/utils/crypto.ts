import * as Crypto from 'expo-crypto';

/**
 * Password hashing utilities using SHA-256
 * Single responsibility: cryptographic operations for passwords
 */

const ALGORITHM = Crypto.CryptoDigestAlgorithm.SHA256;

export async function hashPassword(password: string): Promise<string> {
  return Crypto.digestStringAsync(ALGORITHM, password);
}

export async function verifyPassword(
  input: string,
  storedHash: string
): Promise<boolean> {
  const inputHash = await hashPassword(input);
  return inputHash === storedHash;
}
