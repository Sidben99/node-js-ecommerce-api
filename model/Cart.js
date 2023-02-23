const { Schema, model } = require('mongoose');

const cartSchema = new Schema(
  {
    cartItems: [
      {
        product: {
          type: Schema.ObjectId,
          ref: 'Product',
        },
        color: String,
        price: Number,
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    totalPrice: Number,
    totalPriceAfterDiscount: Number,
    user: {
      type: Schema.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = model('Cart', cartSchema);
