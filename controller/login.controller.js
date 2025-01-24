import loginSchema from "../models/login.model.js";
import {
  AsyncHandler,
  sendOtp,
  generateTokenforUser
} from "../utils/index.utils.js";
import bcrytp from "bcryptjs";

const registerUser = AsyncHandler(async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({message:"All field are required"});
    }

    const userExists = await loginSchema.findOne({ email });

    if (userExists) {
      return res.status(400).json({message:"user already exist"});
    }

    const salt = await bcrytp.genSalt(10);
    const hashedPassword = await bcrytp.hash(password, salt);

    const user = await loginSchema.create({
      name,
      email,
      password: hashedPassword,
    });

    const { data, error, token } = await sendOtp(email, name);

    if (error === null) {
      res.cookie("userId", user._id, {  httpOnly: true });
      res.cookie("OTPtoken", token, { maxAge: 300000, httpOnly: true });
      return res.status(200).json({
        message: "User created and OTP Send successfully",
        data: data,
      });
    } else {
      return res
        .status(200)
        .json({ message: "User created but faild to send OTP", error: error });
    }
  } catch (error) {
    return res.status(400).json(error);
  }
});

const verifyOpt = AsyncHandler(async (req, res) => {
  try {
    const { userotp } = req.body;
    const { otp } = req.otp;

    const userId =
      req?.cookies?.userId ||
      req.header("Authorization")?.replace("Bearer", "");

    if (!userId) {
      res.status(300).json({ message: "Something went wrong" });
    }

    if (!userotp) {
      return res.status(400).json({ message: "OTP is required" });
    }

    if (!otp) {
      return res.status(400).json({ message: "OTP not send" });
    }    

    if (userotp === otp) {
      const ack = await loginSchema.findByIdAndUpdate( userId , {$set: {isVerified: true} });
      res.clearCookie('userId');
      res.clearCookie('OTPtoken')
      return res.status(200).json({message: "otp verifyed", ack})
    } else {
      await res.status(200).json({ message: "wrong otp pin" });
    }

  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

const loginUser = AsyncHandler(async (req, res) => {
    try {
        const {email, password} = req.body
        if (!email || !password) {
            return res.status(400).json({message:"email and password both are required"})
        }
        const user = await loginSchema.findOne({email})

        if (!user) {
          return res.status(300).json({message:"user not found"})
        }

        const verifyPassword = await bcrytp.compare(password,user.password);


        if (verifyPassword) {
            const userToken = await generateTokenforUser(user)
            res.cookie("userToken",userToken,{ httpOnly: true })
            return res.status(200).json({message: "user log in successfully"})
        } else {
            return res.status(300).json({message: "password incorrect"})
        }

    } catch (error) {
        return res.status(500).json({message:error})
    }
});


const resendOTP = AsyncHandler(async(req,res) => {
    try {
        const {email,name} = req.body
        const { data, error, token } = await sendOtp(email, name);
        if (error === null) {
            res.cookie("OTPtoken", token, { maxAge: 300000, httpOnly: true });
            return res.status(200).json({
              message: "OTP resend successfully",
              data: data,
            });
          } else {
            return res
              .status(200)
              .json({ message: "failed to send otp", error: error });
          }
    } catch (error) {
        
    }
})

export { registerUser, verifyOpt, loginUser, resendOTP };
