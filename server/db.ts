import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export const prisma = global.__prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.__prisma = prisma;
}

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("Connected to Prisma SQL Database");
    return true;
  } catch (error) {
    console.warn(`\n*** Database Connection Failed ***`);
    console.warn(`Error: ${(error as Error).message}\n`);
    return false;
  }
};
