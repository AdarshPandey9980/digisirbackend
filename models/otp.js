const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  otpExpiry: {
    type: Date,
    default: Date.now,
    get: (otpExpiry) => otpExpiry.getTime(),
    set: (otpExpiry) => new Date(otpExpiry),
  },
});

module.exports = mongoose.model("Otp", otpSchema);