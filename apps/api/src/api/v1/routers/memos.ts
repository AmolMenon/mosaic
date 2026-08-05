import { Router } from "express";
import { requireAuth } from "../dependencies/auth";
import { formatSuccessResponse } from "../dependencies/responses";
import { mockMemoApolloIC, mockMemoBlockPrinciple, mockMemoBlockArgument } from "@mosaic/testing";

export const memosRouter = Router();

memosRouter.get("/", requireAuth, async (req: any, res: any, next: any) => {
  try {
    res.json(formatSuccessResponse({
      memoApolloIC: mockMemoApolloIC,
      memoBlockPrinciple: mockMemoBlockPrinciple,
      memoBlockArgument: mockMemoBlockArgument
    }));
  } catch (err) {
    next(err);
  }
});
