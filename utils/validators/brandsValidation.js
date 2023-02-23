const { check } = require('express-validator');

const getBrandValidators = [
  check('id').isMongoId().withMessage('not a valid id'),
];

const createBrandValidators = [
  check('name')
    .notEmpty()
    .withMessage('the name field should not be empty')
    .isLength({ max: 32 })
    .withMessage('the name is too long')
    .isLength({ min: 3 })
    .withMessage('the name is too short'),
];

const updateBrandValidators = [
  ...getBrandValidators,
  ...createBrandValidators,
];

const deleteBrandValidators = getBrandValidators;

module.exports = {
  getBrandValidators,
  createBrandValidators,
  updateBrandValidators,
  deleteBrandValidators,
};
