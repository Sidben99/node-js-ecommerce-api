const route = require('express').Router();

// controllers

const {
  getAllProducts,
  getSpecificProduct,
  deleteProduct,
  createProduct,
  updateProduct,
} = require('../controller/productController');

// auth middlewares

const {
  allowedTo,
  protectRoutesHandler,
} = require('../controller/authController');

// middlewares
const addSlugToBody = require('../middlewares/slugifyMiddelware');
const validationResultHandler = require('../middlewares/validationResultMiddelware');
const uploadOnMemory = require('../middlewares/uploadOnMemory');
const {
  processOneImage,
  processMulipleImages,
} = require('../middlewares/imageProcessing');

// validators
const {
  getProductValidators,
  deleteProductValidators,
  createProductValidators,
  updateProductValidators,
} = require('../utils/validators/productValidation');

// subroutes
const reviewRoute = require('./reviewRoute');

route.use('/:productId/reviews', reviewRoute);

route
  .route('/')
  .get(getAllProducts)
  .post(
    protectRoutesHandler,
    allowedTo('admin', 'manager'),
    uploadOnMemory({
      fields: [
        { name: 'images', maxCount: 5 },
        { name: 'imageCover', maxCount: 1, single: true },
      ],
    }),
    processMulipleImages(
      'products',
      {
        w: 800,
        h: 600,
        format: 'jpeg',
        quality: 80,
      },
      ['imageCover']
    ),
    createProductValidators,
    validationResultHandler,
    addSlugToBody('title'),
    createProduct
  );

route
  .route('/:id')
  .get(getProductValidators, validationResultHandler, getSpecificProduct)
  .delete(
    protectRoutesHandler,
    allowedTo('admin'),
    deleteProductValidators,
    validationResultHandler,
    deleteProduct
  )
  .put(
    protectRoutesHandler,
    allowedTo('admin', 'manager'),
    updateProductValidators,
    validationResultHandler,
    updateProduct
  );

module.exports = route;
