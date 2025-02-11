const multer = require("multer");
const path = require("path");

const {
  HttpError,
  ctrlWrapper,
  signUpUserDataValidator,
  loginUserDataValidator,
  emailValidator,
} = require("../helpers");
const { checkUserExists, getUserById } = require("../service/userService");
const { checkToken } = require("../service/jwtService");

const checkSignupUserData = async (req, res, next) => {
  const { error, value } = signUpUserDataValidator(req.body);

  if (error) {
    next(HttpError(400, error.message));
  }

  const result = await checkUserExists({ email: value.email });
  if (result) {
    res.status(409).json({ message: "Email already in use" });
  }

  next();
};

const checkEmail = async (req, res, next) => {
  const { error, value } = emailValidator(req.body);
  console.log(error, value);
  if (error) {
    next(HttpError(400, "Missing required field email"));
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
const tempDir = path.join(__dirname, "../", "temp");

const multerConfig = multer.diskStorage({
  destination: tempDir,
  filename: (req, file, cbk) => {
    cbk(null, file.originalname);
  },
});

const multerFilter = (req, file, cbk) => {
  if (file.mimetype.startsWith("image/")) {
    cbk(null, true);
  } else {
    cbk(HttpError(400, "Wrong file type! Only image file!"), false);
  }
};

const upload = multer({
  storage: multerConfig,
  fileFilter: multerFilter,
}).single("avatar");

module.exports = {
  checkSignupUserData: ctrlWrapper(checkSignupUserData),
  checkEmail: ctrlWrapper(checkEmail),
  checkLoginUserData: ctrlWrapper(checkLoginUserData),
  protect: ctrlWrapper(protect),
  upload,
};
