const { check } = require('express-validator');

const addAddressValidators = [
  check('street').notEmpty().withMessage('you need to specify the street'),
  check('city').notEmpty().withMessage('you need to specify the city'),
  check('postalCode')
    .notEmpty()
    .withMessage('you need to specify the postal code')
    .isPostalCode('any')
    .withMessage('invalid postal code'),
];

const removeAnAddressValidators = [
  check('addressId').isMongoId().withMessage('invalid id'),
];

module.exports = {
  addAddressValidators,
  removeAnAddressValidators,
};
