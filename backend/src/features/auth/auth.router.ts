import { Router } from "express";
import rateLimit from "express-rate-limit";
import { asyncHandler } from "../../shared/middleware/asyncHandler.js";
import { requireAuth } from "../../shared/middleware/requireAuth.js";
import { loginBodySchema, signupBodySchema } from "./auth.model.js";
import * as authService from "./auth.service.js";

export const authRouter = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
});

authRouter.post(
  "/signup",
  asyncHandler(async (req, res) => {
    const body = signupBodySchema.parse(req.body);
    const out = await authService.signup(body);
    res.status(201).json(out);
  }),
);

authRouter.post(
  "/login",
  loginLimiter,
  asyncHandler(async (req, res) => {
    const body = loginBodySchema.parse(req.body);
    const out = await authService.login(body);
    res.status(200).json(out);
  }),
);

authRouter.post(
  "/logout",
  requireAuth,
  asyncHandler(async (req, res) => {
    await authService.logout(req.userId!);
    res.status(204).send();
  }),
);
