import { Router } from "express";
import { asyncHandler } from "../../shared/middleware/asyncHandler.js";
import { requireAuth } from "../../shared/middleware/requireAuth.js";
import { HttpError } from "../../shared/lib/httpError.js";
import { transferBodySchema } from "./transfers.model.js";
import * as transfersService from "./transfers.service.js";

export const transfersRouter = Router();

transfersRouter.use(requireAuth);

transfersRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const raw = req.headers["idempotency-key"];
    const idempotencyKey = Array.isArray(raw) ? raw[0] : raw;
    if (!idempotencyKey || idempotencyKey.length > 128) {
      throw new HttpError(400, "MISSING_IDEMPOTENCY_KEY", "Idempotency-Key header required (max 128 chars)");
    }
    const body = transferBodySchema.parse(req.body);
    const { response, isReplay } = await transfersService.executeTransfer(
      req.userId!,
      idempotencyKey,
      body,
    );
    res.status(isReplay ? 200 : 201).json(response);
  }),
);
