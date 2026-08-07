import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

import { Router } from "express";
import { requireAuth } from "../dependencies/auth";
import { formatSuccessResponse } from "../dependencies/responses";


import { PrismaClient } from "@prisma/client";

export const knowledgeRouter: import("express").Router = Router();
const prisma = new PrismaClient({ adapter });

knowledgeRouter.get("/", requireAuth, async (req: any, res: any, next: any) => {
  try {
    const artifacts = await prisma.pipelineArtifact.findMany({
      where: {
        artifact_type: {
          in: ['knowledge_asset', 'principle', 'taxonomy']
        }
      }
    });

    res.json(formatSuccessResponse(artifacts.map(a => a.payload)));
  } catch (err) {
    next(err);
  }
});
