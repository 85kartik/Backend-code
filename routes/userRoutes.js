const express = require("express");
const {
  RegisterController,
  LoginController,
  otpController
} = require("../controllers/userControllers");

const router = express.Router();

router.post("/register", RegisterController);
router.post("/login", LoginController);
router.post("/otp",otpController);

module.exports = router;