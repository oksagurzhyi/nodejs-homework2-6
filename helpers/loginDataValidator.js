const Joi = require("joi");

const loginUserDataValidator = (data) =>
  Joi.object()
    .keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    })
    .validate(data);

module.exports = loginUserDataValidator;
