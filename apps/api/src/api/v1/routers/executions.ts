import { Router } from "express";
import { requireAuth } from "../dependencies/auth";
import { formatSuccessResponse } from "../dependencies/responses";
import { ApiException } from "../schemas/errors/errors";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

export const executionsRouter = Router();
const prisma = new PrismaClient();

executionsRouter.post("/", requireAuth, async (req: any, res: any, next: any) => {
  try {
    const { projectId, documentId } = req.body;
    
    if (!projectId || !documentId) {
      throw new ApiException(400, "INVALID_INPUT", "Project ID and Document ID are required.");
    }
    
    // In a real app we would check if project/doc exists and user has access
    const execution = await prisma.execution.create({
      data: {
        projectId,
        status: "PENDING",
        context_snapshot: { documentId }
      }
    });
    
    res.status(202).json(formatSuccessResponse(execution));
  } catch (err) {
    next(err);
  }
});

executionsRouter.get("/:id/status", requireAuth, async (req: any, res: any, next: any) => {
  try {
    const execution = await prisma.execution.findUnique({
      where: { id: req.params.id }
    });
    
    if (!execution) {
      throw new ApiException(404, "NOT_FOUND", "Execution not found");
    }
    
    res.json(formatSuccessResponse(execution));
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
