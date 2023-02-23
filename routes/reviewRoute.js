const route = require('express').Router({ mergeParams: true });

// import controllers
const {
  getReview,
  getReviews,
  createReview,
  updateReview,
  deleteReview,
} = require('../controller/reviewsController');

// import validators
const {
  getReviewValidators,
  createReviewValidators,
  updateReviewValidators,
  deleteReviewValidators,
  getReviewsValidators,
} = require('../utils/validators/reviewValidation');
// middlewares
const validationResultHandler = require('../middlewares/validationResultMiddelware');

// auth middlewares
const {
  protectRoutesHandler,
  allowedTo,
} = require('../controller/authController');

// custom middlewares
const setProductAndUserIdOnBody = (req, res, next) => {
  const { productId } = req.params;
  const { _id } = req.user;
  if (productId) req.body.product = productId;
  if (_id) req.body.user = _id;
  next();
};

// set the id of the parent route in body to use it in the nested route
const setFindOptions = (req, res, next) => {
  const { productId } = req.params;
  req.findOptions = {};
  if (productId) req.findOptions.product = productId;
  next();
};

// routes
route
  .route('/')
  .get(
    getReviewsValidators,
    validationResultHandler,
    setFindOptions,
    getReviews
  )
  .post(
    protectRoutesHandler,
    allowedTo('user'),
    setProductAndUserIdOnBody,
    createReviewValidators,
    validationResultHandler,
    createReview
  );
route
  .route('/:id')
  .get(
    getReviewValidators,
    validationResultHandler,
    setFindOptions,
    getReview
  )
  .put(
    protectRoutesHandler,
    allowedTo('user'),
    setProductAndUserIdOnBody,
    updateReviewValidators,
    validationResultHandler,
    updateReview
  )
  .delete(
    protectRoutesHandler,
    allowedTo('admin', 'user', 'manager'),
    deleteReviewValidators,
    validationResultHandler,
    deleteReview
  );

module.exports = route;
