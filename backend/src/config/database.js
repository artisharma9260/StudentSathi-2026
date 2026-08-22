const mongoose = require('mongoose');
const config = require('./index');
const logger = require('../utils/logger');

mongoose.set('strictQuery', true);

async function connectDatabase() {
  try {
    await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 15_000,
      autoIndex: !config.isProd,
    });
    logger.info(`✅ MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
  } catch (err) {
    logger.error({ err }, '❌ MongoDB connection failed');
    throw err;
  }

  mongoose.connection.on('disconnected', () => logger.warn('⚠️  MongoDB disconnected'));
  mongoose.connection.on('reconnected', () => logger.info('🔄 MongoDB reconnected'));
}

async function disconnectDatabase() {
  await mongoose.disconnect();
  logger.info('MongoDB disconnected cleanly.');
}

module.exports = { connectDatabase, disconnectDatabase };
