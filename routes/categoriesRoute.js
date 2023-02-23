const route = require('express').Router();

// import controllers
const {
  createCategory,
  getAllCategories,
  getSpecificCategory,
  updateSpecificCategory,
  deleteCategory,
} = require('../controller/categoryController');

// import sub routes (nested routes)
const subCategoryRoute = require('./subCategoryRoute');
// import validators
const {
  getCategoryValidators,
  createCategoryValidators,
  updateCategoryValidators,
  deleteCategoryValidators,
} = require('../utils/validators/categoryValidator');
// middlewares
const validationResultHandler = require('../middlewares/validationResultMiddelware');
const addSlugToBody = require('../middlewares/slugifyMiddelware');
// auth middlewares
const {
  protectRoutesHandler,
  allowedTo,
} = require('../controller/authController');

//const uploadFiles = require('../middlewares/uploadOnDisk');
const uploadOnMemory = require('../middlewares/uploadOnMemory');
const { processOneImage } = require('../middlewares/imageProcessing');
// nested routes
route.use('/:categoryId/SubCategory', subCategoryRoute);

// routes
route
  .route('/')
  .get(getAllCategories)
  .post(
    protectRoutesHandler,
    allowedTo('admin', 'manager'),
    uploadOnMemory({ single: 'image' }),
    processOneImage('category', {
      w: 800,
      h: 600,
      quality: 75,
      format: 'jpeg',
    }),
    createCategoryValidators,
    validationResultHandler,
    addSlugToBody('name'),
    createCategory
  );
route
  .route('/:id')
  .get(getCategoryValidators, validationResultHandler, getSpecificCategory)
  .put(
    protectRoutesHandler,
    allowedTo('admin', 'manager'),
    uploadOnMemory({ single: 'image' }),
    processOneImage('category', {
      w: 800,
      h: 600,
      quality: 75,
      format: 'jpeg',
    }),
    updateCategoryValidators,
    validationResultHandler,
    addSlugToBody('name'),
    updateSpecificCategory
  )
  .delete(
    protectRoutesHandler,
    allowedTo('admin'),
    deleteCategoryValidators,
    validationResultHandler,
    deleteCategory
  );

module.exports = route;
