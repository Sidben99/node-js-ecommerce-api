const { Schema, model } = require('mongoose');

const brandSchema = new Schema(
  {
    name: {
      type: String,
      require: [true, 'the brand name should be specified'],
      maxLength: [32, 'the name is too long'],
      minLength: [3, 'the name is too short'],
      unique: [true, 'the brand name already exist'],
    },
    slug: {
      type: String,
    },
    logo: {
      type: String,
    },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

brandSchema.virtual('logoUrl').get(function () {
  console.log('this : ', this);
  return `${process.env.HOSTNAME}/brands/${this.logo}`;
});

module.exports = model('Brand', brandSchema);
