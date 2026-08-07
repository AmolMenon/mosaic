import { Router } from "express";
import { requireAuth } from "../dependencies/auth";
import { formatSuccessResponse } from "../dependencies/responses";


import { PrismaClient } from "@prisma/client";

export const aiRouter: import("express").Router = Router();
const prisma = new PrismaClient();

aiRouter.get("/", requireAuth, async (req: any, res: any, next: any) => {
  try {
    const proposals = await prisma.proposal.findMany({
      orderBy: { created_at: 'desc' }
    });

    res.json(formatSuccessResponse(proposals.map(p => p.payload)));
  } catch (err) {
    next(err);
  }
});
