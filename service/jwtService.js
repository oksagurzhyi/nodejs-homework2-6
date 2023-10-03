const jwt = require("jsonwebtoken");
require("dotenv").config();
const { HttpError } = require("../helpers");

const { SECRET_STRING, JWT_EXPIRES_IN } = process.env;

const signToken = (id) =>
  jwt.sign({ id }, SECRET_STRING, {
    expiresIn: JWT_EXPIRES_IN,
  });

const checkToken = (token) => {
  if (!token) throw HttpError(401, "Not authorized");

  try {
    const { id } = jwt.verify(token, process.env.SECRET_STRING);
    return id;
  } catch (error) {
    throw HttpError(401, "Not authorized");
  }
};

module.exports = { signToken, checkToken };
