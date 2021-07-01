const rateLimit = require('express-rate-limit');
const { RATE_LIMIT } = require('./errorsMessages');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: RATE_LIMIT,
});

module.exports = limiter;
