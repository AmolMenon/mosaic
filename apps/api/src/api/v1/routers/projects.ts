import { Router } from "express";
import { requireAuth } from "../dependencies/auth";
import { parsePagination } from "../dependencies/pagination";
import { formatSuccessResponse } from "../dependencies/responses";
import { ApiException } from "../schemas/errors/errors";

export const projectsRouter = Router();

// In a real app, this would be injected via constructor/DI framework
const mockProjectService = {
  listProjects: async (limit: number, cursor?: string) => {
    return {
      projects: [{ id: "proj_1", name: "Alpha" }],
      nextCursor: null,
      hasMore: false
    };
  },
  createProject: async (name: string) => {
    if (!name) throw new ApiException(400, "INVALID_INPUT", "Project name is required.");
    return { id: "proj_2", name };
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

projectsRouter.post("/", requireAuth, async (req: any, res: any, next: any) => {
  try {
    const { name } = req.body;
    const project = await mockProjectService.createProject(name);
    res.status(201).json(formatSuccessResponse(project));
  } catch (err) {
    next(err);
  }
});
