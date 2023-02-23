const {check} = require("express-validator");

const getCategoryValidators = [
    check("id").isMongoId().withMessage("not a valid id")
]

const createCategoryValidators = [
    check("name").notEmpty()
    .withMessage("the name field should not be empty")
    .isLength({max:32})
    .withMessage("the name is too long")
    .isLength({min:3}).withMessage("the name is too short")
];

const updateCategoryValidators = [
    ...getCategoryValidators,
    ...createCategoryValidators
];

const deleteCategoryValidators = getCategoryValidators;

module.exports= {
    getCategoryValidators,
    createCategoryValidators,
    updateCategoryValidators,
    deleteCategoryValidators
}