const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Enter Name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Enter Email"],
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Enter Password"],
    trim: true,
    minlength: 6,
  },
});

module.exports = mongoose.model('user', userSchema);