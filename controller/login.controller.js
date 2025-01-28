import loginSchema from "../models/login.model.js";
import {
  AsyncHandler,
  sendOtp,
} from "../utils/index.utils.js";
import bcrypt from "bcryptjs";

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

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await loginSchema.create({
      name,
      email,
      password: hashedPassword,
    });

    const { data, error, token, otp } = await sendOtp(email, name);

    const encryptedOtp = await bcrypt.hash(otp, salt);

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

    const result = await bcrypt.compare(userotp, encryptedOtp);

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
    console.log(email,password);
    
    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are both required." });
    }
    console.log(email, password);
    
    const user = await loginSchema.findOne({ email });
    console.log(user);
    

    if (!user) {
      return res.status(404).json({ message: "User not found." });  // Changed to 404 for user not found
    }

    const verifyPassword = await bcrypt.compare(password, user.password);
    console.log(verifyPassword);
    

    if (verifyPassword) {
      // const userToken = await generateTokenforUser(user);
      //res.cookie("userToken", userToken, { httpOnly: true, Scure: true });
      return res.status(200).json({ userId: user._id,message: "user log in successfully" });
    } else {
      return res.status(401).json({ message: "Incorrect password." });  // Changed to 401 for incorrect password
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error.", error: error.message });
  }
});




const resendOTP = AsyncHandler(async (req, res) => {
  try {
    const { email, name } = req.body;
    
    // Log incoming request data
    console.log("Received data:", req.body);

    const { data, error, token, otp } = await sendOtp(email, name);
    
    if (error) {
      return res.status(400).json({ message: "Failed to send OTP", error: error });
    }

    const salt = await bcrypt.genSalt(10);  // Define salt for hashing
    const encryptedOtp = await bcrypt.hash(otp, salt);

    const user = await loginSchema.findOne({ email });
    
    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User found and OTP sent successfully",
      userId: user._id,
      otp: encryptedOtp,
    });
  } catch (error) {
    // Log the error for debugging
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

const getCurrentUser = AsyncHandler(async (req, res) => {
  try {
   const {userId} = req.body
   if(!userId) {
    return res.status(400).json({message:"user id is required"})
   }
   const user = await loginSchema.findById(userId).select("-password ")
    return res.status(200).json({ user, message:"user fetched succeessfully" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

const changeUserPassword = AsyncHandler(async (req, res) => {

  try {
    const {password} = req.body
    console.log(password)
    if(!password) {
        return res.status(400).json({message: "password is required"})
    }
    const {userId} = req.body
    console.log(userId)
    if(!userId) {
        return res.status(400).json({message:"user id is required"})
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    console.log(hashedPassword)
    const ack = await loginSchema.findByIdAndUpdate(userId, {$set: {password: hashedPassword}})
    return res.status(200).json({ack,message:"password changed successfully"})
  } catch (error) {
    return res.status(500).json({ message: error });
  }

});

export { registerUser, verifyOpt, loginUser, resendOTP,getCurrentUser,changeUserPassword };
