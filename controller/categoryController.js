const Category = require('../model/Category');
const factory = require('./factory');
// @desc GET list of categories
// @route GET /category
// @access public
const getAllCategories = factory.getAll(Category, ['name']);

// @desc Create a category
// @route POST /category
// @access private
const createCategory = factory.createOne(Category);

// @desc Get specific category
// @route Get /category/:id
// @access Public
const getSpecificCategory = factory.getOne(Category);

// @desc Update specific category
// @route PUT /category/:id
// @access Private
const updateSpecificCategory = factory.updateOne(Category);

// @desc Delete specific category
// @route DELETE /category/:id
// @access Private
const deleteCategory = factory.deleteOne(Category);

module.exports = {
  createCategory,
  getAllCategories,
  getSpecificCategory,
  updateSpecificCategory,
  deleteCategory,
};
