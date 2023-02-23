const router = require('express').Router();

// coontrollers
const {
  addProductToCart,
  getUserCart,
  removeItemFromCart,
  clearUserCart,
  updateQuantity,
  applyCouponOnUserCart,
} = require('../controller/cartController');

// validators

// middlewares

const validationResultMiddleware = require('../middlewares/validationResultMiddelware');

// auth middlewares

const {
  protectRoutesHandler,
  allowedTo,
} = require('../controller/authController');

router.use(protectRoutesHandler, allowedTo('user'));

//routes

router
  .route('/')
  .post(addProductToCart)
  .get(getUserCart)
  .delete(clearUserCart);
router.put('/applyCoupon', applyCouponOnUserCart);
router.route('/:itemId').delete(removeItemFromCart).put(updateQuantity);

module.exports = router;
