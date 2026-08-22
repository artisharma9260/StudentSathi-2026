/**
 * Express app factory.
 * Wires middleware, routes, docs and error handling.
 */
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const swaggerUi = require('swagger-ui-express');

const config = require('./config');
const routes = require('./routes');
const { globalRateLimiter } = require('./middleware/rateLimiter');
const { errorHandler } = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');
const swaggerSpec = require('./config/swagger');
const logger = require('./utils/logger');

const app = express();

app.disable('x-powered-by');
app.set('trust proxy', 1);

// Security
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true);
      if (config.corsOrigins.includes('*') || config.corsOrigins.includes(origin)) {
        return cb(null, true);
      }
      return cb(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
  })
);

// Body parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

// Hardening
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use(compression());

// Logging
app.use(
  morgan(config.nodeEnv === 'development' ? 'dev' : 'combined', {
    stream: { write: (msg) => logger.info(msg.trim()) },
  })
);

// Health & meta
app.get('/health', (_req, res) =>
  res.json({ status: 'ok', service: 'studentsathi-api', ts: new Date().toISOString() })
);

// Rate limit for entire API surface (route-level limiter added on /ai)
app.use(config.apiPrefix, globalRateLimiter);

// Swagger docs
app.use(
  `${config.apiPrefix}/docs`,
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { customSiteTitle: 'StudentSathi API' })
);
app.get(`${config.apiPrefix}/docs.json`, (_req, res) => res.json(swaggerSpec));

// Domain routes
app.use(config.apiPrefix, routes);

// 404 + centralised error
app.use(notFound);
app.use(errorHandler);

module.exports = app;
