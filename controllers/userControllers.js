const userSchema = require("../models/userSchema");
const crypto = require("crypto");
const {
  hashPassword,
  comparePassword,
} = require("../helpers/authHelper");
const RegisterController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // validation
    if (!name || !email || !password) {
      return res.status(401).send({
        success: false,
        message: "Enter all fields",
      });
    }

    // check existing user
    const existingUser = await userSchema.findOne({ email });

    if (existingUser) {
      return res.status(400).send({
        success: false,
        message: "User already registered",
      });
    }
		 // HASH PASSWORD
    const hashedPassword =
      await hashPassword(password);
    // create user
    const user = await userSchema.create({
      name,
      email,
      password:hashedPassword,
    });

    return res.status(200).send({
      success: true,
      message: "Register successful",
      user,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Register failed",
    });
  }
};

module.exports = RegisterController;	