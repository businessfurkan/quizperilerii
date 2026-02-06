import crypto from 'crypto';

/**
 * Hashes a password using PBKDF2 with a random salt.
 * Format: salt:hash
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verifies a password against a stored hash.
 * Supports legacy plain text passwords for backward compatibility.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  // Check for legacy plain text password (no salt separator)
  if (!storedHash.includes(':')) {
    return password === storedHash;
  }

  const [salt, originalHash] = storedHash.split(':');
  if (!salt || !originalHash) return false;

  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === originalHash;
}
