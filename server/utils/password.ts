import crypto from 'crypto';

const SCRYPT_KEY_LENGTH = 64;
const SALT_LENGTH = 16;
const HASH_PREFIX = 'scrypt';

export const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const hashPassword = (password: string) => {
  const salt = crypto.randomBytes(SALT_LENGTH).toString('hex');
  const hash = crypto.scryptSync(password, salt, SCRYPT_KEY_LENGTH).toString('hex');
  return `${HASH_PREFIX}:${salt}:${hash}`;
};

export const isHashedPassword = (password: string) =>
  typeof password === 'string' && password.startsWith(`${HASH_PREFIX}:`);

export const verifyPassword = (password: string, storedPassword: string) => {
  if (!storedPassword) {
    return false;
  }

  if (!isHashedPassword(storedPassword)) {
    return storedPassword === password;
  }

  const [, salt, storedHash] = storedPassword.split(':');
  if (!salt || !storedHash) {
    return false;
  }

  const computedHash = crypto.scryptSync(password, salt, SCRYPT_KEY_LENGTH);
  const storedHashBuffer = Buffer.from(storedHash, 'hex');

  if (storedHashBuffer.length !== computedHash.length) {
    return false;
  }

  return crypto.timingSafeEqual(storedHashBuffer, computedHash);
};
