const NotFoundError = require('../errors/not-found-error');
const { RESOURCE_NOT_FOUND } = require('../configs/errorsMessages');

const notFoundPathErrorHandler = (req, res, next) => {
  Promise.reject(new NotFoundError(RESOURCE_NOT_FOUND))
    .catch(next);
};

module.exports = notFoundPathErrorHandler;
