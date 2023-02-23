const asyncHandler = require('express-async-handler');
const Cart = require('../model/Cart');
const Product = require('../model/Product');
const Coupon = require('../model/Coupon');
const ApiError = require('../utils/apiError');

const updateTotalPrice = (userCart) => {
  userCart.totalPrice = userCart.cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );
};

// @desc Add product to the cart
// @route POST /api/v1/Cart
// @access private/user
const addProductToCart = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  const { product, color } = req.body;
  const { price } = await Product.findById(product);
  // 1) get the cart of the logged user
  let userCart = await Cart.findOne({ user: _id });
  if (!userCart) {
    // create a cart for the logged user with the product
    userCart = await Cart.create({
      user: _id,
      cartItems: [{ product, color, price }],
    });
  } else {
    const addedProductIndex = userCart.cartItems.findIndex(
      (item) => item.product.toString() === product && item.color === color
    );

    // product exists in the cart => update the product quantity on the cart
    if (addedProductIndex > -1) {
      userCart.cartItems[addedProductIndex].quantity += 1;
    }
    // product does not exist => push it to the cartItems array
    else {
      userCart.cartItems.push({ product, color, price });
    }
  }
  // calculating the total price
  updateTotalPrice(userCart);
  userCart.totalPriceAfterDiscount = null;
  await userCart.save();
  res.status(200).json({ message: 'success', data: userCart });
});

// @desc get the logged users's cart
// @route /api/v1/cart/
// @access private/user
const getUserCart = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  const userCart = await Cart.findOne({ user: _id });
  if (!userCart) next(new ApiError('the user has no cart', 404));
  res.status(200).json({
    message: 'success',
    results: userCart.cartItems.length,
    cart: userCart,
  });
});

// @desc remove an item from the logged users's cart
// @route /api/v1/cart/:itemId
// @access private/user

const removeItemFromCart = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  const { itemId } = req.params;
  const userCart = await Cart.findOne({ user: _id });
  if (!userCart) next(new ApiError('the user has no cart', 404));
  if (userCart.cartItems.length < 1)
    next(new ApiError('the cart is empty', 400));
  const filteredCartItem = userCart.cartItems.filter(
    (item) => item._id.toString() !== itemId
  );
  // check if the item has been removed
  if (userCart.cartItems.length === filteredCartItem.length)
    next(new ApiError('the user does not have this product', 400));
  userCart.cartItems = filteredCartItem;
  // calculating the total price
  updateTotalPrice(userCart);
  userCart.totalPriceAfterDiscount = null;
  await userCart.save();
  res.status(204).json({ message: 'the item has been deleted' });
});

// @desc clear the logged users's cart
// @route /api/v1/cart
// @access private/user
const clearUserCart = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  const userCart = await Cart.findOneAndDelete({ user: _id });
  if (!userCart) next(new ApiError('the user has no cart', 404));
  res.status(204).json({
    message: 'the cart of the user has been cleared',
  });
});

// @desc update the quantity of an item from the logged users's cart
// @route /api/v1/cart/:itemId
// @access private/user
const updateQuantity = asyncHandler(async (req, res, next) => {
  const { itemId } = req.params;
  const { _id } = req.user;
  const { quantity } = req.body;
  const userCart = await Cart.findOne({
    user: _id,
  });
  if (!userCart) return next(new ApiError('the user has no cart', 404));
  const itemIndex = userCart.cartItems.findIndex(
    (cartItem) => cartItem._id.toString() === itemId
  );
  if (itemIndex < 0)
    return next(new ApiError('the user does not have that item', 404));
  userCart.cartItems[itemIndex].quantity = quantity;
  updateTotalPrice(userCart);
  userCart.totalPriceAfterDiscount = null;
  await userCart.save();
  res.status(202).json({
    message: 'the quantity has been updated',
    cart: userCart,
  });
});
// @desc apply coupon on logged user's cart
// @route /api/v1/cart/applyCoupon
// @access private/user
const applyCouponOnUserCart = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  const { couponCode } = req.body;
  const coupon = await Coupon.findOne({ code: couponCode });
  // check if the coupon is invalid
  if (!coupon) return next(new ApiError('invalid coupon', 404));
  // check if the coupon has been expired
  if (coupon.expiresAt <= Date.now())
    return next(new ApiError('this coupon has been expired', 404));
  const userCart = await Cart.findOne({
    user: _id,
  });
  // check if the user has a cart
  if (!userCart) return next(new ApiError('the user has no cart', 404));
  userCart.totalPriceAfterDiscount =
    userCart.totalPrice - (coupon.discount * userCart.totalPrice) / 100;
  await userCart.save();
  res.status(202).json({ message: 'success', cart: userCart });
});

module.exports = {
  addProductToCart,
  getUserCart,
  removeItemFromCart,
  clearUserCart,
  updateQuantity,
  applyCouponOnUserCart,
};
