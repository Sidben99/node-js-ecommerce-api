const multer = require('multer');
const ApiError = require('../utils/apiError');

const uploadOnMemory = (uploadInfos) => {
  const [[uploadMethod, uploadValue]] = Object.entries(uploadInfos);
  const storage = multer.memoryStorage();
  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new ApiError('only the images are allowed', 400), false);
    }
  };

  const upload = multer({ storage, fileFilter });
  return upload[uploadMethod](uploadValue);
};

module.exports = uploadOnMemory;
