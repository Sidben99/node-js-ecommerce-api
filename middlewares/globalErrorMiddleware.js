const errorHandlingOnDev = (error, res) => {
  res.status(error.statusCode).json({
    error,
    message: error.message,
    stack: error.stack,
  });
};

const errorHandlingOnProd = (error, res) => {
  const errorsMsg = error.errors || [];
  res.status(error.statusCode).json({
    message: error.message,
    errors: errorsMsg.map((err) => err.msg),
  });
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  err.isOperational = err.isOperational || false;

  if (process.env.NODE_ENV === 'dev') {
    return errorHandlingOnDev(err, res);
  }
  return errorHandlingOnProd(err, res);
};

module.exports = globalErrorHandler;
