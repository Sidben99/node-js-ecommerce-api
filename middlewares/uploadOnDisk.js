const multer = require('multer');
const { v4 } = require('uuid');
const path = require('path');
const ApiError = require('../utils/apiError');

const uploadFiles = (docName, uploadInfos) => {
  const [[uploadMethod, uploadValue]] = Object.entries(uploadInfos);
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      console.log('file : ', file);
      cb(null, path.join(__dirname, '..', 'uploads', docName));
    },
    filename: (req, file, cb) => {
      const [, extention] = file.mimetype.split('/');
      cb(null, `${docName}-${v4()}-${Date.now()}.${extention}`);
    },
  });
  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new ApiError('only the images are allowed', 400), false);
    }
  };

  const upload = multer({ storage, fileFilter });
  return uploadMethod === 'array'
    ? upload.array(...uploadValue)
    : uploadMethod === 'fields'
    ? upload.fields(uploadValue)
    : upload.single(uploadValue);
};

module.exports = uploadFiles;
