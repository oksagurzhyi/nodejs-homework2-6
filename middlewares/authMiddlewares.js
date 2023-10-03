const {
  HttpError,
  ctrlWrapper,
  signUpUserDataValidator,
  loginUserDataValidator,
} = require("../helpers");
const { checkUserExists, getUserById } = require("../service/userService");
const { checkToken } = require("../service/jwtService");

const checkSignupUserData = async (req, res, next) => {
  const { error, value } = signUpUserDataValidator(req.body);
  console.log(error, value);

  if (error) {
    next(HttpError(400, error.message));
  }

  const result = await checkUserExists({ email: value.email });
  if (result) {
    res.status(409).json({ message: "Email already in use" });
  }

  next();
};

const checkLoginUserData = async (req, res, next) => {
  const { error } = loginUserDataValidator(req.body);

  if (error) {
    res.status(400).json({ message: "Bad request" });
  }
  next();
};

const protect = async (req, res, next) => {
  console.log(req.headers.authorization);
  const token =
    req.headers.authorization?.startsWith("Bearer") &&
    req.headers.authorization.split(" ")[1];
  const userId = checkToken(token);
  const currentUser = await getUserById(userId);
  console.log(currentUser);
  if (!currentUser) throw HttpError(401, "Not logged in...");
  req.user = currentUser;
  next();
};

module.exports = {
  checkSignupUserData: ctrlWrapper(checkSignupUserData),
  checkLoginUserData: ctrlWrapper(checkLoginUserData),
  protect: ctrlWrapper(protect),
};
