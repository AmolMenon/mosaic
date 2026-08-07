import { Router } from "express";
import { requireAuth } from "../dependencies/auth";
import { formatSuccessResponse } from "../dependencies/responses";


import { PrismaClient } from "@prisma/client";

export const memosRouter: import("express").Router = Router();
const prisma = new PrismaClient();

memosRouter.get("/", requireAuth, async (req: any, res: any, next: any) => {
  try {
    const artifacts = await prisma.pipelineArtifact.findMany({
      where: { artifact_type: 'memo' }
    });
    
    res.json(formatSuccessResponse(artifacts.map(a => a.payload)));
  } catch (err) {
    next(err);
  }
});
