import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

import { Router } from "express";
import { requireAuth } from "../dependencies/auth";
import { parsePagination } from "../dependencies/pagination";
import { formatSuccessResponse } from "../dependencies/responses";
import { ApiException } from "../schemas/errors/errors";
import { PrismaClient } from "@prisma/client";

export const projectsRouter: import("express").Router = Router();
const prisma = new PrismaClient({ adapter });

projectsRouter.get("/", requireAuth, parsePagination, async (req: any, res: any, next: any) => {
  try {
    const { limit } = req.paginationParams;
    const organizationId = req.principal.organizationId;
    
    if (!organizationId) {
      return res.json(formatSuccessResponse([], { next_cursor: null, has_more: false }));
    }

    const projects = await prisma.project.findMany({
      where: { organizationId },
      take: limit,
      orderBy: { updatedAt: 'desc' }
    });
    
    res.json(formatSuccessResponse(projects, {
      next_cursor: null,
      has_more: false
    }));
  } catch (err) {
    next(err);
  }
});

projectsRouter.get("/:id", requireAuth, async (req: any, res: any, next: any) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id }
    });
    
    if (!project) {
      throw new ApiException(404, "NOT_FOUND", "Project not found");
    }
    
    // Authorization check
    if (project.organizationId !== req.principal.organizationId) {
      throw new ApiException(403, "FORBIDDEN", "Not authorized to access this project");
    }
    
    res.json(formatSuccessResponse(project));
  } catch (err) {
    next(err);
  }
});

projectsRouter.get("/:id/insights", requireAuth, async (req: any, res: any, next: any) => {
  try {
    const projectId = req.params.id;
    // Verify authorization
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });
    
    if (!project || project.organizationId !== req.principal.organizationId) {
      throw new ApiException(403, "FORBIDDEN", "Not authorized to access this project");
    }

    // Fetch real artifacts from pipeline executions for this project
    const artifacts = await prisma.pipelineArtifact.findMany({
      where: {
        execution: {
          pipeline_id: projectId
        }
      }
    });

    const insights = artifacts.filter(a => a.artifact_type === 'insight').map(a => a.payload);
    const claims = artifacts.filter(a => a.artifact_type === 'claim').map(a => a.payload);
    const evidence = artifacts.filter(a => a.artifact_type === 'evidence').map(a => a.payload);
    const links = artifacts.filter(a => a.artifact_type === 'link').map(a => a.payload);

    res.json(formatSuccessResponse({
      insights,
      claims,
      evidence,
      links
    }));
  } catch (err) {
    next(err);
  }
});

projectsRouter.post("/", requireAuth, async (req: any, res: any, next: any) => {
  try {
    const { name } = req.body;
    if (!name) throw new ApiException(400, "INVALID_INPUT", "Project name is required.");
    
    const project = await prisma.project.create({
      data: {
        name,
        organizationId: req.principal.organizationId,
        ownerId: req.principal.id,
        targetCompany: "Unknown",
        industry: "Unknown",
        dealType: "Unknown",
        status: "Active",
        stage: "Research",
        description: "",
        priority: "Medium",
        progress: 0,
        teamMembers: [],
        tags: []
      }
    });
    
    res.status(201).json(formatSuccessResponse(project));
  } catch (err) {
    next(err);
  }
});

projectsRouter.delete("/:id", requireAuth, async (req: any, res: any, next: any) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id }
    });
    
    if (!project) {
      throw new ApiException(404, "NOT_FOUND", "Project not found");
    }
    
    if (project.organizationId !== req.principal.organizationId) {
      throw new ApiException(403, "FORBIDDEN", "Not authorized to delete this project");
    }

    await prisma.project.delete({
      where: { id: req.params.id }
    });
    
    res.json(formatSuccessResponse({ deleted: true }));
  } catch (err) {
    next(err);
  }
});
