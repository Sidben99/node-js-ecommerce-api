const express = require('express');

const route = express.Router({ mergeParams: true });

const validationResultHandler = require('../middlewares/validationResultMiddelware');

const {
  createSubCategoryValidators,
  getSubCategoryValidators,
  updateSubCategoryValidators,
  deleteSubCategoryValidators,
  getSubCategoriesValidators,
} = require('../utils/validators/subCategoryValidation');
// import controllers
const {
  createSubCategory,
  getSubCategory,
  getSubCategories,
  updateSubCategory,
  deleteSubCategory,
} = require('../controller/subCategoryController');

// import auth middlewares
const {
  protectRoutesHandler,
  allowedTo,
} = require('../controller/authController');

// custom middlewares
const setCategoryIdToBodyOnCreate = (req, res, next) => {
  const { categoryId } = req.params;
  if (categoryId) req.body.mainCategory = categoryId;
  return next();
};

const setFindOptions = (req, res, next) => {
  const { categoryId } = req.params;
  req.findOptions = {};
  if (categoryId) req.findOptions.mainCategory = categoryId;
  next();
};
// routes
route
  .route('/')
  .get(
    getSubCategoriesValidators,
    validationResultHandler,
    setFindOptions,
    getSubCategories
  )
  .post(
    protectRoutesHandler,
    allowedTo('admin', 'manager'),
    setCategoryIdToBodyOnCreate,
    createSubCategoryValidators,
    validationResultHandler,
    createSubCategory
  );
route
  .route('/:id')
  .get(
    getSubCategoryValidators,
    validationResultHandler,
    setFindOptions,
    getSubCategory
  )
  .put(
    protectRoutesHandler,
    allowedTo('admin', 'manager'),
    updateSubCategoryValidators,
    validationResultHandler,
    updateSubCategory
  )
  .delete(
    protectRoutesHandler,
    allowedTo('admin'),
    deleteSubCategoryValidators,
    validationResultHandler,
    deleteSubCategory
  );

module.exports = route;
