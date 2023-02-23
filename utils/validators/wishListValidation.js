const { check } = require('express-validator');

const addProductToWishListValidators = [
  check('product').isMongoId().withMessage('invalid id'),
];

const removeProductFromWishListValidators = [
  check('productId').isMongoId().withMessage('invalid id'),
];

module.exports = {
  addProductToWishListValidators,
  removeProductFromWishListValidators,
};
