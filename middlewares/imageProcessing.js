const asyncHandler = require('express-async-handler');
const sharp = require('sharp');
const { v4 } = require('uuid');
const path = require('path');

const processOneImage = (docName, processOptions) =>
  asyncHandler(async (req, res, next) => {
    if (req.file) {
      // process options
      const { w, h, format, quality } = processOptions;
      // create file name
      const fileName = `${docName}-${v4()}-${Date.now()}.${format}`;
      // create file path
      const filePath = path.join(
        __dirname,
        '..',
        'uploads',
        docName,
        fileName
      );
      // image processing
      await sharp(req.file.buffer)
        .resize(w, h)
        .toFormat(format)
        .jpeg({ quality })
        .toFile(filePath);
      // add the file name to the body for enter it to the DB
      const { fieldname } = req.file;
      req.body[fieldname] = fileName;
    }
    next();
  });

const processMulipleImages = (docName, processOptions, singleFields) =>
  asyncHandler(async (req, res, next) => {
    const {
      w = 500,
      h = 500,
      format = 'jpeg',
      quality = 90,
    } = processOptions;

    if (req.files) {
      // when upload.array has called
      if (Array.isArray(req.files)) {
        //
      }
      // when upload.fields has called
      else {
        const fieldNames = Object.keys(req.files);
        for (let i = 0; i < fieldNames.length; i++) {
          const field = fieldNames[i];
          const fileNames = await Promise.all(
            req.files[field].map(async (file) => {
              // process the file and return the file name of each file to enter it to DB
              const fileName = `${docName}-${v4()}-${Date.now()}.${format}`;
              const filePath = path.join(
                __dirname,
                '..',
                'uploads',
                docName,
                fileName
              );
              await sharp(file.buffer)
                .resize(w, h)
                .toFormat(format)
                [format]({ quality })
                .toFile(filePath);
              return fileName;
            })
          );
          // add file names to req.body
          console.log('fileNames : ', fileNames, ' field : ', field);
          if (singleFields.some((singleField) => singleField === field)) {
            //console.log('single field : ', field);
            //console.log('req.body[field] : ', req.body[field]);
            console.log('field is single : ', field);
            req.body[field] = fileNames[0];
          } else {
            req.body[field] = fileNames;
          }
        }
        //Object.keys(req.files).forEach(async (field) => {
        // add the file name to the body for enter it to the DB

        //});
      }
    }
    next();
  });

module.exports = { processOneImage, processMulipleImages };
