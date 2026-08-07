import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

import { Router } from "express";
import { requireAuth } from "../dependencies/auth";
import { formatSuccessResponse } from "../dependencies/responses";


import { PrismaClient } from "@prisma/client";

export const aiRouter: import("express").Router = Router();
const prisma = new PrismaClient({ adapter });

aiRouter.get("/", requireAuth, async (req: any, res: any, next: any) => {
  try {
    const proposals = await prisma.proposal.findMany({
      orderBy: { created_at: 'desc' }
    });

    res.json(formatSuccessResponse(proposals.map((p: any) => p.payload)));
  } catch (err) {
    next(err);
  }
});
