const { body, check } = require('express-validator');

const Review = require('../../model/Review');

const getReviewValidators = [
  check('id').isMongoId().withMessage('invalid mongo id'),
  check('productId')
    .optional()
    .isMongoId()
    .withMessage('not a valid if (product id)'),
];

const getReviewsValidators = [
  check('productId')
    .optional()
    .isMongoId()
    .withMessage('not a valid if (product id)'),
];

const createReviewValidators = [
  body('comment').optional(),
  body('rating')
    .notEmpty()
    .withMessage('you must leave a review')
    .isFloat({ max: 5, min: 1 })
    .withMessage('the review should be between 1.0-5.0'),
  body('user').notEmpty().withMessage('invalid mongo id for user'),
  body('product')
    .isMongoId()
    .withMessage('invalid mongo id for product')
    // check if the user leaves another review for the same product
    .custom(async (val, { req }) => {
      const review = await Review.findOne({
        $and: [{ user: req.user._id }, { product: val }],
      });
      console.log('review : ', review);
      if (review)
        throw Error('you already left a review for that product');
      return true;
    }),
];

const updateReviewValidators = [
  check('id')
    .isMongoId()
    .withMessage('invalid mongo id')
    // check if the user updates his own review
    .custom(async (val, { req }) => {
      const review = await Review.findOne({
        _id: req.params.id,
        user: req.user._id,
      });
      if (!review) throw new Error("you can't update somebody's review");
      return true;
    }),
  body('rating').optional().isFloat({ max: 5, min: 1 }),
];

const deleteReviewValidators = [
  check('id')
    .isMongoId()
    .withMessage('invalid mongo id')
    // check if the user updates his own review
    .custom(async (val, { req }) => {
      const review = await Review.findOne({
        _id: req.params.id,
        user: req.user._id,
      });
      if (!review) throw new Error("you can't update somebody's review");
      return true;
    }),
];

module.exports = {
  getReviewValidators,
  createReviewValidators,
  updateReviewValidators,
  deleteReviewValidators,
  getReviewsValidators,
};
