import { Router } from "express";
import { asyncHandler } from "../../shared/middleware/asyncHandler.js";
import { requireAuth } from "../../shared/middleware/requireAuth.js";
import { addFundsBodySchema } from "./wallet.model.js";
import * as walletService from "./wallet.service.js";

export const walletRouter = Router();

walletRouter.use(requireAuth);

walletRouter.get(
  "/balance",
  asyncHandler(async (req, res) => {
    const out = await walletService.getBalance(req.userId!);
    res.json(out);
  }),
);

walletRouter.post(
  "/add-funds",
  asyncHandler(async (req, res) => {
    const body = addFundsBodySchema.parse(req.body);
    const out = await walletService.addFunds(req.userId!, body);
    res.status(200).json(out);
  }),
);
