const { DomainError } = require('../../../domain/errors/DomainError');

/* eslint-disable no-unused-vars */
function errorHandler(err, req, res, next) {
  if (err instanceof DomainError) {
    return res.status(err.statusCode || 400).json({
      error: err.name,
      message: err.message,
    });
  }

  if (err.isJoi) {
    return res.status(400).json({
      error: 'ValidationError',
      message: err.details.map((d) => d.message).join(', '),
    });
  }

  // eslint-disable-next-line no-console
  console.error(err);
  return res.status(500).json({
    error: 'InternalServerError',
    message: 'Ha ocurrido un error inesperado',
  });
}
/* eslint-enable no-unused-vars */

module.exports = errorHandler;
