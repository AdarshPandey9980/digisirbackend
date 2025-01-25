import jwt from "jsonwebtoken";

export const verifyJwt = async (req, res, next) => {
  try {
    const token =
      req?.cookies?.userToken ||
      req.header("Authorization")?.replace("Bearer", "");

    if (!token) {
      res.status(300).json({ message: "unauthorized access" });
    }

    const userId = jwt.verify(token, process.env.SECRET_TOKEN);

    if (!userId) {
      res.status(300).json({ message: "Invalid token detail" });
    }

    const user = await User.findById(userId.id)

    req.user = user;

    next();
  } catch (error) {
    throw new Error(error.message);
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