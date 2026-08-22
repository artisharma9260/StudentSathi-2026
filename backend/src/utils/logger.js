const pino = require('pino');
const config = require('../config');

const logger = pino({
  level: config.logLevel,
  transport:
    config.nodeEnv === 'development'
      ? { target: 'pino-pretty', options: { colorize: true, translateTime: 'SYS:standard' } }
      : undefined,
  base: { service: 'studentsathi-api' },
});

module.exports = logger;
