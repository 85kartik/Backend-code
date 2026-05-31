const userSchema = require("../models/userSchema");
const {
  hashPassword,
  comparePassword,
} = require("../helpers/authHelper");

// REGISTER
const RegisterController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(401).send({
        success: false,
        message: "Enter all fields",
      });
    }

    const existingUser = await userSchema.findOne({ email });

    if (existingUser) {
      return res.status(400).send({
        success: false,
        message: "User already registered",
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await userSchema.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(200).send({
      success: true,
      message: "Register successful",
      user,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).send({
      success: false,
      message: "Register failed",
    });
  }
};

// LOGIN
const LoginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).send({
        success: false,
        message: "Enter all fields",
      });
    }

    const existingUser = await userSchema.findOne({ email });

    if (!existingUser) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    const match = await comparePassword(
      password,
      existingUser.password
    );

    if (!match) {
      return res.status(401).send({
        success: false,
        message: "Invalid password",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Login successful",
      user: existingUser,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).send({
      success: false,
      message: "Login failed",
    });
  }
};

module.exports = {
  RegisterController,
  LoginController,
};