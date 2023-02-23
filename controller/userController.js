const asyncHandler = require('express-async-handler');
const User = require('../model/User');

const factory = require('./factory');
const ApiError = require('../utils/apiError');

const { createToken } = require('../utils/createVerifyToken');

// @desc    Get list of users
// @route   GET /api/v1/users
// @access  Private/Admin|manager

const getUsers = factory.getAll(User, ['username', 'email']);

// @desc    Get specific user by id
// @route   GET /api/v1/users/:id
// @access  Private/Admin

const getUser = factory.getOne(User);

// @desc    Create specific user
// @route   POST /api/v1/users
// @access  Private/Admin

const createUser = factory.createOne(User);

// @desc    Update specific user by id
// @route   PUT /api/v1/users/:id
// @access  Private/Admin

const updateUser = factory.updateOne(User);

// @desc    delete specific user by id
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
const deleteUser = factory.deleteOne(User);

// @desc    change password for specific user by id
// @route   PUT /api/v1/users/changePassword/:id
// @access  Private/Admin

const changePassword = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { newPassword } = req.body;
  const user = await User.findByIdAndUpdate(
    id,
    { password: newPassword, changePasswordAt: Date.now() },
    { new: true }
  );
  if (!user) return next(new ApiError('no user found'));
  res.status(200).json({ user });
});

// @desc    get logged user
// @route   Get /api/v1/users/myProfile
// @access  Private/User
const getMyProfile = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};

// @desc    change the password of the logged user
// @route   PUT /api/v1/users/myProfile/changePassword
// @access  Private/User
const changeMyPassword = asyncHandler(async (req, res, next) => {
  const { id } = req.user;
  const { newPassword } = req.body;
  const user = await User.findByIdAndUpdate(
    id,
    { password: newPassword, changePasswordAt: Date.now() },
    { new: true }
  );
  if (!user) return next(new ApiError('no user found'));
  const token = createToken({ userId: id });
  res.status(200).json({ user, token });
});

// @desc    update the date of the logged user(without password and role)
// @route   PUT /api/v1/users/myProfile
// @access  Private/User
const changeMyData = asyncHandler(async (req, res, next) => {
  const { id } = req.user;
  const newUserData = await User.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  res.status(200).json({ newUserData });
});
module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
  getMyProfile,
  changeMyPassword,
  changeMyData,
};
