const Joi = require("joi");

const emailValidator = (data) =>
  Joi.object().keys({ email: Joi.string().email().required() }).validate(data);

module.exports = emailValidator;
