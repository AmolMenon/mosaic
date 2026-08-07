import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

import { Router } from "express";
import { requireAuth } from "../dependencies/auth";
import { formatSuccessResponse } from "../dependencies/responses";


import { PrismaClient } from "@prisma/client";

export const questionsRouter: import("express").Router = Router();
const prisma = new PrismaClient({ adapter });

questionsRouter.get("/", requireAuth, async (req: any, res: any, next: any) => {
  try {
    const questions = await prisma.projectQuestion.findMany({
      where: {
        project: {
          organizationId: req.principal.organizationId
        }
      }
    });

    const artifacts = await prisma.pipelineArtifact.findMany({
      where: {
        artifact_type: {
          in: ['hypothesis', 'evidence']
        }
      }
    });

    res.json(formatSuccessResponse({
      questions,
      hypotheses: artifacts.filter(a => a.artifact_type === 'hypothesis').map(a => a.payload),
      evidence: artifacts.filter(a => a.artifact_type === 'evidence').map(a => a.payload)
    }));
  } catch (err) {
    next(err);
  }
});
