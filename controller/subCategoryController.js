const SubCategory = require('../model/SubCategory');
const factory = require('./factory');

const createSubCategory = factory.createOne(SubCategory);

const getSubCategories = factory.getAll(SubCategory);

const getSubCategory = factory.getOne(SubCategory);

const updateSubCategory = factory.updateOne(SubCategory);

const deleteSubCategory = factory.deleteOne(SubCategory);

module.exports = {
  createSubCategory,
  getSubCategories,
  getSubCategory,
  deleteSubCategory,
  updateSubCategory,
};
