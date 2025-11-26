// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // ไม่จำเป็นต้องใส่ datasourceUrl ถ้าใน schema.prisma ตั้งไว้แล้ว
    // แต่ใส่ไว้แบบนี้ก็ไม่ผิดครับ
    log: process.env.NODE_ENV === "development" 
        ? ["query", "error", "warn"] 
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;