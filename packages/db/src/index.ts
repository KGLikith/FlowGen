import { PrismaClient, Prisma } from "@prisma/client";

// Prisma instance
export const prisma = new PrismaClient();

// Export Prisma types too
export type { Prisma } from "@prisma/client";
export * from "@prisma/client"; // optional, re-export all models/types
