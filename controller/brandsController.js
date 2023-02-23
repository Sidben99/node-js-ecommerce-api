const Brands = require('../model/Brand');

const factory = require('./factory');

const getBrands = factory.getAll(Brands, ['name']);

const getBrand = factory.getOne(Brands);

const createBrand = factory.createOne(Brands);

const updateBrand = factory.updateOne(Brands);

const deleteBrand = factory.deleteOne(Brands);

module.exports = {
  getBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
};
