import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  adapter: {
    provider: "postgresql", // หรือ "mysql", "sqlite"
    url: process.env.DATABASE_URL, // connection string จาก .env.local
  },
});
