import { Router } from "express";
import { requireAuth } from "../dependencies/auth";
import { formatSuccessResponse } from "../dependencies/responses";
import { ApiException } from "../schemas/errors/errors";

export const executionsRouter = Router();

const mockExecutionService = {
  createExecution: async (projectId: string, documentId: string) => {
    if (!projectId || !documentId) {
      throw new ApiException(400, "INVALID_INPUT", "Project ID and Document ID are required.");
    }
    return { executionId: "exec_123", status: "PENDING" };
  },
  getStatus: async (executionId: string) => {
    return { executionId, status: "RUNNING" };
  }
};

executionsRouter.post("/", requireAuth, async (req: any, res: any, next: any) => {
  try {
    const { projectId, documentId } = req.body;
    const execution = await mockExecutionService.createExecution(projectId, documentId);
    res.status(202).json(formatSuccessResponse(execution));
  } catch (err) {
    next(err);
  }
});

executionsRouter.get("/:id/status", requireAuth, async (req: any, res: any, next: any) => {
  try {
    const status = await mockExecutionService.getStatus(req.params.id);
    res.json(formatSuccessResponse(status));
  } catch (err) {
    next(err);
  }
});

executionsRouter.get("/:id/stream", requireAuth, (req: any, res: any) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  // Heartbeat to prevent ALB/NGINX from closing idle connections
  const heartbeatInterval = setInterval(() => {
    res.write(`:\n\n`);
  }, 15000);

  // Send initial data
  res.write(`data: ${JSON.stringify({ status: "RUNNING", progress: 0 })}\n\n`);

  // Simulate progress
  let progress = 0;
  const progressInterval = setInterval(() => {
    progress += 20;
    if (progress <= 100) {
      res.write(`data: ${JSON.stringify({ status: progress === 100 ? "COMPLETED" : "RUNNING", progress })}\n\n`);
    }
  }, 2000);

  // Clean up ALL listeners and intervals on disconnect to prevent memory leaks
  req.on("close", () => {
    clearInterval(heartbeatInterval);
    clearInterval(progressInterval);
    res.end();
  });
});
