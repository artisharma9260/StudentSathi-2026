const ApiError = require('../utils/ApiError');

/**
 * Role-based access control. Usage: requireRole('admin') or requireRole('admin', 'moderator').
 */
function requireRole(...roles) {
  return (req, _res, next) => {
    if (!req.user) return next(ApiError.unauthorized());
    if (!roles.includes(req.user.role)) return next(ApiError.forbidden('Admin access required'));
    next();
  };
}

module.exports = { requireRole, requireAdmin: requireRole('admin') };
