const { verifyAccessToken } = require('../services/tokenService');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Requires a valid access token. Attaches `req.user`.
 */
const requireAuth = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : req.cookies?.accessToken;
  if (!token) throw ApiError.unauthorized('Authentication token missing');

  const payload = verifyAccessToken(token);
  const user = await User.findById(payload.sub).lean();
  if (!user) throw ApiError.unauthorized('User no longer exists');

  req.user = { id: String(user._id), role: user.role, name: user.name, email: user.email };
  next();
});

/**
 * Best-effort auth — if a token is present it decodes it, otherwise continues anonymously.
 */
const optionalAuth = asyncHandler(async (req, _res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : req.cookies?.accessToken;
    if (token) {
      const payload = verifyAccessToken(token);
      const user = await User.findById(payload.sub).lean();
      if (user) req.user = { id: String(user._id), role: user.role, name: user.name, email: user.email };
    }
  } catch (_) { /* ignore */ }
  next();
});

module.exports = { requireAuth, optionalAuth };
