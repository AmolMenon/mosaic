import express from "express";
import { healthRouter } from "./v1/routers/health";
import { projectsRouter } from "./v1/routers/projects";
import { executionsRouter } from "./v1/routers/executions";
import { dataRoomRouter } from "./v1/routers/data-room";
import { narrativesRouter } from "./v1/routers/narratives";
import { insightsRouter } from "./v1/routers/insights";
import { ingestionRouter } from "./v1/routers/ingestion";
import { memosRouter } from "./v1/routers/memos";
import { discoveryRouter } from "./v1/routers/discovery";
import { knowledgeRouter } from "./v1/routers/knowledge";
import { aiRouter } from "./v1/routers/ai";
import { questionsRouter } from "./v1/routers/questions";
import { requestIdMiddleware } from "./v1/middleware/requestId";
import { timingMiddleware } from "./v1/middleware/timing";
import { jsonLogger } from "./v1/middleware/logging";
import { errorHandlingMiddleware } from "./v1/middleware/errorHandling";

import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";

export const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3001",
  credentials: true,
}));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use("/api/", apiLimiter);

app.use(express.json());
app.use(requestIdMiddleware);
app.use(timingMiddleware);
app.use(jsonLogger);

const v1Router = express.Router();
v1Router.use("/health", healthRouter);
v1Router.use("/projects", projectsRouter);
v1Router.use("/executions", executionsRouter);
v1Router.use("/data-room", dataRoomRouter);
v1Router.use("/narratives", narrativesRouter);
v1Router.use("/insights", insightsRouter);
v1Router.use("/ingestion", ingestionRouter);
v1Router.use("/memos", memosRouter);
v1Router.use("/discovery", discoveryRouter);
v1Router.use("/knowledge", knowledgeRouter);
v1Router.use("/ai", aiRouter);
v1Router.use("/questions", questionsRouter);

app.use("/api/v1", v1Router);

// Must be registered last
app.use(errorHandlingMiddleware);
