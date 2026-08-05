import { Router } from "express";
import { requireAuth } from "../dependencies/auth";
import { formatSuccessResponse } from "../dependencies/responses";
import { PrismaClient } from "@prisma/client";

export const dataRoomRouter = Router();
const prisma = new PrismaClient();

dataRoomRouter.get("/documents", requireAuth, async (req: any, res: any, next: any) => {
  try {
    const documents = await prisma.document.findMany({
      where: { organizationId: req.principal.organizationId }
    });
    res.json(formatSuccessResponse(documents));
  } catch (err) {
    next(err);
  }
});

dataRoomRouter.get("/questions", requireAuth, async (req: any, res: any, next: any) => {
  try {
    const { mockProjectQuestions } = require("@mosaic/testing");
    res.json(formatSuccessResponse(mockProjectQuestions));
  } catch (err) {
    next(err);
  }
});
