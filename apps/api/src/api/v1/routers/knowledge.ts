import { Router } from "express";
import { requireAuth } from "../dependencies/auth";
import { formatSuccessResponse } from "../dependencies/responses";


import { PrismaClient } from "@prisma/client";

export const knowledgeRouter = Router();
const prisma = new PrismaClient();

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
