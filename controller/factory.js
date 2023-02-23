const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeatures');

const deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    console.log('id : ', id);
    const deletedItem = await Model.findById(id);
    console.log('deletedItem : ', deletedItem);
    if (!deletedItem) return next(new ApiError('not found', 400));
    // trigger the remove middleware
    await deletedItem.remove();
    res.status(205).json({
      message: `the item  has been deleted`,
    });
  });

const getOne = (Model, populateSettings = '') =>
  asyncHandler(async (req, res, next) => {
    const findOptions = req.findOptions || {};
    findOptions._id = req.params.id;
    console.log('params : ', findOptions);
    const specificItem = await Model.findOne(findOptions).populate(
      populateSettings
    );
    console.log('spec item: ', specificItem);
    if (specificItem) res.status(200).json({ specificItem });
    else return next(new ApiError('not found', 404));
  });

const updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const updatedItem = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedItem) return next(new ApiError('not found', 400));
    // trigger the save middleware
    await updatedItem.save();
    res.status(200).json({ updatedItem });
  });
const createOne = (model) =>
  asyncHandler(async (req, res) => {
    console.log('createOne');
    const item = await model.create(req.body);
    res.status(201).json({
      item,
    });
  });

const getAll = (Model, searchFields) =>
  asyncHandler(async (req, res) => {
    const findOptions = req.findOptions || {};
    console.log('findOptions : ', findOptions);
    const numberOfDocuments = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(findOptions), req.query)
      .pagination(numberOfDocuments)
      .search(searchFields)
      .select()
      .sort();
    const { dbQuery, paginationResult } = apiFeatures;
    const itemsList = await dbQuery;
    res.status(200).json({
      paginationInfos: {
        results: itemsList.length,
        ...paginationResult,
      },
      itemsList,
    });
  });
module.exports = {
  deleteOne,
  getOne,
  updateOne,
  createOne,
  getAll,
};
