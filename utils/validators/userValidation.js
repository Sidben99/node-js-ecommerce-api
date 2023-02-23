const { check } = require('express-validator');
const bcrypt = require('bcrypt');
const User = require('../../model/User');
const ApiError = require('../apiError');

const getUserValidators = [
  check('id').isMongoId().withMessage('not a valid id'),
];

const createUserValidators = [
  check('username')
    .notEmpty()
    .withMessage('the username field should not be empty')
    .isLength({ max: 32 })
    .withMessage('the username is too long')
    .isLength({ min: 3 })
    .withMessage('the username is too short'),
  check('email')
    .notEmpty()
    .withMessage('the email field should not be empty')
    .isEmail()
    .withMessage('invalid email')
    .custom(async (val) => {
      const existingEmail = await User.findOne({ email: val });
      if (existingEmail)
        throw new ApiError('the email is already exist', 400);
    }),
  check('password')
    .isLength({ min: 6 })
    .withMessage('the min length of the password is 6 chars'),
  check('passwordConfirmation')
    .notEmpty()
    .withMessage('you should confirm your password')
    .isLength({ min: 6 })
    .withMessage('the min length of the password is 6 chars')
    .custom((val, { req }) => {
      if (req.body.password.trim() !== val.trim())
        throw new ApiError('incorrect password confirmation');
      return true;
    }),
  check('phone')
    .optional()
    .isMobilePhone('ar-DZ')
    .withMessage('the phone is not valid'),
  check('profileImg').optional(),
  check('role').optional(),
];

const updateUserValidators = [
  ...getUserValidators,
  ...createUserValidators,
];
const changeMyPasswordValidators = [
  check('newPassword')
    .isLength({ min: 6 })
    .withMessage('the min length of the password is 6 chars'),
  check('passwordConfirmation')
    .notEmpty()
    .withMessage('you should confirm your password')
    .isLength({ min: 6 })
    .withMessage('the min length of the password is 6 chars')
    .custom((val, { req }) => {
      if (req.body.newPassword.trim() !== val.trim())
        throw new ApiError('incorrect password confirmation');
      return true;
    }),
];

const updateMyProfileValidators = [
  check('username')
    .notEmpty()
    .withMessage('the username field should not be empty')
    .isLength({ max: 32 })
    .withMessage('the username is too long')
    .isLength({ min: 3 })
    .withMessage('the username is too short'),
  check('email')
    .notEmpty()
    .withMessage('the email field should not be empty')
    .isEmail()
    .withMessage('invalid email')
    .custom(async (val) => {
      const existingEmail = await User.findOne({ email: val });
      if (existingEmail)
        throw new ApiError('the email is already exist', 400);
    }),
  check('phone')
    .optional()
    .isMobilePhone('ar-DZ')
    .withMessage('the phone is not valid'),
  check('profileImg').optional(),
];

const changePasswordValidators = [
  ...getUserValidators,
  check('currentPassword')
    .notEmpty()
    .withMessage('you should specify the current password')
    .custom(async (currentPassword, { req }) => {
      const user = await User.findById(req.params.id);
      if (!user) throw new ApiError('no user found', 400);
      const isPasswordCorrect = await bcrypt.compare(
        currentPassword,
        user.password
      );
      console.log('isPass : ', isPasswordCorrect);
      if (!isPasswordCorrect)
        throw new ApiError('invalid current password', 400);
      return true;
    }),
  check('newPassword')
    .isLength({ min: 6 })
    .withMessage('the min length of the password is 6 chars'),
  check('passwordConfirmation')
    .notEmpty()
    .withMessage('you should confirm your password')
    .isLength({ min: 6 })
    .withMessage('the min length of the password is 6 chars')
    .custom((val, { req }) => {
      if (req.body.newPassword.trim() !== val.trim())
        throw new ApiError('incorrect password confirmation');
      return true;
    }),
];

const deleteUserValidators = getUserValidators;

module.exports = {
  getUserValidators,
  createUserValidators,
  updateUserValidators,
  deleteUserValidators,
  changePasswordValidators,
  changeMyPasswordValidators,
  updateMyProfileValidators,
};
