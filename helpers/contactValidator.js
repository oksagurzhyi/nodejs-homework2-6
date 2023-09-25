const Joi = require("joi");

const contactValidator = (data) =>
  Joi.object()
    .options({ abortEarly: false })
    .keys({
      name: Joi.string().min(3).required(),
      email: Joi.string(),
      phone: Joi.string().min(5),
    })
    .validate(data);

module.exports = contactValidator;
