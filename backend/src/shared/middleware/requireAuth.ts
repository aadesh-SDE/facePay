import type { RequestHandler } from "express";
import { verifyAccessToken } from "../lib/jwt.js";
import { HttpError } from "../lib/httpError.js";

export const requireAuth: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(new HttpError(401, "UNAUTHORIZED", "Missing or invalid Authorization header"));
  }
  const token = header.slice("Bearer ".length).trim();
  if (!token) {
    return next(new HttpError(401, "UNAUTHORIZED", "Missing token"));
  }
  try {
    const { sub } = verifyAccessToken(token);
    req.userId = sub;
    next();
  } catch {
    next(new HttpError(401, "UNAUTHORIZED", "Invalid or expired token"));
  }
};
