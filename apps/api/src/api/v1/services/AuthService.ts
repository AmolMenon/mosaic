import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient({ adapter });
const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_ISSUER = "mosaic-os";
const JWT_AUDIENCE = "mosaic-api";

export class AuthService {
  static async verifyToken(token: string) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET, {
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
      }) as { userId: string };

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: {
          memberships: true,
        }
      });

      return user;
    } catch (e) {
      return null;
    }
  }

  static async createSession(userId: string) {
    const token = jwt.sign(
      { userId },
      JWT_SECRET,
      {
        expiresIn: "7d",
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
      }
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Save session in DB as well to allow manual revocation if needed
    const session = await prisma.session.create({
      data: {
        userId,
        token,
        expiresAt
      }
    });

    return session;
  }
}
