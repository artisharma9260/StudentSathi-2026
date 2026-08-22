const jwt = require('jsonwebtoken');
const config = require('../config');

function signAccessToken(user) {
  return jwt.sign(
    { sub: String(user._id || user.id), role: user.role, name: user.name },
    config.jwt.accessSecret,
    { expiresIn: config.jwt.accessExpires }
  );
}

function verifyAccessToken(token) {
  return jwt.verify(token, config.jwt.accessSecret);
}

module.exports = {
  signAccessToken,
  verifyAccessToken,
};
