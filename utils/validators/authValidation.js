const { check, body } = require('express-validator');
const User = require('../../model/User');
const ApiError = require('../apiError');

const signupValidators = [
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
];

const loginValidators = [
  check('email')
    .notEmpty()
    .withMessage('the email field should not be empty')
    .isEmail()
    .withMessage('invalid email'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('the min length of the password is 6 chars'),
];

const forgetPasswordValidators = [
  check('email')
    .notEmpty()
    .withMessage('the email field should not be empty')
    .isEmail()
    .withMessage('invalid email'),
];

const verifyResetCodeValidators = [
  body('resetCode')
    .notEmpty()
    .withMessage('you should specify the reset Code'),
];

const resetPasswordValidators = [
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('the min length of the password is 6 chars'),
];
/*const updateUserValidators = [
  ...getUserValidators,
  ...createUserValidators,
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
*/
module.exports = {
  signupValidators,
  loginValidators,
  forgetPasswordValidators,
  verifyResetCodeValidators,
  resetPasswordValidators,
};
