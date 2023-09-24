const { HttpError, contactValidator } = require("../helpers");

const isContactDataValid = (req, res, next) => {
  const { error } = contactValidator(req.body);
  if (error) {
    return next(HttpError(400, "Missing required  field"));
  }
};

module.exports = isContactDataValid;
