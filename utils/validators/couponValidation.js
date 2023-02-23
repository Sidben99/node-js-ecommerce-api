const { check } = require('express-validator');

const Coupon = require('../../model/Coupon');

const addCouponValidator = [
  check('code')
    .notEmpty()
    .withMessage('you should specify the code')
    // check the uniqueness
    .custom(async (val, { req }) => {
      req.body.code = req.body.code.toUpperCase();
      const coupon = await Coupon.findOne({ code: req.body.code });
      if (coupon) throw new Error('the code is already used');
      return true;
    }),
  check('expiresAt').isDate().withMessage('invalid date'),
  check('discount')
    .toFloat()
    .isFloat({ max: 100, min: 1 })
    .withMessage('the discount should be a number between 1 - 100'),
];

const getSpecificCouponValidators = [
  check('id').isMongoId().withMessage('invalid id'),
];

const updateCouponValidators = [
  ...getSpecificCouponValidators,
  check('code')
    .optional()
    .custom(async (val, { req }) => {
      req.body.code = req.body.code.toUpperCase();
      const coupon = await Coupon.findOne({ code: req.body.code });
      if (coupon) throw new Error('the code is already used');
      return true;
    }),
  check('expiresAt').optional().isDate().withMessage('invalid date'),
  check('discount')
    .optional()
    .toFloat()
    .isFloat({ max: 100, min: 1 })
    .withMessage('the discount should be a number between 1 - 100'),
];

const deleteCouponValidators = [getSpecificCouponValidators];

module.exports = {
  addCouponValidator,
  updateCouponValidators,
  getSpecificCouponValidators,
  deleteCouponValidators,
};
