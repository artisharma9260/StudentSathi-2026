const rateLimit = require('express-rate-limit');
const config = require('../config');

const globalRateLimiter = rateLimit({
  windowMs: config.rate.windowMs,
  max: config.rate.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please slow down.' },
});

// Tighter limiter for endpoints that trigger a live Gemini call, so a
// single client can't burn through the API quota by refreshing/filtering
// rapidly. The service also caches identical queries for a few minutes.
const aiSearchLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many scholarship searches, please wait a moment and try again.' },
});

module.exports = { globalRateLimiter, aiSearchLimiter };
