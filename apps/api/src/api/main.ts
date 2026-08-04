import express from "express";
import { healthRouter } from "./v1/routers/health";
import { projectsRouter } from "./v1/routers/projects";
import { executionsRouter } from "./v1/routers/executions";
import { requestIdMiddleware } from "./v1/middleware/requestId";
import { timingMiddleware } from "./v1/middleware/timing";
import { loggingMiddleware } from "./v1/middleware/logging";
import { errorHandlingMiddleware } from "./v1/middleware/errorHandling";

export const app = express();

app.use(express.json());
app.use(requestIdMiddleware);
app.use(timingMiddleware);
app.use(loggingMiddleware);

const v1Router = express.Router();
v1Router.use("/health", healthRouter);
v1Router.use("/projects", projectsRouter);
v1Router.use("/executions", executionsRouter);

app.use("/api/v1", v1Router);

// Must be registered last
app.use(errorHandlingMiddleware);
