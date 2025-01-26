import jwt from "jsonwebtoken";
import Login from "../models/login.model.js";
<<<<<<< HEAD
=======

>>>>>>> 725c5cbac1eb602f44489a5c5211f652da5437c2
export const verifyJwt = async (req, res, next) => {
  try {
    const token =
      req?.cookies?.userToken || req.header("Authorization")?.replace("Bearer", "");

    // console.log("token",token)

    if (!token) {
     return res.status(300).json({ message: "unauthorized access" });
    }

<<<<<<< HEAD
    const userId = jwt.verify(token, process.env.JWT_SECRET);
=======
    // console.log(token);
    

    const userId = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(userId);
    
>>>>>>> 725c5cbac1eb602f44489a5c5211f652da5437c2

    if (!userId) {
     return res.status(300).json({ message: "Invalid token detail" });
    }
<<<<<<< HEAD
    
    const user = await Login.findById(userId)
    console.log(user);
=======

    const user = await Login.findById(userId.id).select("-password -isVerified");

    if (!user) {
      return res.status(300).json({ message: "user not found" });
    }

>>>>>>> 725c5cbac1eb602f44489a5c5211f652da5437c2
    req.user = user;

    next();
  } catch (error) {
    return res.status(400).json({message: error.message})
  } 
};

export const verifyOTPJwt = async (req, res, next) => {
    try {
      const token =
        req?.cookies?.OTPtoken ||
        req.header("Authorization")?.replace("Bearer", "");
  
      if (!token) {
        res.status(300).json({ message: "OTP time expired or failed to send OTP" });
      }
  
      const data = jwt.verify(token, process.env.JWT_SECRET);
  
      if (!data) {
        res.status(300).json({ message: "Invalid token detail" });
      }
  
      req.otp = data;
  
      next();
    } catch (error) {
      return res.status(400).json({message:"something went wrong"})
    } 
  };