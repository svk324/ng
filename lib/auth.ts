// File: src/lib/auth.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function authenticateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.isAdmin) return null;

  const isValid = await bcrypt.compare(password, user.password);
  return isValid ? user : null;
}
