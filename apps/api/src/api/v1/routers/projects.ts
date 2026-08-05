import { Router } from "express";
import { requireAuth } from "../dependencies/auth";
import { parsePagination } from "../dependencies/pagination";
import { formatSuccessResponse } from "../dependencies/responses";
import { ApiException } from "../schemas/errors/errors";
import { mockProjectLBO } from "@mosaic/testing";

export const projectsRouter = Router();

let projectsStore: any[] = [mockProjectLBO];

const mockProjectService = {
  listProjects: async (limit: number, cursor?: string) => {
    return {
      projects: projectsStore,
      nextCursor: null,
      hasMore: false
    };
  },
  getProject: async (id: string) => {
    const proj = projectsStore.find(p => p.id === id);
    if (proj || id === 'defaultProjectId') return proj || mockProjectLBO;
    throw new ApiException(404, "NOT_FOUND", "Project not found");
  },
  createProject: async (name: string) => {
    if (!name) throw new ApiException(400, "INVALID_INPUT", "Project name is required.");
    const newProj = { ...mockProjectLBO, id: `proj_${Date.now()}`, name };
    projectsStore.push(newProj);
    return newProj;
  }
};

projectsRouter.get("/", requireAuth, parsePagination, async (req: any, res: any, next: any) => {
  try {
    const { limit, cursor } = req.paginationParams;
    const result = await mockProjectService.listProjects(limit, cursor);
    
    res.json(formatSuccessResponse(result.projects, {
      next_cursor: result.nextCursor,
      has_more: result.hasMore
    }));
  } catch (err) {
    next(err);
  }
});

projectsRouter.get("/:id", requireAuth, async (req: any, res: any, next: any) => {
  try {
    const project = await mockProjectService.getProject(req.params.id);
    res.json(formatSuccessResponse(project));
  } catch (err) {
    next(err);
  }
});

projectsRouter.get("/:id/insights", requireAuth, async (req: any, res: any, next: any) => {
  try {
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
    const project = await mockProjectService.createProject(name);
    res.status(201).json(formatSuccessResponse(project));
  } catch (err) {
    next(err);
  }
});
