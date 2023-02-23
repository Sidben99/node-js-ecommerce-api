const router = require('express').Router();

// controllers
const {
  createCashOrder,
  getOrders,
  changeStateTo,
  getCheckoutSession,
} = require('../controller/orderController');

// middlewares
const validationResultHandler = require('../middlewares/validationResultMiddelware');

// auth middlewares
const {
  allowedTo,
  protectRoutesHandler,
} = require('../controller/authController');

// validators

// set the id of user to get only the user's orders for him
const setFindOptions = (req, res, next) => {
  const userId = req.user.role === 'user' ? req.user._id : null;
  req.findOptions = {};
  if (userId) req.findOptions.user = userId;
  next();
};

// routes
router.use(protectRoutesHandler);
router
  .route('/')
  .get(allowedTo('admin', 'user'), setFindOptions, getOrders);
router.route('/:cartId').post(allowedTo('user'), createCashOrder);
router.put('/:orderId/paid', allowedTo('admin'), changeStateTo('paid'));
router.put(
  '/:orderId/delivered',
  allowedTo('admin'),
  changeStateTo('delivered')
);
router.get(
  '/checkout-session/:cartId',
  allowedTo('user'),
  getCheckoutSession
);

module.exports = router;
