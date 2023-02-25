const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const compression = require('compression');
const mongodbConnection = require('./config/dbConfig');

require('dotenv').config();
// connecting to the mongodb
mongodbConnection();

const app = express();
const port = process.env.PORT || 8000;

// middelwares
app.use(morgan('dev'));
app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.static(path.join(__dirname, 'uploads')));
// enabling other domains to start using the api
app.use(cors());
app.options('*', cors());

// compress the responses
app.use(compression());
// routes
const categoryRoute = require('./routes/categoriesRoute');

app.use('/api/v1/category', categoryRoute);

const subCategoryRoute = require('./routes/subCategoryRoute');

app.use('/api/v1/subCategory', subCategoryRoute);

const brandsRoute = require('./routes/brandsRoute');

app.use('/api/v1/brands', brandsRoute);

const productsRoute = require('./routes/ProductRoute');

app.use('/api/v1/products', productsRoute);

const usersRoute = require('./routes/userRoute');

app.use('/api/v1/users', usersRoute);

const authRoute = require('./routes/authRoute');

app.use('/api/v1/auth', authRoute);

const reviewRoute = require('./routes/reviewRoute');

app.use('/api/v1/reviews', reviewRoute);

const wishListRoute = require('./routes/wishListRoute');

app.use('/api/v1/wishList', wishListRoute);

const addressRoute = require('./routes/addressRoute');

app.use('/api/v1/address', addressRoute);

const couponRoute = require('./routes/couponRoute');

app.use('/api/v1/coupons', couponRoute);

const cartRoute = require('./routes/cartRoute');

app.use('/api/v1/cart', cartRoute);

const orderRoute = require('./routes/orderRoute');

app.use('/api/v1/order', orderRoute);

const { webHookCheckout } = require('./controller/orderController');

app.post('/', express.raw({ type: 'application/json' }), webHookCheckout);

const ApiError = require('./utils/apiError');

// catching any not founded routes
app.all('*', (req, res, next) => {
  next(new ApiError(`can't found this route ${req.url}`, 400));
});

// global error handling middleware
const globalErrorHandler = require('./middlewares/globalErrorMiddleware');

app.use(globalErrorHandler);

const server = app.listen(port, () => {
  console.log(`connecting on port ${port}`);
});

// handling rejection errors outside the express
process.on('unhandledRejection', (err) => {
  server.close(() => {
    console.log(`Unhandled rejection Error : ${err}`);
    process.exit(1);
  });
});
