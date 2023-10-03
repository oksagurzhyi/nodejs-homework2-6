const userService = require("../service/userService");
const { ctrlWrapper } = require("../helpers");
const User = require("../models/users.model");

const getAllUsers = async (req, res) => {
  const result = await userService.getUsers();
  res.status(200).json(result);
};

const signup = async (req, res) => {
  const { user, token } = await userService.signupUser(req.body);
  res.status(201).json({ user, token });
};

const login = async (req, res) => {
  const { user, token } = await userService.loginUser(req.body);
  res.status(201).json({ user, token });
};

const logout = async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { token: null });
  res.json({ message: "logout success" });
};

const getCurrentUser = (req, res) => {
  res.status(200).json({
    message: "Success",
    user: req.user,
  });
};

module.exports = {
  signup: ctrlWrapper(signup),
  getAllUsers: ctrlWrapper(getAllUsers),
  login: ctrlWrapper(login),
  getCurrentUser: ctrlWrapper(getCurrentUser),
  logout: ctrlWrapper(logout),
};
