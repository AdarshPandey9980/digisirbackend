import loginSchema from "../models/login.model.js";
import {
  AsyncHandler,
  sendOtp,
  generateTokenforUser,
} from "../utils/index.utils.js";
import bcrytp from "bcryptjs";

const registerUser = AsyncHandler(async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All field are required" });
    }

    const userExists = await loginSchema.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "user already exist" });
    }

    const salt = await bcrytp.genSalt(10);
    const hashedPassword = await bcrytp.hash(password, salt);

    const user = await loginSchema.create({
      name,
      email,
      password: hashedPassword,
    });

    const { data, error, token, otp } = await sendOtp(email, name);

    const encryptedOtp = await bcrytp.hash(otp, salt);

    if (error === null) {
      return res.status(200).json({
        message: "User created and OTP Send successfully",
        userId: user._id,
        otp: encryptedOtp,
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
    const { userotp, encryptedOtp } = req.body;
    console.log(userotp, encryptedOtp);

    const result = await bcrytp.compare(userotp, encryptedOtp);

    console.log(result);

    if (!result) {
      return res.status(400).json({ message: "wrong otp pin" });
    }

    const { userId } = req.body;
    console.log(userId);

    if (userId) {
      const ack = await loginSchema.findByIdAndUpdate(userId, {
        $set: { isVerified: true },
      });
      return res.status(200).json({ message: "otp verifyed", ack });
    }
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

const loginUser = AsyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email and password both are required" });
    }
    console.log(email, password);
    
    const user = await loginSchema.findOne({ email });
    console.log(user);
    

    if (!user) {
      return res.status(300).json({ message: "user not found" });
    }

    const verifyPassword = await bcrytp.compare(password, user.password);
    console.log(verifyPassword);
    

    if (verifyPassword) {
      // const userToken = await generateTokenforUser(user);
      //res.cookie("userToken", userToken, { httpOnly: true, Scure: true });
      return res.status(200).json({ userId: user._id,message: "user log in successfully" });
    } else {
      return res.status(300).json({ message: "password incorrect" });
    }
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

const resendOTP = AsyncHandler(async (req, res) => {
  try {
    const { email, name } = req.body;
    const { data, error, token, otp } = await sendOtp(email, name);
    const encryptedOtp = await bcrytp.hash(otp, salt);

    const user = await loginSchema.findOne({ email });

    if (error === null) {
      return res.status(200).json({
        message: "User created and OTP Send successfully",
        userId: user._id,
        otp: encryptedOtp,
      });
    } else {
      return res
        .status(200)
        .json({ message: "User created but faild to send OTP", error: error });
    }
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});


const getCurrentUser = AsyncHandler(async (req, res) => {
  try {
   const {userId} = req.body
   if(!userId) {
    return res.status(400).json({message:"user id is required"})
   }
   const user = await loginSchema.findById(userId)
    return res.status(200).json({ user, message:"user fetched succeessfully" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

const changeUserPassword = AsyncHandler(async (req, res) => {

  try {
    const {password} = req.body
    if(!password) {
        return res.status(400).json({message: "password is required"})
    }
    const {userId} = req.body
    if(!userId) {
        return res.status(400).json({message:"user id is required"})
    }
    const salt = await bcrytp.genSalt(10)
    const hashedPassword = await bcrytp.hash(password, salt)
    const ack = await loginSchema.findByIdAndUpdate(userId, {$set: {password: hashedPassword}})
    return res.status(200).json({ack,message:"password changed successfully"})
  } catch (error) {
    return res.status(500).json({ message: error });
  }

});

export { registerUser, verifyOpt, loginUser, resendOTP,getCurrentUser,changeUserPassword };
