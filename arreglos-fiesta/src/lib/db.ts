import { PrismaClient } from "@prisma/client";

// Reutiliza una sola instancia en desarrollo (hot reload crea módulos nuevos).
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
