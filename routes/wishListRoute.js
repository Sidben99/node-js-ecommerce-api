const router = require('express').Router();

// controllers
const {
  addProductToWishList,
  removeProductFromWishlist,
  getProductsFromWishList,
} = require('../controller/witshListController');

// middlewares

const validationResultHandler = require('../middlewares/validationResultMiddelware');
const {
  protectRoutesHandler,
  allowedTo,
} = require('../controller/authController');

// validations
const {
  addProductToWishListValidators,
  removeProductFromWishListValidators,
} = require('../utils/validators/wishListValidation');

// auth
router.use(protectRoutesHandler, allowedTo('user'));

router
  .route('/')
  .get(getProductsFromWishList)
  .post(
    addProductToWishListValidators,
    validationResultHandler,
    addProductToWishList
  );

router
  .route('/:productId')
  .delete(
    removeProductFromWishListValidators,
    validationResultHandler,
    removeProductFromWishlist
  );

module.exports = router;
