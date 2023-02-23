const route = require('express').Router();
const validationResultHandler = require('../middlewares/validationResultMiddelware');
const addSlugToBody = require('../middlewares/slugifyMiddelware');

// controllers
const {
  signUpHandler,
  loginHandler,
  forgetPassword,
  verifyResetCode,
  resetPassword,
} = require('../controller/authController');

// validators
const {
  signupValidators,
  loginValidators,
  forgetPasswordValidators,
  verifyResetCodeValidators,
  resetPasswordValidators,
} = require('../utils/validators/authValidation');

route
  .route('/signup')
  .post(
    signupValidators,
    validationResultHandler,
    addSlugToBody('username'),
    signUpHandler
  );
route
  .route('/login')
  .post(loginValidators, validationResultHandler, loginHandler);

route
  .route('/forgetPassword')
  .post(forgetPasswordValidators, validationResultHandler, forgetPassword);

route.post(
  '/verifyCode',
  verifyResetCodeValidators,
  validationResultHandler,
  verifyResetCode
);

route.put(
  '/resetPassword/:token',
  resetPasswordValidators,
  validationResultHandler,
  resetPassword
);

module.exports = route;
