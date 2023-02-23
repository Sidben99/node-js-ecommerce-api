const router = require('express').Router();

// controllers
const {
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getAllCoupons,
  getSpecificCoupon,
} = require('../controller/couponController');

// middlewares

const validationResultHandler = require('../middlewares/validationResultMiddelware');
const {
  protectRoutesHandler,
  allowedTo,
} = require('../controller/authController');

// validations
const {
  addCouponValidator,
  updateCouponValidators,
  deleteCouponValidators,
  getSpecificCouponValidators,
} = require('../utils/validators/couponValidation');

// auth
router.use(protectRoutesHandler, allowedTo('admin', 'manager'));

router
  .route('/')
  .get(getAllCoupons)
  .post(addCouponValidator, validationResultHandler, createCoupon);

router
  .route('/:id')
  .get(
    getSpecificCouponValidators,
    validationResultHandler,
    getSpecificCoupon
  )
  .put(updateCouponValidators, validationResultHandler, updateCoupon)
  .delete(deleteCouponValidators, validationResultHandler, deleteCoupon);

module.exports = router;
