const asyncHandler = require('express-async-handler');
const User = require('../model/User');
const ApiError = require('../utils/apiError');

// @desc add an address
// @route POST api/v1/address
// @access Protected/user
const addAddress = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  const user = await User.findOneAndUpdate(
    _id,
    {
      $addToSet: { addresses: req.body },
    },
    { new: true }
  );
  if (!user) return next(new ApiError('not found', 400));
  res.status(200).json({ user });
});

// @desc remove an address from addresses
// @route DELETE api/v1/address/:addressId
// @access Protected/user
const removeAnAddress = asyncHandler(async (req, res, next) => {
  const { addressId } = req.params;
  const { _id } = req.user;
  const user = await User.findOneAndUpdate(
    _id,
    {
      $pull: { addresses: { _id: addressId } },
    },
    { new: true }
  );
  if (!user) return next(new ApiError('not found', 400));
  res.status(200).json(user);
});

// @desc get user's addresses
// @route get api/v1/address
// @access Protected/user

const getAddresses = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  const user = await User.findById(_id);
  const { addresses } = user;
  if (!user) return next(new ApiError('not found', 400));
  res.status(202).json({
    message: 'success',
    results: addresses.length,
    addresses,
  });
});

module.exports = {
  addAddress,
  removeAnAddress,
  getAddresses,
};
