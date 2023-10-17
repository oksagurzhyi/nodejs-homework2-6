const gravatar = require("gravatar");
const path = require("path");
const uuid = require("uuid").v4;
const fs = require("fs/promises");
const nodemailer = require("nodemailer");

const { HttpError } = require("../helpers");
const User = require("../models/users.model");
const jwtService = require("./jwtService");
const { resizeImage } = require("./resizeImage");
const { BASE_URL } = process.env;

const signupUser = async (userData) => {
  const newUserData = {
    ...userData,
  };
  const { email } = newUserData;

  const avatarURL = gravatar.url(email);
  const verificationToken = uuid();

  const newUser = await User.create({
    ...newUserData,
    avatarURL,
    verificationToken,
  });

  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const emailConfig = {
    to: newUser.email,
    from: "oksa@gmail.com",
    subject: "Verify email",
    html: `<a target="_blank" href=${BASE_URL}/api/users/verify/${verificationToken}>Click to verify Email</a>`,
  };
  await transport.sendMail(emailConfig);

  newUser.password = undefined;

  const token = jwtService.signToken(newUser.id);

  newUser.token = token;

  return { user: newUser };
};

const verificationEmail = async (verificationToken) => {
  const user = await User.findOne({ verificationToken });

  if (!user) {
    throw HttpError(404, "Not found");
  }

  await User.findByIdAndUpdate(user.id, {
    veryfied: true,
    verificationToken: "",
  });
};

const recheckEmail = async (email) => {
  const user = await User.findOne({ email });
  console.log(user);
  if (user.veryfied) {
    throw HttpError(400, "Verification has already been passed");
  }
  console.log(123);
  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const emailConfig = {
    to: user.email,
    from: "oksa@gmail.com",
    subject: "Verify email",
    html: `<a target="_blank" href=${BASE_URL}/api/users/verify/${user.verificationToken}>Click to verify Email</a>`,
  };
  await transport.sendMail(emailConfig);
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

  if (!user.veryfied) throw HttpError(401, "Unauthorized");

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
  verificationEmail,
  recheckEmail,
  getUsers,
  checkUserExists,
  loginUser,
  getUserById,
  updateAvatarImage,
};
