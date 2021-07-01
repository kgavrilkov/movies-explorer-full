const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../configs/config');
const UnauthorizedError = require('../errors/unauthorized-error');
const { NOT_AUTHORIZED } = require('../configs/errorsMessages');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError(NOT_AUTHORIZED);
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new UnauthorizedError(NOT_AUTHORIZED);
  }
  req.user = payload;
  next();
};

module.exports = auth;
