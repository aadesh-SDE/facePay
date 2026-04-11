import { Router } from "express";
import { asyncHandler } from "../../shared/middleware/asyncHandler.js";
import { requireAuth } from "../../shared/middleware/requireAuth.js";
import { listTransactionsQuerySchema } from "./transactions.model.js";
import * as transactionsService from "./transactions.service.js";

export const transactionsRouter = Router();

transactionsRouter.use(requireAuth);

transactionsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const q = listTransactionsQuerySchema.parse(req.query);
    const out = await transactionsService.listTransactions(req.userId!, q);
    res.json(out);
  }),
);
