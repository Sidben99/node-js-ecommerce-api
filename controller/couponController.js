const Coupon = require('../model/Coupon');
const factory = require('./factory');

// @desc GET list of coupons
// @route GET /api/v1/coupons
// @access private/admin|manager
const getAllCoupons = factory.getAll(Coupon, ['code']);

// @desc Create a coupon
// @route POST /api/v1/coupons
// @access private/admin|manager
const createCoupon = factory.createOne(Coupon);

// @desc Get specific Coupon
// @route Get /api/v1/coupons/:id
// @access private/admin|manager
const getSpecificCoupon = factory.getOne(Coupon);

// @desc Update specific Coupon
// @route PUT /api/v1/coupons/:id
// @access private/admin|manager
const updateCoupon = factory.updateOne(Coupon);

// @desc delete specific Coupon
// @route DELETE /api/v1/coupons/:id
// @access private/admin|manager
const deleteCoupon = factory.deleteOne(Coupon);

module.exports = {
  getAllCoupons,
  createCoupon,
  updateCoupon,
  getSpecificCoupon,
  deleteCoupon,
};
