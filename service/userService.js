// const { HttpError } = require("../helpers");
const { HttpError } = require("../helpers");
const User = require("../models/users.model");
const jwtService = require("./jwtService");

const signupUser = async (userData) => {
  const newUserData = {
    ...userData,
  };
  const newUser = await User.create(newUserData);
  newUser.password = undefined;

  const token = jwtService.signToken(newUser.id);
  newUser.token = token;

  return { user: newUser };
};

const checkUserExists = async (email) => {
  const isUserExists = await User.exists(email);
  return isUserExists;
};

const loginUser = async (userData) => {
  const user = await User.findOne({ email: userData.email }).select(
    "+password"
  );
  if (!user) throw HttpError(401, "Unauthorized");

  const passwordIsValid = await user.checkPassword(userData.password);
  console.log(passwordIsValid);

  if (!passwordIsValid) throw HttpError(401, "Unauthorized");

  user.password = undefined;

  const token = jwtService.signToken(user.id);
  user.token = token;

  await User.findByIdAndUpdate(user.id, { token });

  return { user, token };
};

// const logoutUser = async () => {};

const getUsers = async () => await User.find();

const getUserById = async (id) => await User.findById(id);

module.exports = {
  signupUser,
  getUsers,
  checkUserExists,
  loginUser,
  getUserById,
  //   logoutUser,
};
