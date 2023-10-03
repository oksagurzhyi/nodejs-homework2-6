const { HttpError, contactValidator } = require("../helpers");

const validateBody = (schema) => {
  const fun = (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      next(HttpError(400, error.message));
    }
    next();
  };
  return fun;
};

const isContactDataValid = (req, res, next) => {
  const { error } = contactValidator(req.body);
  if (error) {
    return next(HttpError(400, "Missing required  field"));
  }
  next();
};

module.exports = { validateBody, isContactDataValid };
