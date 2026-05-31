const userSchema = require("../models/userSchema");
const nodemailer = require("nodemailer");
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

const otpController = async (req, res) => {
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Enter Email",
      });
    }

    const existingUser = await userSchema.findOne({ email });

    if (!existingUser) {
      return res.status(404).send({
        success: false,
        message: "User Not Found",
      });
    }

    // Create OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    existingUser.otp = otp;
    existingUser.otpExpire = Date.now() + 5 * 60 * 1000;

    await existingUser.save();

    // Send OTP Email
    await transport.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Your Login OTP",
      html: `
        <h2>Your Login OTP</h2>
        <h1>${otp}</h1>
        <p>This OTP is valid for 5 minutes.</p>
      `,
    });

    return res.status(200).send({
      success: true,
      message: "OTP sent to your email",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).send({
      success: false,
      message: "Failed to send OTP",
      error: error.message,
    });
  }
};

module.exports = {
  RegisterController,
  LoginController,
  otpController
};  