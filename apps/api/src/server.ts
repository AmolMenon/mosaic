import { app } from "./api/main";
import { logger } from "./utils/logger";
import { validateEnv } from "./infrastructure/config/env";

validateEnv();

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  logger.info(`Backend API running on port ${PORT}`);
});

const gracefulShutdown = (signal: string) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    logger.info('HTTP server closed.');
    process.exit(0);
  });

  // Force close after 10 seconds
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('uncaughtException', (err: Error) => {
  logger.error('Uncaught Exception:', { error: err.message, stack: err.stack });
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason: any, promise) => {
  logger.error('Unhandled Rejection at:', { promise, reason: reason?.toString() });
  gracefulShutdown('unhandledRejection');
});
