const { check } = require('express-validator');

const createSubCategoryValidators = [
  check('name')
    .notEmpty()
    .withMessage('the name should be specified')
    .isLength({ min: 3, max: 32 })
    .withMessage('the name length should be between 3 and 32'),
  check('mainCategory')
    .isMongoId()
    .withMessage('invalid id')
    .notEmpty()
    .withMessage('you should specify the main category'),
];

const getSubCategoryValidators = [
  check('id').isMongoId().withMessage('not a valid id'),
  check('categoryId')
    .optional()
    .isMongoId()
    .withMessage('invalid mongo id for category id'),
];

const updateSubCategoryValidators = [
  ...getSubCategoryValidators,
  ...createSubCategoryValidators,
];

const deleteSubCategoryValidators = [...getSubCategoryValidators];

const getSubCategoriesValidators = [
  check('categoryId')
    .optional()
    .isMongoId()
    .withMessage('invalid mongo id for category id'),
];

module.exports = {
  createSubCategoryValidators,
  getSubCategoryValidators,
  updateSubCategoryValidators,
  deleteSubCategoryValidators,
  getSubCategoriesValidators,
};
