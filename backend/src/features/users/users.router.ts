import { Router } from "express";
import { asyncHandler } from "../../shared/middleware/asyncHandler.js";
import { requireAuth } from "../../shared/middleware/requireAuth.js";
import { listUsersQuerySchema } from "./users.model.js";
import * as usersService from "./users.service.js";

export const usersRouter = Router();

usersRouter.use(requireAuth);

usersRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const q = listUsersQuerySchema.parse(req.query);
    const out = await usersService.listUsers(req.userId!, q);
    res.json(out);
  }),
);

usersRouter.get(
  "/:userId",
  asyncHandler(async (req, res) => {
    const userId = Array.isArray(req.params.userId)
      ? req.params.userId[0]
      : req.params.userId;
    const out = await usersService.getUserById(req.userId!, userId);
    res.json(out);
  }),
);
