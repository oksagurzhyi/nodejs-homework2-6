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

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;

  await userService.verificationEmail(verificationToken);
  res.status(200).json({
    message: "Verification successful",
  });
};

const recheckingEmail = async (req, res) => {
  const { email } = req.body;
  await userService.recheckEmail(email);
  res.status(200).json({
    message: "Verification email sent",
  });
};

const getCurrentUser = (req, res) => {
  res.status(200).json({
    message: "Success",
    user: req.user,
  });
};

const updateAvatar = async (req, res) => {
  const updatedAvatar = await userService.updateAvatarImage(req.user, req.file);

  res.status(200).json({
    message: "Success",
    avatarURL: updatedAvatar.avatarURL,
  });
};

module.exports = {
  signup: ctrlWrapper(signup),
  verifyEmail: ctrlWrapper(verifyEmail),
  recheckingEmail: ctrlWrapper(recheckingEmail),
  getAllUsers: ctrlWrapper(getAllUsers),
  login: ctrlWrapper(login),
  getCurrentUser: ctrlWrapper(getCurrentUser),
  logout: ctrlWrapper(logout),
  updateAvatar: ctrlWrapper(updateAvatar),
};
