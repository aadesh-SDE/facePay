import { loadBackendEnv } from "./shared/lib/loadBackendEnv.js";

loadBackendEnv();
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import pino from "pino";
import { loadEnv, corsOriginList } from "./shared/lib/env.js";
import { errorHandler } from "./shared/middleware/errorHandler.js";
import { authRouter } from "./features/auth/auth.router.js";
import { usersRouter } from "./features/users/users.router.js";
import { walletRouter } from "./features/wallet/wallet.router.js";
import { transactionsRouter } from "./features/transactions/transactions.router.js";
import { transfersRouter } from "./features/transfers/transfers.router.js";
import { faceRouter } from "./features/face/face.router.js";
import { profileRouter } from "./features/profile/profile.router.js";

loadEnv();

const logger = pino({ level: process.env.NODE_ENV === "production" ? "info" : "debug" });

export const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (corsOriginList().includes(origin)) return cb(null, true);
      return cb(null, false);
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "2mb" }));
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    logger.info({
      method: req.method,
      url: req.url,
      status: res.statusCode,
      ms: Date.now() - start,
    });
  });
  next();
});

const globalLimiter = rateLimit({ windowMs: 60_000, max: 300, standardHeaders: true });
app.use(globalLimiter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/me/wallet", walletRouter);
app.use("/api/v1/me/transactions", transactionsRouter);
app.use("/api/v1/me/face-template", faceRouter);
app.use("/api/v1/me", profileRouter);
app.use("/api/v1/transfers", transfersRouter);

app.use(errorHandler);
