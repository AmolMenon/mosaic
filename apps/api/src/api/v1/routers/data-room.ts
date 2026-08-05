import { Router } from "express";
import { requireAuth } from "../dependencies/auth";
import { formatSuccessResponse } from "../dependencies/responses";
import { mockDocumentCIM, mockDocumentTranscripts, mockProjectQuestions } from "@mosaic/testing";

export const dataRoomRouter = Router();

dataRoomRouter.get("/documents", requireAuth, async (req: any, res: any, next: any) => {
  try {
    const documents = [mockDocumentCIM, mockDocumentTranscripts];
    res.json(formatSuccessResponse(documents));
  } catch (err) {
    next(err);
  }
});

dataRoomRouter.get("/questions", requireAuth, async (req: any, res: any, next: any) => {
  try {
    res.json(formatSuccessResponse(mockProjectQuestions));
  } catch (err) {
    next(err);
  }
});
