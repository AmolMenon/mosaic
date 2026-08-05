import { Router } from "express";
import { requireAuth } from "../dependencies/auth";
import { parsePagination } from "../dependencies/pagination";
import { formatSuccessResponse } from "../dependencies/responses";
import { ApiException } from "../schemas/errors/errors";
import { PrismaClient } from "@prisma/client";

export const projectsRouter = Router();
const prisma = new PrismaClient();

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
    // Keep mock insights since insights are a separate domain
    const { mockInsight1, mockClaim1, mockClaim2, mockEvidence1, mockEvidence2, mockLink1, mockLink2 } = require("@mosaic/testing");
    res.json(formatSuccessResponse({
      insight: mockInsight1,
      claims: [mockClaim1, mockClaim2],
      evidence: [mockEvidence1, mockEvidence2],
      links: [mockLink1, mockLink2]
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
