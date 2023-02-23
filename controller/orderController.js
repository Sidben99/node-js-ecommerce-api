const asyncHandler = require('express-async-handler');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const ApiError = require('../utils/apiError');

const Order = require('../model/Order');

const Product = require('../model/Product');

const User = require('../model/User');

const Cart = require('../model/Cart');

const factory = require('./factory');

// @desc create an order with cash payment method
// @route POST /api/v1/order/:cartId
// @access private/user
const createCashOrder = asyncHandler(async (req, res, next) => {
  const shippingPrice = 0;
  const taxPrice = 0;
  const { _id } = req.user;
  const { cartId } = req.params;
  const { shippingAddress } = req.body;
  //1) get cart items
  const userCart = await Cart.findById(cartId);
  if (!userCart) return next(new ApiError('not cart found', 404));
  //2) get cart's total price
  const { totalPriceAfterDiscount, totalPrice } = userCart;
  let totalOrderPrice = totalPriceAfterDiscount || totalPrice;
  //3) calculate total order price
  totalOrderPrice += shippingPrice + taxPrice;
  //4) check if the shipping address is in the user's addresses
  const userAddress = await User.findOne({
    _id,
    addresses: { $elemMatch: { _id: shippingAddress } },
  });
  console.log('userAddress : ', userAddress);

  if (!userAddress)
    return next(new ApiError('user address not found', 404));
  //5) create the order with default cash payment
  const newOrder = await Order.create({
    user: _id,
    cartItems: userCart,
    totalOrderPrice,
    shippingPrice,
    taxPrice,
    shippingAddress,
  });

  //6) decrease the quantity of the product in stock , increase the total sells
  const bulkOptions = userCart.cartItems.map((item) => ({
    updateOne: {
      filter: { _id: item.product },
      update: {
        $inc: { quantity: -item.quantity, sold: item.quantity },
      },
    },
  }));
  await Product.bulkWrite(bulkOptions);
  //7) clear the cart
  await Cart.findOneAndDelete(userCart._id);
  res
    .status(201)
    .json({ message: 'the order has been successfuly created', newOrder });
});

// @desc get the user's order | get all the users orders for the admin
// @route GET /api/v1/order
// @access private/user
const getOrders = factory.getAll(Order);

// @desc update the state of the order to (delevered/paid) state
// @route PUT /api/v1/Order/:orderId/delevered
// @access private/admin
const changeStateTo = (state) =>
  asyncHandler(async (req, res, next) => {
    const { orderId } = req.params;
    const order = await Order.findByIdAndUpdate(
      orderId,
      { [`${state}At`]: Date.now() },
      { new: true }
    );
    if (!order) return next(new ApiError('no order founded', 404));
    res.status(202).json({
      message: `the state successfully changed to ${state} state`,
      order,
    });
  });

// @desc get checkout session from stripe and send it as a response
// @route GET /api/v1/order/checkout-session/:cartId
// @access private/user
const getCheckoutSession = asyncHandler(async (req, res, next) => {
  const shippingPrice = 0;
  const taxPrice = 0;
  const { cartId } = req.params;
  //1) get cart items
  const userCart = await Cart.findById(cartId);
  if (!userCart) return next(new ApiError('not cart found', 404));
  //2) get cart's total price
  const { totalPriceAfterDiscount, totalPrice } = userCart;
  let totalOrderPrice = totalPriceAfterDiscount || totalPrice;
  //3) calculate total order price
  totalOrderPrice += shippingPrice + taxPrice;

  //4) create stripe checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: totalOrderPrice * 100,
          product_data: {
            name: 'T-shirt',
            description: 'Comfortable cotton t-shirt',
            //images: ['https://example.com/t-shirt.png'],
          },
        },
        /*name: req.user.username,
        amount: totalOrderPrice * 100,
        quantity: 1,
        currency: 'USD',*/
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${req.protocol}://${req.hostname}/Order/`,
    cancel_url: `${req.protocol}://${req.hostname}/cart/`,
    customer_email: req.user.email,
    client_reference_id: cartId,
  });
  //5) send session as a response
  res.status(200).json({ status: 'message', session });
});

module.exports = {
  createCashOrder,
  getOrders,
  changeStateTo,
  getCheckoutSession,
};
