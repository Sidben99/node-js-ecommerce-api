const route = require('express').Router();

// middlewares
const validationResultHandler = require('../middlewares/validationResultMiddelware');
const addSlugToBody = require('../middlewares/slugifyMiddelware');
const uploadOnMemory = require('../middlewares/uploadOnMemory');
const { processOneImage } = require('../middlewares/imageProcessing');

// controllers
const {
  getBrand,
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} = require('../controller/brandsController');

// auth middlewares
const {
  allowedTo,
  protectRoutesHandler,
} = require('../controller/authController');

// validators
const {
  getBrandValidators,
  updateBrandValidators,
  deleteBrandValidators,
  createBrandValidators,
} = require('../utils/validators/brandsValidation');

route
  .route('/')
  .get(getBrands)
  .post(
    protectRoutesHandler,
    allowedTo('admin', 'manager'),
    uploadOnMemory({ single: 'logo' }),
    processOneImage('brands', {
      w: 300,
      h: 300,
      format: 'png',
      quality: 90,
    }),
    createBrandValidators,
    validationResultHandler,
    addSlugToBody('name'),
    createBrand
  );

route
  .route('/:id')
  .get(getBrandValidators, validationResultHandler, getBrand)
  .put(
    protectRoutesHandler,
    allowedTo('admin', 'manager'),
    uploadOnMemory({ single: 'logo' }),
    processOneImage('brands', {
      w: 300,
      h: 300,
      format: 'png',
      quality: 20,
    }),
    updateBrandValidators,
    validationResultHandler,
    updateBrand
  )
  .delete(
    protectRoutesHandler,
    allowedTo('admin'),
    deleteBrandValidators,
    validationResultHandler,
    deleteBrand
  );

module.exports = route;
