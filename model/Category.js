const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: 'String',
      required: [true, 'The name should be specified'],
      maxLength: [30, 'Tha name is too long'],
      minLength: [3, 'The name is too short'],
      unique: [true, 'This category already exist'],
    },
    slug: {
      type: 'String',
      lowercase: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);
const setImageUrlOnDoc = (doc) => {
  const { image } = doc;
  doc.image = `${process.env.HOSTNAME}/category/${image}`;
  console.log('doc : ', doc);
};

categorySchema.post('init', setImageUrlOnDoc);
categorySchema.post('save', setImageUrlOnDoc);

const categoryModel = mongoose.model('Category', categorySchema);
module.exports = categoryModel;
