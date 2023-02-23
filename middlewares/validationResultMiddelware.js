const { validationResult } = require('express-validator');

const ApiError = require('../utils/apiError');

const validationResultHandler = (req, res, next) => {
  const err = validationResult(req);
  console.log('req.body : ', req.body);
  //console.log('error from validator : ', err);
  if (!err.isEmpty()) {
    const validationErr = new ApiError('validation error', 400);
    validationErr.errors = err.errors;
    next(validationErr);
  }
  next();
};

module.exports = validationResultHandler;
