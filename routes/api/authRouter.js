const express = require("express");
const router = express.Router();
const authCtrl = require("../../controlllers/authController");
const { authMdlw } = require("../../middlewares");

router.post("/signup", authMdlw.checkSignupUserData, authCtrl.signup);
router.post("/login", authMdlw.checkLoginUserData, authCtrl.login);
router.get("/current", authMdlw.protect, authCtrl.getCurrentUser);
router.post("/logout", authMdlw.protect, authCtrl.logout);
router.patch(
  "/avatar",
  authMdlw.protect,
  authMdlw.upload,
  authCtrl.updateAvatar
);

module.exports = router;
