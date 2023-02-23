const factory = require('./factory');

const Product = require('../model/Product');
// @desc GET list of products
// @route GET /api/v1/products
// @access public
const getAllProducts = factory.getAll(Product, ['title', 'description']);

// @desc Create a product
// @route POST /api/v1/products
// @access private
const createProduct = factory.createOne(Product);

// @desc Get specific product
// @route Get /api/v1/products/:id
// @access Public
const getSpecificProduct = factory.getOne(Product, {
  path: 'reviews',
  select: 'user rating comment',
});

// @desc Update specific category
// @route PUT /category/:id
// @access Private
const updateProduct = factory.updateOne(Product);

// @desc Delete specific category
// @route DELETE /api/v1/products/:id
// @access Private
const deleteProduct = factory.deleteOne(Product);

module.exports = {
  getAllProducts,
  getSpecificProduct,
  deleteProduct,
  createProduct,
  updateProduct,
};
