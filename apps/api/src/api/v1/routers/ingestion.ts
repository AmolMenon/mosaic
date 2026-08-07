import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

import { Router } from "express";
import { requireAuth } from "../dependencies/auth";
import { formatSuccessResponse } from "../dependencies/responses";
import { S3StorageProvider } from "../../../infrastructure/storage/S3StorageProvider";
import { PrismaClient } from "@prisma/client";
import multer from "multer";

const storageProvider = new S3StorageProvider();
const prisma = new PrismaClient({ adapter });
const upload = multer({ storage: multer.memoryStorage() });

export const ingestionRouter: import("express").Router = Router();

ingestionRouter.get("/", requireAuth, async (req: any, res: any, next: any) => {
  try {
    const documents = await prisma.document.findMany({
      where: { organizationId: req.principal.organizationId }
    });
    res.json(formatSuccessResponse({ documents }));
  } catch (err) {
    next(err);
  }
});

ingestionRouter.post("/upload", requireAuth, upload.single("document"), async (req: any, res: any, next: any) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    
    // Upload to S3
    const prefix = `org_${req.principal.organizationId}/project_${req.body.projectId || 'default'}`;
    const storedArtifact = await storageProvider.uploadArtifact(req.file.buffer, prefix);
    
    // Record in PostgreSQL
    const document = await prisma.document.create({
      data: {
        organizationId: req.principal.organizationId,
        projectId: req.body.projectId || null,
        s3Key: storedArtifact.uri,
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        sizeBytes: req.file.size,
        uploadedById: req.principal.id
      }
    });

    res.json(formatSuccessResponse({
      message: "File uploaded successfully",
      document: document
    }));
  } catch (err) {
    next(err);
  }
});
