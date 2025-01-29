const otpModel = require("../models/otp");
const { otpVerification } = require("../helpers/otpValidate");

const otpGenerator = require("otp-generator");

const twilio = require("twilio");

const accSID = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const twilioClient = new twilio(accSID, authToken);

const sendOtp = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    const cDate = new Date();

    await otpModel.findOneAndUpdate(
      { phoneNumber },
      { otp, otpExpiry: new Date(cDate.getTime()) },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await twilioClient.messages.create({
      body: `Your OTP is ${otp}`,
      to: phoneNumber,
      from: process.env.TWILIO_PHONE_NUMBER,
    });

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;
    const otpData = await otpModel.findOne({
      phoneNumber,
      otp,
    });

    if (!otpData) {
      return res.status(400).json({
        success: false,
        message: "You Entered Wrong OTP!",
      });
    }
    const isOtpExpired = await otpVerification(otpData.otpExpiry);

    if(isOtpExpired){
      return res.status(400).json({
        success: false,
        message: "Your Otp is Expired!",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Your Otp is Verified!",
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  sendOtp,
  verifyOtp,
};
