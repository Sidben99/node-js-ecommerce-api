const Reviews = require('../model/Review');

const factory = require('./factory');

// @desc    Create review
// @route   POST  /api/v1/reviews
// @access  Public

const getReviews = factory.getAll(Reviews, ['comment']);

// @desc    Create review
// @route   POST  /api/v1/reviews
// @access  Public
const getReview = factory.getOne(Reviews);

// @desc    Create review
// @route   POST  /api/v1/reviews
// @access  Private/Protect/User
const createReview = factory.createOne(Reviews);

// @desc    Create review
// @route   POST  /api/v1/reviews
// @access  Private/Protect/User
const updateReview = factory.updateOne(Reviews);

// @desc    Create review
// @route   POST  /api/v1/reviews
// @access  Private/user|admin|manager
const deleteReview = factory.deleteOne(Reviews);

module.exports = {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
};
