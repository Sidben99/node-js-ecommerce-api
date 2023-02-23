const asyncHandler = require('express-async-handler');
const User = require('../model/User');
const ApiError = require('../utils/apiError');

// @desc add a product to wishlist
// @route POST api/v1/wishlist
// @access Protected/user
const addProductToWishList = asyncHandler(async (req, res, next) => {
  const { product } = req.body;
  const { _id } = req.user;
  const user = await User.findOneAndUpdate(
    _id,
    {
      $addToSet: { wishList: product },
    },
    { new: true }
  );
  if (!user) return next(new ApiError('not found', 400));
  res.status(200).json({ user });
});

// @desc delete a product from wishlist
// @route DELETE api/v1/wishlist/:productId
// @access Protected/user
const removeProductFromWishlist = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const { _id } = req.user;
  const user = await User.findOneAndUpdate(
    _id,
    {
      $pull: { wishList: productId },
    },
    { new: true }
  );
  if (!user) return next(new ApiError('not found', 400));
  res.status(200).json(user);
});

// @desc get products from wishlist
// @route get api/v1/wishlist
// @access Protected/user

const getProductsFromWishList = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  const user = await User.findById(_id).populate('wishList');
  const { wishList } = user;
  if (!user) return next(new ApiError('not found', 400));
  res.status(202).json({
    message: 'success',
    results: wishList.length,
    wishList,
  });
});

module.exports = {
  addProductToWishList,
  removeProductFromWishlist,
  getProductsFromWishList,
};
