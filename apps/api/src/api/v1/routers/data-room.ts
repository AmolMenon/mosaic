import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

import { Router } from "express";
import { requireAuth } from "../dependencies/auth";
import { formatSuccessResponse } from "../dependencies/responses";
import { PrismaClient } from "@prisma/client";

export const dataRoomRouter: import("express").Router = Router();
const prisma = new PrismaClient({ adapter });

dataRoomRouter.get("/documents", requireAuth, async (req: any, res: any, next: any) => {
  try {
    const documents = await prisma.document.findMany({
      where: { organizationId: req.principal.organizationId }
    });
    res.json(formatSuccessResponse(documents));
  } catch (err) {
    next(err);
  }
});

dataRoomRouter.get("/questions", requireAuth, async (req: any, res: any, next: any) => {
  try {
    const questions = await prisma.projectQuestion.findMany({
      where: {
        project: {
          organizationId: req.principal.organizationId
        }
      }
    });
    res.json(formatSuccessResponse(questions));
  } catch (err) {
    next(err);
  }
});
