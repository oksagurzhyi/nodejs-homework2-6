const gravatar = require("gravatar");
const path = require("path");
const uuid = require("uuid").v4;
const fs = require("fs/promises");

const { HttpError } = require("../helpers");
const User = require("../models/users.model");
const jwtService = require("./jwtService");
const { resizeImage } = require("./resizeImage");

const signupUser = async (userData) => {
  const newUserData = {
    ...userData,
  };
  const { email } = newUserData;

  const avatarURL = gravatar.url(email);
  console.log(avatarURL);

  const newUser = await User.create({ ...newUserData, avatarURL });

  newUser.password = undefined;

  const token = jwtService.signToken(newUser.id);

  newUser.token = token;
  console.log(newUser);
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

  if (!passwordIsValid) throw HttpError(401, "Unauthorized");

  user.password = undefined;

  const token = jwtService.signToken(user.id);
  user.token = token;

  await User.findByIdAndUpdate(user.id, { token });

  return { user, token };
};

const updateAvatarImage = async (user, file) => {
  const avatarName = `${uuid()}-${file.filename}`;

  const destinationDir = path.join(
    __dirname,
    "../",
    "public",
    "avatars",
    avatarName
  );

  await fs.rename(file.path, destinationDir);

  await resizeImage(destinationDir, 250, 250);

  const avatarURL = path.join("avatars", avatarName);

  const updetedAvatar = await User.findByIdAndUpdate(
    user.id,
    { avatarURL },
    { new: true }
  );
  return updetedAvatar;
};

const getUsers = async () => await User.find();

const getUserById = async (id) => await User.findById(id);

module.exports = {
  signupUser,
  getUsers,
  checkUserExists,
  loginUser,
  getUserById,
  updateAvatarImage,
};
