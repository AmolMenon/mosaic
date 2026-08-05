import { Router } from "express";
import { requireAuth } from "../dependencies/auth";
import { formatSuccessResponse } from "../dependencies/responses";
import { mockPipelineTranscript } from "@mosaic/testing";

import multer from "multer";
import fs from "fs";
import path from "path";

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

export const ingestionRouter = Router();

ingestionRouter.get("/", requireAuth, async (req: any, res: any, next: any) => {
  try {
    res.json(formatSuccessResponse({
      pipelineTranscript: mockPipelineTranscript
    }));
  } catch (err) {
    next(err);
  }
});

ingestionRouter.post("/upload", requireAuth, upload.single("document"), async (req: any, res: any, next: any) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    
    // Create a mock pipeline response simulating the newly uploaded file
    const newPipeline = {
      ...mockPipelineTranscript,
      id: `pipeline-${Date.now()}`,
      documentId: req.file.originalname,
      status: "running"
    };

    res.json(formatSuccessResponse({
      message: "File uploaded successfully",
      file: req.file,
      pipeline: newPipeline
    }));
  } catch (err) {
    next(err);
  }
});
