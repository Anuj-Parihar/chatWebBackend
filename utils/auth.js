const jwt = require('jsonwebtoken');
const config = require('../config/config');

exports.createToken = (payload) => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpire
  });
};