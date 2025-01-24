import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const generateTokenforUser = async (user) => {
    return jwt.sign({
        id: user?._id,
    },
        process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
}

const generateTokenForOtp = async (otp,expire) => {
    return jwt.sign({
        otp,
        expire
    },
        process.env.JWT_SECRET, {
        expiresIn: "5m",
    })
}

const checkUserCookieforAuth = async(cookie) => {
    return jwt.verify(cookie , process.env.JWT_SECRET)
}

export { generateTokenforUser , checkUserCookieforAuth,generateTokenForOtp}