const { Schema, model } = require('mongoose');

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'the title sould be specified'],
      minLength: [10, 'the title is too short'],
      maxLength: [100, 'the title is too long'],
    },
    slug: {
      type: String,
      required: [true, 'the slug should be specified'],
    },
    description: {
      type: String,
      required: [true, 'the description should be specified'],
      minLength: [10, 'the description is too short'],
    },
    quantity: {
      type: Number,
      required: [true, 'the quantity should be specified'],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'the price should be specified'],
      min: [0.99, 'the least price is 0.99'],
      max: [10000000000, 'the max price is 10000000000'],
    },
    priceAfterDiscount: {
      type: Number,
    },
    colors: [String],
    imageCover: {
      type: String,
      required: [true, 'the image cover should be specified'],
    },
    images: [
      {
        type: String,
      },
    ],
    mainCategory: {
      type: Schema.ObjectId,
      ref: 'Category',
      required: [true, 'the product should be refrenced with a category'],
    },
    subCategories: [
      {
        type: Schema.ObjectId,
        ref: 'SubCategory',
        required: [
          true,
          'the product should be refrenced with a subCategory',
        ],
      },
    ],
    brand: {
      type: Schema.ObjectId,
      ref: 'Brand',
    },
    ratingAverage: {
      type: Number,
      min: [1, 'the rating should be at least 1.0'],
      max: [5, 'the rating should not be above 5.0'],
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
productSchema.pre('find', function (next) {
  this.populate({
    path: 'mainCategory',
    select: 'name',
  });
  next();
});

productSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
});

productSchema.virtual('imageCoverUrl').get(function () {
  return `${process.env.HOSTNAME}/products/${this.imageCover}`;
});

productSchema.virtual('imagesUrls').get(function () {
  return this.images.map(
    (image) => `${process.env.HOSTNAME}/products/${image}`
  );
});

module.exports = model('Product', productSchema);
