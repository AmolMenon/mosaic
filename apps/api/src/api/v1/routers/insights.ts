import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

import { Router } from "express";
import { requireAuth } from "../dependencies/auth";
import { formatSuccessResponse } from "../dependencies/responses";


export const insightsRouter: import("express").Router = Router();

insightsRouter.get("/", requireAuth, async (req: any, res: any, next: any) => {
  try {
    const { PrismaClient } = require("@prisma/client");
    const prisma = new PrismaClient({ adapter });
    
    // We should filter by user organization in a real app, but for now we'll fetch all insight artifacts
    const artifacts = await prisma.pipelineArtifact.findMany({
      where: { artifact_type: 'insight' }
    });
    
    res.json(formatSuccessResponse(artifacts.map((a: any) => a.payload)));
  } catch (err) {
    next(err);
  }
});
