import { Router } from "express";
import { asyncHandler } from "../../shared/middleware/asyncHandler.js";
import { requireAuth } from "../../shared/middleware/requireAuth.js";
import { putFaceBodySchema } from "./face.model.js";
import * as faceService from "./face.service.js";

export const faceRouter = Router();

faceRouter.use(requireAuth);

faceRouter.put(
  "/",
  asyncHandler(async (req, res) => {
    const body = putFaceBodySchema.parse(req.body);
    const out = await faceService.saveTemplate(req.userId!, body);
    res.status(200).json(out);
  }),
);

faceRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const out = await faceService.getTemplate(req.userId!);
    res.json(out);
  }),
);

faceRouter.delete(
  "/",
  asyncHandler(async (req, res) => {
    await faceService.deleteTemplate(req.userId!);
    res.status(204).send();
  }),
);
