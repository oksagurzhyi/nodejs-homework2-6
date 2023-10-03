const Joi = require("joi");
const { PASSWD_REGEX } = require("../constants/regexPassword");

const signUpUserDataValidator = (data) =>
  Joi.object()
    .options({ abortEarly: false })
    .keys({
      email: Joi.string().email().required(),
      password: Joi.string().regex(PASSWD_REGEX).required(),
    })
    .validate(data);

module.exports = signUpUserDataValidator;
