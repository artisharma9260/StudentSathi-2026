/**
 * StudentSathi — server entrypoint.
 * Connects to MongoDB, boots Express app, wires cron jobs and graceful shutdown.
 */
require('dotenv').config();

const app = require('./src/app');
const { connectDatabase, disconnectDatabase } = require('./src/config/database');
const logger = require('./src/utils/logger');
const config = require('./src/config');

async function bootstrap() {
  await connectDatabase();

  const server = app.listen(config.port, () => {
    logger.info(
      { port: config.port, env: config.nodeEnv, docs: `${config.apiPrefix}/docs` },
      `🚀 StudentSathi API running on :${config.port}`
    );
  });

  const shutdown = async (signal) => {
    logger.warn({ signal }, 'Shutting down…');
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
    // Force exit after 10s
    setTimeout(() => process.exit(1), 10_000).unref();
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('unhandledRejection', (err) => {
    logger.error({ err }, 'Unhandled rejection');
  });
  process.on('uncaughtException', (err) => {
    logger.fatal({ err }, 'Uncaught exception');
    shutdown('uncaughtException');
  });
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Fatal boot error:', err);
  process.exit(1);
});
