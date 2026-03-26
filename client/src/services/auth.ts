export type StoredUser = {
  _id: string;
  id: string;
  name: string;
  email: string;
  token?: string;
};

const GUEST_USER: StoredUser = {
  _id: 'guest-user',
  id: 'guest-user',
  name: 'Guest User',
  email: 'guest@deepdetect.local',
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

export const normalizeStoredUser = (value: unknown): StoredUser | null => {
  if (!isRecord(value)) {
    return null;
  }

  const rawId = value._id ?? value.id;
  const name = value.name;
  const email = value.email;
  const token = value.token;

  if (typeof rawId !== 'string' || !rawId.trim()) {
    return null;
  }

  if (typeof name !== 'string' || typeof email !== 'string') {
    return null;
  }

  return {
    _id: rawId,
    id: rawId,
    name,
    email,
    token: typeof token === 'string' ? token : undefined,
  };
};

export const getStoredUser = (): StoredUser => {
  return GUEST_USER;
};

export const setStoredUser = (value: unknown) => {
  const normalizedUser = normalizeStoredUser(value);
  if (!normalizedUser) {
    return GUEST_USER;
  }

  return normalizedUser;
};

export const clearStoredUser = () => {
  return;
};
