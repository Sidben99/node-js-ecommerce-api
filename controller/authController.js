const crypto = require('crypto');

const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const User = require('../model/User');
const ApiError = require('../utils/apiError');
const sendEmail = require('../utils/sendEmail');
const { createToken, verifyToken } = require('../utils/createVerifyToken');
// @desc sign up handler
//@route    /api/v1/auth/signup
//@access Public
const signUpHandler = asyncHandler(async (req, res) => {
  // 1) create a User
  req.body.role = 'user';
  const user = await User.create(req.body);
  console.log('new User : ', user);
  // 2) generate a token
  const token = createToken({ userId: user._id });
  res.status(201).json({
    user,
    token,
  });
});

// @desc sign up handler
//@route    /api/v1/auth/signup
//@access Public

const loginHandler = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return next(new ApiError('incorrect email or password', 400));
  const token = createToken({ userId: user._id });
  res.status(201).json({
    user,
    token,
  });
});

// @desc make usre that the user has registered before to the system

const protectRoutesHandler = asyncHandler(async (req, res, next) => {
  // 1- check if there is any token send by the client
  if (!req.headers.authorization)
    return next(new ApiError('not authorized'));
  const [, token] = req.headers.authorization.split(' ');
  if (!token) return next(new ApiError('not token found'));
  console.log('token : ', token);
  // 2) check if the token is a valid token
  const payload = verifyToken(token);
  console.log('payload : ', payload);
  if (!payload) return next(new ApiError('not a valid token'));
  // 3) check if the user exists
  const loggedUser = await User.findById(payload.userId);
  if (!loggedUser) return next(new ApiError('the user not found'));
  // 4) check if the user have changed his password
  if (loggedUser.changePasswordAt) {
    const changePasswordTime =
      loggedUser.changePasswordAt.getTime() / 1000;
    if (changePasswordTime > payload.iat) {
      return next(new ApiError('the user has changed his password'));
    }
  }
  req.user = loggedUser;
  next();
});

// allowing routes to  specific role(s)
const allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    const { user } = req;
    if (!roles.includes(user.role))
      return next(
        new ApiError('the user is not allowed to access this route', 403)
      );
    return next();
  });

// @desc forget password handler
//@route    /api/v1/auth/forgetPassword
//@access Public

const forgetPassword = asyncHandler(async (req, res, next) => {
  // 1) check if the user exists
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return next(new ApiError('not user found', 404));
  // 2) create reset code
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash('sha256')
    .update(resetCode)
    .digest('hex');
  user.resetPasswordInfos = {
    code: hashedResetCode,
    // expired in 10 min
    expiredAt: Date.now() + 1000 * 60 * 10,
    verified: false,
  };
  // 3)sending the email
  await sendEmail({
    to: user.email,
    subject: 'your password reset code (valid for 10 min)',
    text: `hi mr ${user.username} we receive a request to reset your password\n here is the code :\n ${resetCode}`,
  });
  await user.save();
  res.status(200).json({ message: 'the email sended successfuly' });
});

// @desc verifyResetCode handler
//@route    /api/v1/auth/verifyCode
//@access Public

const verifyResetCode = asyncHandler(async (req, res, next) => {
  const { resetCode } = req.body;
  // hash the entered reset code
  const hashedResetCode = crypto
    .createHash('sha256')
    .update(resetCode)
    .digest('hex');
  // get the user who has given the reset code
  const user = await User.findOne({
    'resetPasswordInfos.code': hashedResetCode,
    'resetPasswordInfos.expiredAt': { $gt: new Date() },
  });
  console.log('user : ', user);
  if (!user)
    return next(new ApiError('invalid or expired reset code', 400));
  // token for the user who is trying to reset code
  const token = createToken({ userId: user._id });
  user.resetPasswordInfos.verified = true;
  await user.save();

  res
    .status(200)
    .json({ message: 'the code has verified successfuly', token });
});

// @desc verifyResetCode handler
//@route /api/v1/auth/resetPassword/:token
//@access Public

const resetPassword = asyncHandler(async (req, res, next) => {
  // 1) verify the token
  const { token } = req.params;
  const payload = verifyToken(token);
  if (!payload) return new ApiError('page not found', 400);
  // 2) check ifthe user exists and still active
  const user = await User.findById(payload.userId);
  if (!user) return next(new ApiError('no user found', 400));
  // 3) check if the reset password has been verifiyed
  if (!user.resetPasswordInfos.verified)
    return next(new ApiError('you didnt submit the reset code'));
  console.log('user : ', user);
  // 4) reset password
  const { newPassword } = req.body;
  console.log('new password : ', newPassword);
  user.password = newPassword;
  user.resetPasswordInfos = null;
  await user.save();
  res.status(200).json({
    message: 'the password successfuly reseted',
    newPassword: user.password,
  });
});
module.exports = {
  signUpHandler,
  loginHandler,
  protectRoutesHandler,
  allowedTo,
  forgetPassword,
  verifyResetCode,
  resetPassword,
};
