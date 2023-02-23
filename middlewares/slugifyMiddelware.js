const slugify = require('slugify');

const addSlugToBody = (fieldName) => (req, res, next) => {
  const field = req.body[fieldName];
  if (field) req.body.slug = slugify(field);
  next();
};

module.exports = addSlugToBody;
