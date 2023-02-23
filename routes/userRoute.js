const route = require('express').Router();

// middlewares
const validationResultHandler = require('../middlewares/validationResultMiddelware');
const addSlugToBody = require('../middlewares/slugifyMiddelware');
const uploadOnMemory = require('../middlewares/uploadOnMemory');
const { processOneImage } = require('../middlewares/imageProcessing');
const removeUnwantedProperties = require('../middlewares/removeUnwantedProperties');

// controllers
const {
  getUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
  getMyProfile,
  changeMyPassword,
  changeMyData,
} = require('../controller/userController');

// auth middlewares
const {
  protectRoutesHandler,
  allowedTo,
} = require('../controller/authController');

// validators
const {
  createUserValidators,
  getUserValidators,
  updateUserValidators,
  deleteUserValidators,
  changePasswordValidators,
  changeMyPasswordValidators,
  updateMyProfileValidators,
} = require('../utils/validators/userValidation');

// protect all the route from unautherized users
route.use(protectRoutesHandler);
// user profile
route
  .route('/myProfile')
  .get(getMyProfile, getUser)
  .put(
    uploadOnMemory({ single: 'profileImg' }),
    processOneImage('users', {
      w: 300,
      h: 300,
      format: 'jpeg',
      quality: 80,
    }),
    removeUnwantedProperties(
      'role',
      'password',
      'changePasswordAt',
      'resetPasswordInfos'
    ),
    updateMyProfileValidators,
    changeMyData
  );
route
  .route('/myProfile/changePassword')
  .put(
    changeMyPasswordValidators,
    validationResultHandler,
    changeMyPassword
  );
//admin | manager
route
  .route('/')
  .get(protectRoutesHandler, allowedTo('admin', 'manager'), getUsers)
  .post(
    protectRoutesHandler,
    allowedTo('admin'),
    uploadOnMemory({ single: 'profileImg' }),
    processOneImage('users', {
      w: 300,
      h: 300,
      format: 'jpeg',
      quality: 80,
    }),
    createUserValidators,
    validationResultHandler,
    addSlugToBody('username'),
    createUser
  );

route
  .route('/:id')
  .get(
    protectRoutesHandler,
    allowedTo('admin', 'manager'),
    getUserValidators,
    validationResultHandler,
    getUser
  )
  .put(
    protectRoutesHandler,
    allowedTo('admin'),
    uploadOnMemory({ single: 'profileImg' }),
    processOneImage('users', {
      w: 300,
      h: 300,
      format: 'jpeg',
      quality: 80,
    }),
    updateUserValidators,
    validationResultHandler,
    addSlugToBody('username'),
    updateUser
  )
  .delete(
    protectRoutesHandler,
    allowedTo('admin'),
    deleteUserValidators,
    validationResultHandler,
    deleteUser
  );

// change password route
route.route('/changePassword/:id').put(
  //(req, res, next) => console.log('change pass body : ', req.body),
  changePasswordValidators,
  validationResultHandler,
  changePassword
);

module.exports = route;
