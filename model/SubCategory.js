const {Schema , model} = require("mongoose");

const subCategorySchema = new Schema({
    name : {
        type : String,
        required : [true , "the sname should be specified"],
        trim : true,
        unique : [true , "this name is already exist"],
        maxLength : [32 , "the name is too long"],
        minLength : [3 , "the name is too short"]
    },
    slug : {
        type : String , 
    },
    mainCategory : {
        type : Schema.ObjectId,
        ref:'Category',
        required : [true, "the main category should be specified"]
    }
},{timestamps : true})

module.exports = model('SubCategory',subCategorySchema);
