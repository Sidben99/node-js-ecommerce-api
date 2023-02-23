const jwt = require('jsonwebtoken');

const createToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET_CODE, {
    expiresIn: process.env.JWT_EXP_TIME,
  });

const verifyToken = (token) =>
  jwt.verify(token, process.env.JWT_SECRET_CODE);

module.exports = { createToken, verifyToken };
