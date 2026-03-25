import crypto from 'crypto';

type StoredUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
};

type StoredScan = {
  id: string;
  userId: string;
  fileName: string;
  fileType: string;
  result: string;
  confidenceScore: number;
  scanDate: Date;
  title: string;
  author: string;
  language: string;
  analysis: string | null;
  comparative_analysis: string | null;
  web_detection: string | null;
  details: string;
};

const users = new Map<string, StoredUser>();
const scans: StoredScan[] = [];

const nextId = () => crypto.randomUUID();

export const fallbackStore = {
  findUserByEmail(email: string): StoredUser | null {
    for (const user of users.values()) {
      if (user.email === email) return user;
    }
    return null;
  },
  createUser(data: { name: string; email: string; password: string }): StoredUser {
    const created: StoredUser = {
      id: nextId(),
      name: data.name,
      email: data.email,
      password: data.password,
      createdAt: new Date(),
    };
    users.set(created.id, created);
    return created;
  },
  updateUserPassword(id: string, password: string): void {
    const user = users.get(id);
    if (!user) return;
    user.password = password;
  },
  createScan(data: Omit<StoredScan, 'id' | 'scanDate'>): StoredScan {
    const scan: StoredScan = {
      id: nextId(),
      scanDate: new Date(),
      ...data,
    };
    scans.push(scan);
    return scan;
  },
  listScansByUser(userId: string): StoredScan[] {
    return scans
      .filter((scan) => scan.userId === userId)
      .sort((a, b) => b.scanDate.getTime() - a.scanDate.getTime());
  },
};
