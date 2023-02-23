const removeUnwantedProperties =
  (...properties) =>
  (req, res, next) => {
    properties.forEach((property) => delete req.body[property]);
    next();
  };

module.exports = removeUnwantedProperties;
