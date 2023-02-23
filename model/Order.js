const { Schema, model } = require('mongoose');

const orderSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: [true, 'you should specify the user'],
  },
  cartItems: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
      color: String,
      price: Number,
      quantity: {
        type: Number,
      },
    },
  ],
  shippingAddress: {
    type: Schema.Types.ObjectId,
    ref: 'User.addresses',
  },
  shippingPrice: {
    type: Number,
    default: 0,
  },
  tax: {
    type: Number,
    default: 0,
  },
  totalOrderPrice: {
    type: Number,
    required: [true, 'no total price'],
  },
  deliveredAt: Date,
  paidAt: Date,
  paymentMethod: {
    type: String,
    enum: ['cash', 'card'],
    default: 'cash',
  },
});

orderSchema.pre('find', function (next) {
  const p = this.populate({
    path: 'user',
    select: 'username email',
  });
  console.log('p : ', p);

  next();
});

module.exports = model('order', orderSchema);
