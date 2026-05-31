const express = require('express');
const RegisterController = require("../controllers/userControllers");

const router = express.Router();

router.post("/register", RegisterController);

module.exports = router;