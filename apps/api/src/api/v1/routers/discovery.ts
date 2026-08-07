import { Router } from "express";
import { requireAuth } from "../dependencies/auth";
import { formatSuccessResponse } from "../dependencies/responses";


import { PrismaClient } from "@prisma/client";

export const discoveryRouter = Router();
const prisma = new PrismaClient();

discoveryRouter.get("/", requireAuth, async (req: any, res: any, next: any) => {
  try {
    // In a real app we would have a dedicated discovery model or use a graph database.
    // For this implementation, we return pipeline artifacts as discovery nodes.
    const artifacts = await prisma.pipelineArtifact.findMany({
      take: 50,
      orderBy: { created_at: 'desc' }
    });

    res.json(formatSuccessResponse(artifacts.map(a => a.payload)));
  } catch (err) {
    next(err);
  }
});
