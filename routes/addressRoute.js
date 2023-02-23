const router = require('express').Router();

// controllers
const {
  addAddress,
  removeAnAddress,
  getAddresses,
} = require('../controller/addressesController');

// middlewares
const validationResultHandler = require('../middlewares/validationResultMiddelware');
const {
  protectRoutesHandler,
  allowedTo,
} = require('../controller/authController');

// validations
const {
  addAddressValidators,
  removeAnAddressValidators,
} = require('../utils/validators/adressesValidation');

// auth
router.use(protectRoutesHandler, allowedTo('user'));

router
  .route('/')
  .get(getAddresses)
  .post(addAddressValidators, validationResultHandler, addAddress);

router
  .route('/:addressId')
  .delete(
    removeAnAddressValidators,
    validationResultHandler,
    removeAnAddress
  );

module.exports = router;
