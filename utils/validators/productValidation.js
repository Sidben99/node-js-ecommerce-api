const { check } = require('express-validator');

const Category = require('../../model/Category');
const SubCategory = require('../../model/SubCategory');

const getProductValidators = [
  check('id').isMongoId().withMessage('not a valid id'),
];

const createProductValidators = [
  check('title')
    .notEmpty()
    .withMessage('the title field should not be empty')
    .isLength({ max: 100, min: 10 })
    .withMessage(
      'the title should not be more than 100 chars or less than 20'
    ),
  check('description')
    .notEmpty()
    .withMessage('the description field should not be empty')
    .isLength({ min: 10 })
    .withMessage('the description should not be less than 20 chars'),
  check('quantity')
    .notEmpty()
    .withMessage('the quantity field should not be empty')
    .toInt()
    .isNumeric()
    .withMessage('the quantity should be a number'),
  check('sold')
    .optional()
    .isNumeric()
    .withMessage('the sold should be a number'),
  check('price')
    .notEmpty()
    .withMessage('the price field should not be empty')
    .toFloat()
    .isNumeric()
    .withMessage('the price should be a number')
    .custom((value, { req }) => {
      if (value < 0.99 || value > 10000000) {
        throw new Error(
          'the price should be greater than 0.99 and less than 10000000'
        );
      }
      return true;
    }),
  check('priceAfterDiscount')
    .optional()
    .toFloat()
    .isNumeric()
    .withMessage('the price should be a number')
    .custom((value, { req }) => {
      if (req.body.price <= value)
        throw new Error(
          'the price after discount should be less then the actual price'
        );
      return true;
    }),
  check('colors')
    .optional()
    .isArray()
    .withMessage('you should enter an array with colors'),
  check('imageCover') /*.optional(),*/
    .notEmpty()
    .withMessage('the image cover should be specified'),
  check('images')
    .optional()
    .isArray()
    .withMessage('you should enter an array with images'),
  check('mainCategory')
    .notEmpty()
    .withMessage('you should specify the main category')
    .isMongoId()
    .withMessage('the main category field should be a valid mongo id')
    .custom(async (categoryId) => {
      // check if the main category exist on the db
      const mainCategory = await Category.findById(categoryId);
      if (!mainCategory) throw new Error('invalid main category');
    }),
  check('subCategories')
    .isArray()
    .withMessage('the subCategories field should be an array')
    // check if the subcategories exists in the db
    .custom(async (subCategoriesId, { req }) => {
      const categoriesList = await SubCategory.find({
        _id: { $in: subCategoriesId },
      });
      if (
        categoriesList.length < 1 ||
        categoriesList.length !== req.body.subCategories.length
      ) {
        throw Error('invalid subCategory');
      }
    })
    //check if the subcategories are belong to the entered mainCategory
    .custom(async (subCategoriesIds, { req }) => {
      const { mainCategory } = req.body;
      const subCategoriesList = await SubCategory.find({ mainCategory });
      const subCategoriesIdsList = subCategoriesList.map((subCategory) =>
        subCategory._id.toString()
      );
      const areBlongToMainCategory = subCategoriesIds.every(
        (subCategoryId) => subCategoriesIdsList.includes(subCategoryId)
      );
      if (!areBlongToMainCategory)
        throw new Error(
          'a subCategory does not belong to the main category'
        );
    }),
  check('brand')
    .optional()
    .isMongoId()
    .withMessage('the brand should be a valid mongo id'),
  check('ratingAverage')
    .optional()
    .toFloat()
    .isNumeric()
    .withMessage('the average rating field sould be a number')
    .custom((value) => {
      if (value < 1 || value > 5)
        throw new Error('the rating should be between 1.0 and 5.0');
      return true;
    }),
  check('ratingCount')
    .optional()
    .toInt()
    .isNumeric()
    .withMessage('the rating count should be a number'),
];

const updateProductValidators = [
  ...getProductValidators,
  ...createProductValidators,
];

const deleteProductValidators = getProductValidators;

module.exports = {
  getProductValidators,
  createProductValidators,
  updateProductValidators,
  deleteProductValidators,
};
