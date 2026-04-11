import { Router } from "express";
import { asyncHandler } from "../../shared/middleware/asyncHandler.js";
import { requireAuth } from "../../shared/middleware/requireAuth.js";
import * as profileService from "./profile.service.js";

export const profileRouter = Router();

profileRouter.use(requireAuth);

profileRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const out = await profileService.getMe(req.userId!);
    res.json(out);
  }),
);

profileRouter.get(
  "/security-summary",
  asyncHandler(async (req, res) => {
    const out = await profileService.getSecuritySummary(req.userId!);
    res.json(out);
  }),
);

profileRouter.get(
  "/receive-qr",
  asyncHandler(async (req, res) => {
    const out = await profileService.getReceiveQr(req.userId!);
    res.json(out);
  }),
);
