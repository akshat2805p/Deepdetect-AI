import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

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
