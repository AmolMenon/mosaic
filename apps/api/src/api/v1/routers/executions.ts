import { Router } from "express";
import { requireAuth } from "../dependencies/auth";
import { formatSuccessResponse } from "../dependencies/responses";
import { ApiException } from "../schemas/errors/errors";
import { PrismaClient } from "@prisma/client";
import { WorkflowExecutor } from "../../../engine/WorkflowExecutor";
import { createExecutionContext } from "../../../engine/ExecutionContext";
import { ProviderRegistry } from "../../../engine/ProviderRegistry";
import { Database } from "../../../infrastructure/persistence/database/Database";
import { pipeline } from "stream";

export const executionsRouter: import("express").Router = Router();
const prisma = new PrismaClient();
const db = new Database();

executionsRouter.post("/", requireAuth, async (req: any, res: any, next: any) => {
  try {
    const { projectId, documentId } = req.body;
    
    if (!projectId || !documentId) {
      throw new ApiException(400, "INVALID_INPUT", "Project ID and Document ID are required.");
    }
    
    // Create execution row in DB
    const execution = await prisma.execution.create({
      data: {
        pipeline_id: projectId, // pipeline_id in schema means project_id
        document_id: documentId,
        status: "PENDING",
        progress_state: "CREATED",
        version: 1
      }
    });

    // Create execution context
    const registry = new ProviderRegistry();
    // Register the actual providers to run the actual inference
    const { EntityExtractionProvider } = require("../../../providers/entity-extraction/EntityExtractionProvider");
    const { HypothesisGenerationProvider } = require("../../../providers/hypothesis-generation/HypothesisGenerationProvider");
    const { ICReviewProvider } = require("../../../providers/ic-review/ICReviewProvider");
    
    registry.register("EntityExtraction", async (inputs: any, context: any) => {
      const provider = new EntityExtractionProvider();
      await provider.initialize({ providerId: "entity_extraction" });
      return provider.execute(inputs, context);
    });

    registry.register("HypothesisGeneration", async (inputs: any, context: any) => {
      const provider = new HypothesisGenerationProvider();
      await provider.initialize({ providerId: "hypothesis_generation" });
      return provider.execute(inputs, context);
    });

    registry.register("ICReview", async (inputs: any, context: any) => {
      const provider = new ICReviewProvider();
      await provider.initialize({ providerId: "ic_review" });
      return provider.execute(inputs, context);
    });

    const context = createExecutionContext(execution.execution_id, documentId, registry, db);
    const executor = new WorkflowExecutor(context);

    const actualPipeline = {
      id: execution.execution_id,
      version: "1.0",
      description: "Default pipeline",
      stages: [
        {
          id: "extract_entities",
          type: "entity_extraction",
          contract: {
            inputArtifactTypes: ["TextChunk"],
            outputArtifactTypes: ["Entity", "Relationship"]
          },
          inputArtifactIds: [],
          outputArtifactIds: [],
          status: "pending",
          qualityGates: [],
          retryCount: 0
        },
        {
          id: "generate_hypothesis",
          type: "hypothesis_generation",
          contract: {
            inputArtifactTypes: ["Entity", "Relationship"],
            outputArtifactTypes: ["HypothesisProposal"]
          },
          inputArtifactIds: [],
          outputArtifactIds: [],
          status: "pending",
          qualityGates: [],
          retryCount: 0
        },
        {
          id: "review_ic",
          type: "ic_review",
          contract: {
            inputArtifactTypes: ["HypothesisProposal"],
            outputArtifactTypes: ["Review"]
          },
          inputArtifactIds: [],
          outputArtifactIds: [],
          status: "pending",
          qualityGates: [],
          retryCount: 0
        }
      ]
    };

    // Execute in background
    setTimeout(() => {
      executor.execute(actualPipeline as any, {
        "extract_entities": "EntityExtraction",
        "generate_hypothesis": "HypothesisGeneration",
        "review_ic": "ICReview"
      }).catch(err => {
        console.error("Background execution failed:", err);
      });
    }, 0);
    
    res.status(202).json(formatSuccessResponse(execution));
  } catch (err) {
    next(err);
  }
});

executionsRouter.get("/:id/status", requireAuth, async (req: any, res: any, next: any) => {
  try {
    const execution = await prisma.execution.findUnique({
      where: { execution_id: req.params.id }
    });
    
    if (!execution) {
      throw new ApiException(404, "NOT_FOUND", "Execution not found");
    }
    
    res.json(formatSuccessResponse(execution));
  } catch (err) {
    next(err);
  }
});

executionsRouter.get("/:id/stream", requireAuth, async (req: any, res: any) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const heartbeatInterval = setInterval(() => {
    res.write(`:\n\n`);
  }, 15000);

  // Poll database for execution status updates
  let isCompleted = false;
  const pollInterval = setInterval(async () => {
    try {
      const execution = await prisma.execution.findUnique({
        where: { execution_id: req.params.id }
      });
      
      if (!execution) return;

      res.write(`data: ${JSON.stringify({ status: execution.status, progressState: execution.progress_state })}\n\n`);

      if (['COMPLETED', 'FAILED', 'PAUSED'].includes(execution.status)) {
        isCompleted = true;
        clearInterval(pollInterval);
      }
    } catch (err) {
      console.error("Stream polling error:", err);
    }
  }, 2000);

  req.on("close", () => {
    clearInterval(heartbeatInterval);
    clearInterval(pollInterval);
    res.end();
  });
});
