const { model, Schema } = require('mongoose');

const Product = require('./Product');

const reviewSchema = new Schema(
  {
    comment: {
      type: String,
    },
    rating: {
      type: Number,
      required: [true, 'the rating is required'],
      min: [1, 'the rating should be at least 1.0'],
      max: [5, 'the rating should not be above 5.0'],
    },
    user: {
      type: Schema.ObjectId,
      ref: 'User',
      required: [true, 'the user is required'],
    },
    product: {
      type: Schema.ObjectId,
      ref: 'Product',
      required: [true, 'the product is required'],
    },
  },
  { timestamps: true }
);

reviewSchema.static(
  'getAverageRatingAndCount',
  async function (productId) {
    const result = await this.aggregate([
      { $match: { product: productId } },
      {
        $group: {
          _id: 'product',
          ratingAverage: { $avg: '$rating' },
          ratingCount: { $sum: 1 },
        },
      },
    ]);
    console.log('agg result : ', result, ' product : ', productId);
    if (result.length > 0) {
      const [{ ratingAverage, ratingCount }] = result;
      await Product.findByIdAndUpdate(productId, {
        ratingAverage,
        ratingCount,
      });
    } else {
      await Product.findByIdAndUpdate(productId, {
        ratingAverage: 0,
        ratingCount: 0,
      });
    }
  }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: 'user', select: 'username' });
  next();
});

reviewSchema.post('save', async function () {
  console.log('product : ', this.product);
  await this.constructor.getAverageRatingAndCount(this.product);
});

reviewSchema.post('remove', async function () {
  console.log('product : ', this.product);
  await this.constructor.getAverageRatingAndCount(this.product);
});
module.exports = model('Review', reviewSchema);
