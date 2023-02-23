const { Schema, model } = require('mongoose');

const couponSchema = new Schema(
  {
    code: {
      type: String,
      required: [true, 'you need to specify the coupon'],
      trim: true,
      unique: [true, 'this coupon is already used'],
    },
    expiresAt: {
      type: Date,
      required: [true, 'you need to specify the expiration time'],
    },
    discount: {
      type: Number,
      required: [true, 'you need to specify the discount'],
    },
  },
  { timestamps: true }
);

module.exports = model('Coupon', couponSchema);
