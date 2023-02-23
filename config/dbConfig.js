const mongoose = require('mongoose');
require('dotenv').config();

module.exports = () => {
  mongoose.set('strictQuery', false);
  mongoose.connect(process.env.DB_URI).then((conn) => {
    console.log(`the db connected to ${conn.connection.host}`);
  });
};
